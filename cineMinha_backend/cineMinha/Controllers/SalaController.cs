using CineMinha.DTOs;
using Microsoft.AspNetCore.Mvc;
using MySqlConnector;

namespace CineMinha.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SalaController(IConfiguration configuration) : ControllerBase
{
    private string ConnectionString => configuration.GetConnectionString("DefaultConnection")
        ?? throw new InvalidOperationException("ConnectionStrings:DefaultConnection não foi configurada.");

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        await using var connection = new MySqlConnection(ConnectionString);
        await connection.OpenAsync();
        await using var command = new MySqlCommand("SELECT id, nome, capacidade, status, formato, som FROM salas ORDER BY id", connection);
        await using var reader = await command.ExecuteReaderAsync();
        var salas = new List<object>();
        while (await reader.ReadAsync())
        {
            salas.Add(new
            {
                id = reader.GetInt32("id"),
                nome = reader.GetString("nome"),
                capacidade = reader.GetInt32("capacidade"),
                status = reader.GetString("status"),
                formato = reader.GetString("formato"),
                som = reader.GetString("som")
            });
        }
        return Ok(salas);
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] SalaCreateDTO request)
    {
        if (request.Status is not ("Ativa" or "Manutenção" or "Inativa"))
            return BadRequest(new { message = "Status de sala inválido." });

        const string sql = """
            INSERT INTO salas (nome, capacidade, status, formato, som)
            VALUES (@nome, @capacidade, @status, @formato, @som)
            """;
        await using var connection = new MySqlConnection(ConnectionString);
        await connection.OpenAsync();
        await using var command = new MySqlCommand(sql, connection);
        command.Parameters.AddWithValue("@nome", request.Nome.Trim());
        command.Parameters.AddWithValue("@capacidade", request.Capacidade);
        command.Parameters.AddWithValue("@status", request.Status);
        command.Parameters.AddWithValue("@formato", request.Formato);
        command.Parameters.AddWithValue("@som", request.Som);
        try
        {
            await command.ExecuteNonQueryAsync();
            await using var idCommand = new MySqlCommand("SELECT LAST_INSERT_ID()", connection);
            var id = Convert.ToInt32(await idCommand.ExecuteScalarAsync());
            return Created($"/api/Sala/{id}", new { id, nome = request.Nome, capacidade = request.Capacidade, status = request.Status, formato = request.Formato, som = request.Som });
        }
        catch (MySqlException ex) when (ex.Number == 1062)
        {
            return Conflict(new { message = "Já existe uma sala com esse nome." });
        }
    }
}
