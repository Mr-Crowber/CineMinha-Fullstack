using CineMinha.DTOs;
using Microsoft.AspNetCore.Mvc;
using MySqlConnector;

namespace CineMinha.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SessaoController(IConfiguration configuration) : ControllerBase
{
    private string ConnectionString => configuration.GetConnectionString("DefaultConnection")
        ?? throw new InvalidOperationException("ConnectionStrings:DefaultConnection não foi configurada.");

    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] int? filmeId = null, [FromQuery] bool todas = false)
    {
        const string sql = """
            SELECT s.id, s.filme_id, f.title AS nome_filme, s.data_sessao, s.horario,
                   s.sala_id, sl.nome AS nome_sala, sl.capacidade, s.formato,
                   s.valor_meia, s.valor_inteira, s.status,
                   COUNT(i.id) AS vendidos
            FROM sessoes s
            INNER JOIN filmes f ON f.id = s.filme_id
            INNER JOIN salas sl ON sl.id = s.sala_id
            LEFT JOIN ingressos i ON i.sessao_id = s.id AND i.status = 'Confirmado'
            WHERE (@filmeId IS NULL OR s.filme_id = @filmeId)
              AND (@todas = 1 OR (TIMESTAMP(s.data_sessao, s.horario) >= NOW() AND s.status = 'Programada'))
            GROUP BY s.id, s.filme_id, f.title, s.data_sessao, s.horario,
                     s.sala_id, sl.nome, sl.capacidade, s.formato,
                     s.valor_meia, s.valor_inteira, s.status
            ORDER BY s.data_sessao, s.horario
            """;
        await using var connection = new MySqlConnection(ConnectionString);
        await connection.OpenAsync();
        await using var command = new MySqlCommand(sql, connection);
        command.Parameters.AddWithValue("@filmeId", (object?)filmeId ?? DBNull.Value);
        command.Parameters.AddWithValue("@todas", todas);
        await using var reader = await command.ExecuteReaderAsync();
        var sessoes = new List<object>();
        while (await reader.ReadAsync())
        {
            var vendidos = Convert.ToInt32(reader["vendidos"]);
            var capacidade = reader.GetInt32("capacidade");
            sessoes.Add(new
            {
                id = reader.GetInt32("id"),
                filmeId = reader.GetInt32("filme_id"),
                nomeFilme = reader.GetString("nome_filme"),
                dataSessao = reader.GetDateTime("data_sessao").ToString("yyyy-MM-dd"),
                horario = reader.GetTimeSpan("horario").ToString(@"hh\:mm"),
                salaId = reader.GetInt32("sala_id"),
                nomeSala = reader.GetString("nome_sala"),
                capacidade,
                formato = reader.GetString("formato"),
                valorMeia = reader.GetDecimal("valor_meia"),
                valorInteira = reader.GetDecimal("valor_inteira"),
                status = reader.GetString("status"),
                vendidos,
                disponiveis = Math.Max(0, capacidade - vendidos)
            });
        }
        return Ok(sessoes);
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] SessaoCreateDTO request)
    {
        if (request.Horario < TimeSpan.Zero || request.Horario >= TimeSpan.FromDays(1))
            return BadRequest(new { message = "Informe um horário válido entre 00:00 e 23:59." });
        if (request.DataSessao.Date.Add(request.Horario) <= DateTime.Now)
            return BadRequest(new { message = "A data e o horário da sessão precisam estar no futuro." });
        if (request.ValorMeia > request.ValorInteira)
            return BadRequest(new { message = "O valor da meia-entrada não pode superar o valor da inteira." });

        const string sql = """
            INSERT INTO sessoes
                (filme_id, data_sessao, horario, sala_id, formato, valor_meia, valor_inteira, status)
            SELECT @filmeId, @data, @horario, @salaId, @formato, @valorMeia, @valorInteira, 'Programada'
            WHERE EXISTS (SELECT 1 FROM filmes WHERE id=@filmeId AND status='Publicado')
              AND EXISTS (SELECT 1 FROM salas WHERE id=@salaId AND status='Ativa')
            """;
        await using var connection = new MySqlConnection(ConnectionString);
        await connection.OpenAsync();
        await using var command = new MySqlCommand(sql, connection);
        command.Parameters.AddWithValue("@filmeId", request.FilmeId);
        command.Parameters.AddWithValue("@data", request.DataSessao.Date);
        command.Parameters.AddWithValue("@horario", request.Horario);
        command.Parameters.AddWithValue("@salaId", request.SalaId);
        command.Parameters.AddWithValue("@formato", request.Formato.Trim());
        command.Parameters.AddWithValue("@valorMeia", request.ValorMeia);
        command.Parameters.AddWithValue("@valorInteira", request.ValorInteira);

        try
        {
            var affected = await command.ExecuteNonQueryAsync();
            if (affected == 0)
                return BadRequest(new { message = "Filme não publicado ou sala inexistente/inativa." });
            await using var idCommand = new MySqlCommand("SELECT LAST_INSERT_ID()", connection);
            var id = Convert.ToInt32(await idCommand.ExecuteScalarAsync());
            return Created($"/api/Sessao/{id}", new { id, filmeId = request.FilmeId, dataSessao = request.DataSessao.ToString("yyyy-MM-dd"), horario = request.Horario.ToString(@"hh\:mm"), salaId = request.SalaId, formato = request.Formato, valorMeia = request.ValorMeia, valorInteira = request.ValorInteira, status = "Programada" });
        }
        catch (MySqlException ex) when (ex.Number == 1062)
        {
            return Conflict(new { message = "Já existe uma sessão nessa sala, data e horário." });
        }
    }
}
