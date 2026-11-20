using System.Text.RegularExpressions;
using CineMinha.DTOs;
using Microsoft.AspNetCore.Mvc;
using MySqlConnector;

namespace CineMinha.Controllers;

[ApiController]
[Route("api/[controller]")]
public class IngressoController(IConfiguration configuration) : ControllerBase
{
    private string ConnectionString => configuration.GetConnectionString("DefaultConnection")
        ?? throw new InvalidOperationException("ConnectionStrings:DefaultConnection não foi configurada.");

    [HttpGet]
    public async Task<ActionResult<IEnumerable<IngressoResponseDTO>>> Get()
    {
        const string sql = """
            SELECT i.id, i.pedido_id, COALESCE(i.sessao_id, 0) AS sessao_id,
                   i.filme_id, f.title AS nome_filme, i.nome_cliente,
                   i.data_sessao, i.horario, i.sala AS sala_id,
                   COALESCE(sl.nome, CONCAT('Sala ', LPAD(i.sala, 2, '0'))) AS nome_sala,
                   i.assento, i.tipo_ingresso, i.valor_unitario,
                   COALESCE(i.forma_pagamento, 'Não informado') AS forma_pagamento,
                   i.status, i.created_at
            FROM ingressos i
            INNER JOIN filmes f ON f.id = i.filme_id
            LEFT JOIN salas sl ON sl.id = i.sala
            ORDER BY i.created_at DESC, i.id DESC
            """;
        await using var connection = new MySqlConnection(ConnectionString);
        await connection.OpenAsync();
        await using var command = new MySqlCommand(sql, connection);
        await using var reader = await command.ExecuteReaderAsync();
        var ingressos = new List<IngressoResponseDTO>();
        while (await reader.ReadAsync()) ingressos.Add(Map(reader));
        return Ok(ingressos);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<IngressoResponseDTO>> GetById(int id)
    {
        const string sql = """
            SELECT i.id, i.pedido_id, COALESCE(i.sessao_id, 0) AS sessao_id,
                   i.filme_id, f.title AS nome_filme, i.nome_cliente,
                   i.data_sessao, i.horario, i.sala AS sala_id,
                   COALESCE(sl.nome, CONCAT('Sala ', LPAD(i.sala, 2, '0'))) AS nome_sala,
                   i.assento, i.tipo_ingresso, i.valor_unitario,
                   COALESCE(i.forma_pagamento, 'Não informado') AS forma_pagamento,
                   i.status, i.created_at
            FROM ingressos i
            INNER JOIN filmes f ON f.id = i.filme_id
            LEFT JOIN salas sl ON sl.id = i.sala
            WHERE i.id = @id
            """;
        await using var connection = new MySqlConnection(ConnectionString);
        await connection.OpenAsync();
        await using var command = new MySqlCommand(sql, connection);
        command.Parameters.AddWithValue("@id", id);
        await using var reader = await command.ExecuteReaderAsync();
        if (!await reader.ReadAsync()) return NotFound(new { message = "Ingresso não encontrado." });
        return Ok(Map(reader));
    }

    [HttpGet("ocupados")]
    public async Task<ActionResult<IEnumerable<string>>> GetOccupiedSeats([FromQuery] int sessaoId)
    {
        if (sessaoId <= 0) return BadRequest(new { message = "Informe um sessaoId válido." });
        await using var connection = new MySqlConnection(ConnectionString);
        await connection.OpenAsync();
        await using var command = new MySqlCommand(
            "SELECT assento FROM ingressos WHERE sessao_id=@sessaoId AND status='Confirmado' ORDER BY assento", connection);
        command.Parameters.AddWithValue("@sessaoId", sessaoId);
        await using var reader = await command.ExecuteReaderAsync();
        var occupied = new List<string>();
        while (await reader.ReadAsync()) occupied.Add(reader.GetString("assento"));
        return Ok(occupied);
    }

    [HttpPost]
    public async Task<IActionResult> Purchase([FromBody] CompraIngressoDTO request)
    {
        if (string.IsNullOrWhiteSpace(request.NomeCliente))
            return BadRequest(new { message = "Informe o nome do cliente." });
        if (request.Assentos.Count == 0)
            return BadRequest(new { message = "Selecione pelo menos um assento." });
        if (request.Assentos.Select(x => x.Assento.Trim().ToUpperInvariant()).Distinct().Count() != request.Assentos.Count)
            return BadRequest(new { message = "A compra contém assentos repetidos." });
        if (request.Assentos.Any(x => !Regex.IsMatch(x.Assento.Trim(), "^[A-Za-z][0-9]{1,2}$")))
            return BadRequest(new { message = "Um ou mais assentos possuem formato inválido." });
        if (request.Assentos.Any(x => x.TipoIngresso is not ("Meia" or "Meia-entrada" or "Inteira")))
            return BadRequest(new { message = "Tipo de ingresso inválido." });
        if (request.FormaPagamento is not ("Pix" or "Cartão de crédito" or "Cartão de débito"))
            return BadRequest(new { message = "Forma de pagamento inválida." });

        await using var connection = new MySqlConnection(ConnectionString);
        await connection.OpenAsync();
        await using var transaction = await connection.BeginTransactionAsync();

        try
        {
            const string sessionSql = """
                SELECT s.filme_id, s.data_sessao, s.horario, s.sala_id,
                       s.valor_meia, s.valor_inteira, s.status, sl.capacidade
                FROM sessoes s INNER JOIN salas sl ON sl.id=s.sala_id
                WHERE s.id=@sessaoId FOR UPDATE
                """;
            int filmeId, salaId, capacidade;
            DateTime dataSessao;
            TimeSpan horario;
            decimal valorMeia, valorInteira;
            string statusSessao;
            var sessionFound = false;
            await using (var sessionCommand = new MySqlCommand(sessionSql, connection, transaction))
            {
                sessionCommand.Parameters.AddWithValue("@sessaoId", request.SessaoId);
                await using var reader = await sessionCommand.ExecuteReaderAsync();
                sessionFound = await reader.ReadAsync();
                if (sessionFound)
                {
                    filmeId = reader.GetInt32("filme_id");
                    dataSessao = reader.GetDateTime("data_sessao");
                    horario = reader.GetTimeSpan("horario");
                    salaId = reader.GetInt32("sala_id");
                    valorMeia = reader.GetDecimal("valor_meia");
                    valorInteira = reader.GetDecimal("valor_inteira");
                    statusSessao = reader.GetString("status");
                    capacidade = reader.GetInt32("capacidade");
                }
                else
                {
                    filmeId = salaId = capacidade = 0;
                    dataSessao = default;
                    horario = default;
                    valorMeia = valorInteira = 0;
                    statusSessao = "";
                }
            }

            if (!sessionFound)
            {
                await transaction.RollbackAsync();
                return NotFound(new { message = "Sessão não encontrada." });
            }

            if (statusSessao != "Programada" || dataSessao.Date.Add(horario) <= DateTime.Now)
            {
                await transaction.RollbackAsync();
                return Conflict(new { message = "Esta sessão não está mais disponível para compra." });
            }
            if (request.Assentos.Count > capacidade)
            {
                await transaction.RollbackAsync();
                return BadRequest(new { message = "A quantidade de assentos excede a capacidade da sala." });
            }

            // Os mapas do app e do site usam até 10 assentos por fileira,
            // identificados por uma letra e o número da cadeira.
            var columns = Math.Min(10, capacidade);
            foreach (var selected in request.Assentos)
            {
                var normalized = selected.Assento.Trim().ToUpperInvariant();
                var rowIndex = normalized[0] - 'A';
                var seatNumber = int.Parse(normalized[1..]);
                var seatIndex = rowIndex * columns + seatNumber - 1;
                if (rowIndex < 0 || rowIndex >= 26 || seatNumber < 1 || seatNumber > columns || seatIndex >= capacidade)
                {
                    await transaction.RollbackAsync();
                    return BadRequest(new { message = $"O assento {normalized} não existe nesta sala." });
                }
            }

            var parameters = request.Assentos.Select((_, index) => $"@seat{index}").ToArray();
            var occupiedSql = $"SELECT assento FROM ingressos WHERE sessao_id=@sessaoId AND status='Confirmado' AND assento IN ({string.Join(",", parameters)}) FOR UPDATE";
            var occupied = new List<string>();
            await using (var occupiedCommand = new MySqlCommand(occupiedSql, connection, transaction))
            {
                occupiedCommand.Parameters.AddWithValue("@sessaoId", request.SessaoId);
                for (var index = 0; index < request.Assentos.Count; index++)
                    occupiedCommand.Parameters.AddWithValue(parameters[index], request.Assentos[index].Assento.Trim().ToUpperInvariant());
                await using var reader = await occupiedCommand.ExecuteReaderAsync();
                while (await reader.ReadAsync()) occupied.Add(reader.GetString("assento"));
            }
            if (occupied.Count > 0)
            {
                await transaction.RollbackAsync();
                return Conflict(new { message = $"Os assentos {string.Join(", ", occupied)} já foram comprados. Atualize o mapa e tente novamente.", assentosOcupados = occupied });
            }

            var pedidoId = Guid.NewGuid().ToString();
            const string insertSql = """
                INSERT INTO ingressos
                    (pedido_id, sessao_id, filme_id, nome_cliente, data_sessao, horario,
                     sala, assento, tipo_ingresso, valor_unitario, forma_pagamento, status)
                VALUES
                    (@pedidoId, @sessaoId, @filmeId, @nomeCliente, @dataSessao, @horario,
                     @sala, @assento, @tipoIngresso, @valorUnitario, @formaPagamento, 'Confirmado')
                """;

            foreach (var seat in request.Assentos)
            {
                var normalizedType = seat.TipoIngresso == "Meia-entrada" ? "Meia" : seat.TipoIngresso;
                var price = normalizedType == "Meia" ? valorMeia : valorInteira;
                await using var insert = new MySqlCommand(insertSql, connection, transaction);
                insert.Parameters.AddWithValue("@pedidoId", pedidoId);
                insert.Parameters.AddWithValue("@sessaoId", request.SessaoId);
                insert.Parameters.AddWithValue("@filmeId", filmeId);
                insert.Parameters.AddWithValue("@nomeCliente", request.NomeCliente.Trim());
                insert.Parameters.AddWithValue("@dataSessao", dataSessao.Date);
                insert.Parameters.AddWithValue("@horario", horario);
                insert.Parameters.AddWithValue("@sala", salaId);
                insert.Parameters.AddWithValue("@assento", seat.Assento.Trim().ToUpperInvariant());
                insert.Parameters.AddWithValue("@tipoIngresso", normalizedType);
                insert.Parameters.AddWithValue("@valorUnitario", price);
                insert.Parameters.AddWithValue("@formaPagamento", request.FormaPagamento);
                await insert.ExecuteNonQueryAsync();
            }

            await transaction.CommitAsync();
            var created = await ReadOrder(pedidoId);
            return Ok(new
            {
                pedidoId,
                quantidade = created.Count,
                valorTotal = created.Sum(x => x.ValorUnitario),
                ingressos = created
            });
        }
        catch (MySqlException ex) when (ex.Number == 1062)
        {
            await transaction.RollbackAsync();
            return Conflict(new { message = "Um ou mais assentos acabaram de ser reservados por outra compra. Atualize o mapa e tente novamente." });
        }
    }

    private async Task<List<IngressoResponseDTO>> ReadOrder(string pedidoId)
    {
        const string sql = """
            SELECT i.id, i.pedido_id, COALESCE(i.sessao_id, 0) AS sessao_id,
                   i.filme_id, f.title AS nome_filme, i.nome_cliente,
                   i.data_sessao, i.horario, i.sala AS sala_id,
                   COALESCE(sl.nome, CONCAT('Sala ', LPAD(i.sala, 2, '0'))) AS nome_sala,
                   i.assento, i.tipo_ingresso, i.valor_unitario,
                   COALESCE(i.forma_pagamento, 'Não informado') AS forma_pagamento,
                   i.status, i.created_at
            FROM ingressos i
            INNER JOIN filmes f ON f.id = i.filme_id
            LEFT JOIN salas sl ON sl.id = i.sala
            WHERE i.pedido_id=@pedidoId ORDER BY i.id
            """;
        await using var connection = new MySqlConnection(ConnectionString);
        await connection.OpenAsync();
        await using var command = new MySqlCommand(sql, connection);
        command.Parameters.AddWithValue("@pedidoId", pedidoId);
        await using var reader = await command.ExecuteReaderAsync();
        var rows = new List<IngressoResponseDTO>();
        while (await reader.ReadAsync()) rows.Add(Map(reader));
        return rows;
    }

    private static IngressoResponseDTO Map(MySqlDataReader reader) => new()
    {
        Id = reader.GetInt32("id"),
        PedidoId = reader.IsDBNull(reader.GetOrdinal("pedido_id"))
            ? $"LEGADO-{reader.GetInt32("id")}"
            : Convert.ToString(reader.GetValue(reader.GetOrdinal("pedido_id")))!,
        SessaoId = reader.GetInt32("sessao_id"),
        FilmeId = reader.GetInt32("filme_id"),
        NomeFilme = reader.GetString("nome_filme"),
        NomeCliente = reader.GetString("nome_cliente"),
        DataSessao = reader.GetDateTime("data_sessao"),
        Horario = reader.GetTimeSpan("horario"),
        SalaId = reader.GetInt32("sala_id"),
        NomeSala = reader.GetString("nome_sala"),
        Assento = reader.GetString("assento"),
        TipoIngresso = reader.GetString("tipo_ingresso"),
        ValorUnitario = reader.GetDecimal("valor_unitario"),
        FormaPagamento = reader.GetString("forma_pagamento"),
        Status = reader.GetString("status"),
        CriadoEm = reader.GetDateTime("created_at")
    };
}
