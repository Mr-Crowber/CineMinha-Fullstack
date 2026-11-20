using CineMinha.DTOs;
using Microsoft.AspNetCore.Mvc;
using MySqlConnector;

namespace CineMinha.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FilmeController(IConfiguration configuration) : ControllerBase
{
    private string ConnectionString => configuration.GetConnectionString("DefaultConnection")
        ?? throw new InvalidOperationException("ConnectionStrings:DefaultConnection não foi configurada.");

    private static FilmeResponseDTO Map(MySqlDataReader reader) => new()
    {
        Id = reader.GetInt32("id"),
        Title = reader.GetString("title"),
        Genre = reader.GetString("genre"),
        Duration = reader.GetString("duration"),
        Rating = reader.GetString("rating"),
        Description = reader.GetString("description"),
        Poster = reader.IsDBNull(reader.GetOrdinal("poster")) ? null : reader.GetString("poster"),
        HeroImage = reader.IsDBNull(reader.GetOrdinal("hero_image")) ? null : reader.GetString("hero_image"),
        HeroTitle = reader.GetString("hero_title"),
        HeroAccent = reader.GetString("hero_accent"),
        Year = reader.IsDBNull(reader.GetOrdinal("year")) ? null : reader.GetInt32("year"),
        Director = reader.IsDBNull(reader.GetOrdinal("director")) ? null : reader.GetString("director"),
        Status = reader.GetString("status"),
        Featured = reader.GetBoolean("featured")
    };

