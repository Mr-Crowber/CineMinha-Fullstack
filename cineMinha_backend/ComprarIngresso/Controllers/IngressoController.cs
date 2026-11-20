```csharp
using Microsoft.AspNetCore.Mvc;
using MySqlConnector;
using CineMinha.Models;
using CineMinha.DTOs;

namespace CineMinha.Controllers;

[ApiController]
[Route("api/[controller]")]
public class IngressoController : ControllerBase
{
    private readonly IConfiguration configuration;

    public IngressoController(IConfiguration configuration)
    {
        this.configuration = configuration;
    }


    [HttpGet]
    public List<IngressoResponseDTO> Get()
    {
        string connectionString =
            configuration.GetConnectionString("DefaultConnection")!;

        using MySqlConnection connection =
            new MySqlConnection(connectionString);

        connection.Open();

        string sql = "SELECT * FROM ingressos";

        using MySqlCommand command =
            new MySqlCommand(sql, connection);

        using MySqlDataReader reader =
            command.ExecuteReader();

        List<IngressoResponseDTO> ingressos =
            new List<IngressoResponseDTO>();

        while (reader.Read())
        {
            IngressoResponseDTO ingresso = new IngressoResponseDTO
            {
                Id = reader.GetInt32("id"),
                FilmeId = reader.GetInt32("filme_id"),
                NomeCliente = reader.GetString("nome_cliente"),
                DataSessao = reader.GetDateTime("data_sessao"),
                Horario = reader.GetTimeSpan("horario"),
                Sala = reader.GetInt32("sala"),
                Quantidade = reader.GetInt32("quantidade"),
                ValorUnitario = reader.GetDecimal("valor_unitario"),
                ValorTotal = reader.GetDecimal("valor_total")
            };

            ingressos.Add(ingresso);
        }

        return ingressos;
    }
    [HttpGet("{id}")]
    public IngressoResponseDTO? GetById(int id)
    {
        string connectionString =
            configuration.GetConnectionString("DefaultConnection")!;

        using MySqlConnection connection =
            new MySqlConnection(connectionString);

        connection.Open();

        string sql =
            "SELECT * FROM ingressos WHERE id = @id";

        using MySqlCommand command =
            new MySqlCommand(sql, connection);

        command.Parameters.AddWithValue("@id", id);

        using MySqlDataReader reader =
            command.ExecuteReader();

        if (reader.Read())
        {
            IngressoResponseDTO ingresso = new IngressoResponseDTO
            {
                Id = reader.GetInt32("id"),
                FilmeId = reader.GetInt32("filme_id"),
                NomeCliente = reader.GetString("nome_cliente"),
                DataSessao = reader.GetDateTime("data_sessao"),
                Horario = reader.GetTimeSpan("horario"),
                Sala = reader.GetInt32("sala"),
                Quantidade = reader.GetInt32("quantidade"),
                ValorUnitario = reader.GetDecimal("valor_unitario"),
                ValorTotal = reader.GetDecimal("valor_total")
            };

            return ingresso;
        }

        return null;
    }

    [HttpPost]
    public IActionResult Post(IngressoCreateDTO request)
    {
        string connectionString =
            configuration.GetConnectionString("DefaultConnection")!;

        using MySqlConnection connection =
            new MySqlConnection(connectionString);

        connection.Open();

        decimal valorUnitario = 30.00m;

        decimal valorTotal =
            valorUnitario * request.Quantidade;

        string sql = """
            INSERT INTO ingressos
            (
                filme_id,
                nome_cliente,
                data_sessao,
                horario,
                sala,
                quantidade,
                valor_unitario,
                valor_total
            )
            VALUES
            (
                @filmeId,
                @nomeCliente,
                @dataSessao,
                @horario,
                @sala,
                @quantidade,
                @valorUnitario,
                @valorTotal
            );

            SELECT LAST_INSERT_ID();
            """;

        using MySqlCommand command =
            new MySqlCommand(sql, connection);

        command.Parameters.AddWithValue(
            "@filmeId",
            request.FilmeId
        );

        command.Parameters.AddWithValue(
            "@nomeCliente",
            request.NomeCliente
        );

        command.Parameters.AddWithValue(
            "@dataSessao",
            request.DataSessao
        );

        command.Parameters.AddWithValue(
            "@horario",
            request.Horario
        );

        command.Parameters.AddWithValue(
            "@sala",
            request.Sala
        );

        command.Parameters.AddWithValue(
            "@quantidade",
            request.Quantidade
        );

        command.Parameters.AddWithValue(
            "@valorUnitario",
            valorUnitario
        );

        command.Parameters.AddWithValue(
            "@valorTotal",
            valorTotal
        );

        int id =
            Convert.ToInt32(command.ExecuteScalar());

        IngressoResponseDTO ingresso =
            new IngressoResponseDTO
            {
                Id = id,
                FilmeId = request.FilmeId,
                NomeCliente = request.NomeCliente,
                DataSessao = request.DataSessao,
                Horario = request.Horario,
                Sala = request.Sala,
                Quantidade = request.Quantidade,
                ValorUnitario = valorUnitario,
                ValorTotal = valorTotal
            };

        return CreatedAtAction(
            nameof(GetById),
            new { id = ingresso.Id },
            ingresso
        );
    }
    [HttpPut("{id}")]
    public IActionResult Put(
        int id,
        IngressoUpdateDTO request
    )
    {
        string connectionString =
            configuration.GetConnectionString("DefaultConnection")!;

        using MySqlConnection connection =
            new MySqlConnection(connectionString);

        connection.Open();

        decimal valorUnitario = 30.00m;

        decimal valorTotal =
            valorUnitario * request.Quantidade;

        string sql = """
            UPDATE ingressos
            SET
                filme_id = @filmeId,
                nome_cliente = @nomeCliente,
                data_sessao = @dataSessao,
                horario = @horario,
                sala = @sala,
                quantidade = @quantidade,
                valor_unitario = @valorUnitario,
                valor_total = @valorTotal
            WHERE id = @id
            """;

        using MySqlCommand command =
            new MySqlCommand(sql, connection);

        command.Parameters.AddWithValue("@id", id);

        command.Parameters.AddWithValue(
            "@filmeId",
            request.FilmeId
        );

        command.Parameters.AddWithValue(
            "@nomeCliente",
            request.NomeCliente
        );

        command.Parameters.AddWithValue(
            "@dataSessao",
            request.DataSessao
        );

        command.Parameters.AddWithValue(
            "@horario",
            request.Horario
        );

        command.Parameters.AddWithValue(
            "@sala",
            request.Sala
        );

        command.Parameters.AddWithValue(
            "@quantidade",
            request.Quantidade
        );

        command.Parameters.AddWithValue(
            "@valorUnitario",
            valorUnitario
        );

        command.Parameters.AddWithValue(
            "@valorTotal",
            valorTotal
        );

        int linhasAlteradas =
            command.ExecuteNonQuery();

        if (linhasAlteradas == 0)
        {
            return NotFound();
        }

        return NoContent();
    }
    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        string connectionString =
            configuration.GetConnectionString("DefaultConnection")!;

        using MySqlConnection connection =
            new MySqlConnection(connectionString);

        connection.Open();

        string sql =
            "DELETE FROM ingressos WHERE id = @id";

        using MySqlCommand command =
            new MySqlCommand(sql, connection);

        command.Parameters.AddWithValue("@id", id);
        int linhasAlteradas =
            command.ExecuteNonQuery();

        if (linhasAlteradas == 0)
        {
            return NotFound();
        }
        return NoContent();
    }
}
```