    [HttpGet]
    public async Task<ActionResult<IEnumerable<FilmeResponseDTO>>> Get([FromQuery] bool incluirNaoPublicados = false)
    {
        await using var connection = new MySqlConnection(ConnectionString);
        await connection.OpenAsync();
        var sql = incluirNaoPublicados
            ? "SELECT * FROM filmes ORDER BY id DESC"
            : "SELECT * FROM filmes WHERE status = 'Publicado' ORDER BY featured DESC, id DESC";
        await using var command = new MySqlCommand(sql, connection);
        await using var reader = await command.ExecuteReaderAsync();
        var filmes = new List<FilmeResponseDTO>();
        while (await reader.ReadAsync()) filmes.Add(Map(reader));
        return Ok(filmes);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<FilmeResponseDTO>> GetById(int id)
    {
        await using var connection = new MySqlConnection(ConnectionString);
        await connection.OpenAsync();
        await using var command = new MySqlCommand("SELECT * FROM filmes WHERE id = @id", connection);
        command.Parameters.AddWithValue("@id", id);
        await using var reader = await command.ExecuteReaderAsync();
        if (!await reader.ReadAsync()) return NotFound(new { message = "Filme não encontrado." });
        return Ok(Map(reader));
    }

    [HttpPost]
    public async Task<ActionResult<FilmeResponseDTO>> Post([FromBody] FilmeCreateDTO request)
    {
        if (!ValidStatus(request.Status)) return BadRequest(new { message = "Status inválido. Use Rascunho, Publicado ou Arquivado." });

        const string sql = """
            INSERT INTO filmes
                (title, genre, duration, rating, description, poster, hero_image,
                 hero_title, hero_accent, `year`, director, status, featured)
            VALUES
                (@title, @genre, @duration, @rating, @description, @poster, @heroImage,
                 @heroTitle, @heroAccent, @year, @director, @status, @featured)
            """;

        await using var connection = new MySqlConnection(ConnectionString);
        await connection.OpenAsync();
        await using var command = new MySqlCommand(sql, connection);
        AddMovieParameters(command, request);
        await command.ExecuteNonQueryAsync();
        await using var idCommand = new MySqlCommand("SELECT LAST_INSERT_ID()", connection);
        var id = Convert.ToInt32(await idCommand.ExecuteScalarAsync());
        var created = await ReadById(connection, id);
        return CreatedAtAction(nameof(GetById), new { id }, created);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Put(int id, [FromBody] FilmeUpdateDTO request)
    {
        if (!ValidStatus(request.Status)) return BadRequest(new { message = "Status inválido. Use Rascunho, Publicado ou Arquivado." });
        const string sql = """
            UPDATE filmes SET
                title=@title, genre=@genre, duration=@duration, rating=@rating,
                description=@description, poster=@poster, hero_image=@heroImage,
                hero_title=@heroTitle, hero_accent=@heroAccent, `year`=@year,
                director=@director, status=@status, featured=@featured
            WHERE id=@id
            """;

        await using var connection = new MySqlConnection(ConnectionString);
        await connection.OpenAsync();
        await using var command = new MySqlCommand(sql, connection);
        AddMovieParameters(command, request);
        command.Parameters.AddWithValue("@id", id);
        await command.ExecuteNonQueryAsync();
        await using var exists = new MySqlCommand("SELECT COUNT(*) FROM filmes WHERE id=@id", connection);
        exists.Parameters.AddWithValue("@id", id);
        return Convert.ToInt32(await exists.ExecuteScalarAsync()) == 0 ? NotFound() : NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        await using var connection = new MySqlConnection(ConnectionString);
        await connection.OpenAsync();
        await using var linked = new MySqlCommand("SELECT (SELECT COUNT(*) FROM sessoes WHERE filme_id=@id) + (SELECT COUNT(*) FROM ingressos WHERE filme_id=@id)", connection);
        linked.Parameters.AddWithValue("@id", id);
        if (Convert.ToInt32(await linked.ExecuteScalarAsync()) > 0)
            return Conflict(new { message = "Este filme possui sessões ou ingressos vinculados e não pode ser excluído. Arquive o título para preservar o histórico." });

        await using var command = new MySqlCommand("DELETE FROM filmes WHERE id=@id", connection);
        command.Parameters.AddWithValue("@id", id);
        try
        {
            var affected = await command.ExecuteNonQueryAsync();
            return affected == 0 ? NotFound() : NoContent();
        }
        catch (MySqlException ex) when (ex.Number == 1451)
        {
            return Conflict(new { message = "Este filme possui sessões ou ingressos vinculados e não pode ser excluído." });
        }
    }

    private static bool ValidStatus(string? status) => status is "Rascunho" or "Publicado" or "Arquivado";

    private static void AddMovieParameters(MySqlCommand command, FilmeCreateDTO request)
    {
        command.Parameters.AddWithValue("@title", request.Title.Trim());
        command.Parameters.AddWithValue("@genre", request.Genre.Trim());
        command.Parameters.AddWithValue("@duration", request.Duration.Trim());
        command.Parameters.AddWithValue("@rating", request.Rating.Trim());
        command.Parameters.AddWithValue("@description", request.Description.Trim());
        command.Parameters.AddWithValue("@poster", (object?)request.Poster ?? DBNull.Value);
        command.Parameters.AddWithValue("@heroImage", (object?)request.HeroImage ?? DBNull.Value);
        command.Parameters.AddWithValue("@heroTitle", request.HeroTitle ?? "");
        command.Parameters.AddWithValue("@heroAccent", request.HeroAccent ?? "");
        command.Parameters.AddWithValue("@year", (object?)request.Year ?? DBNull.Value);
        command.Parameters.AddWithValue("@director", (object?)request.Director ?? DBNull.Value);
        command.Parameters.AddWithValue("@status", request.Status);
        command.Parameters.AddWithValue("@featured", request.Featured);
    }

    private async Task<FilmeResponseDTO> ReadById(MySqlConnection connection, int id)
    {
        await using var command = new MySqlCommand("SELECT * FROM filmes WHERE id=@id", connection);
        command.Parameters.AddWithValue("@id", id);
        await using var reader = await command.ExecuteReaderAsync();
        await reader.ReadAsync();
        return Map(reader);
    }
}
