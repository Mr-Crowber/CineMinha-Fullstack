
using Microsoft.AspNetCore.Mvc;

namespace CineMinha.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UploadsController : ControllerBase
{
    private readonly IWebHostEnvironment environment;

    private const long MaxFileSize = 5 * 1024 * 1024;

    public UploadsController(IWebHostEnvironment environment)
    {
        this.environment = environment;
    }

    [HttpPost]
    [RequestSizeLimit(MaxFileSize)]
    public async Task<IActionResult> Upload(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest("Nenhum arquivo foi enviado.");
        }

        if (file.Length > MaxFileSize)
        {
            return BadRequest("A imagem deve ter no máximo 5 MB.");
        }

        var allowedTypes = new Dictionary<string, string>
        {
            { ".jpg", "image/jpeg" },
            { ".jpeg", "image/jpeg" },
            { ".png", "image/png" },
            { ".webp", "image/webp" }
        };

        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

        if (!allowedTypes.TryGetValue(extension, out var expectedType) ||
            !string.Equals(file.ContentType, expectedType,
                StringComparison.OrdinalIgnoreCase))
        {
            return BadRequest("Formato de imagem inválido.");
        }

        var uploadsFolder = Path.Combine(
            environment.WebRootPath ?? Path.Combine(environment.ContentRootPath, "wwwroot"),
            "uploads"
        );

        Directory.CreateDirectory(uploadsFolder);

        var fileName = $"{Guid.NewGuid()}{extension}";
        var filePath = Path.Combine(uploadsFolder, fileName);

        await using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        var imageUrl = $"/uploads/{fileName}";

        return Ok(new
        {
            url = imageUrl,
            fileName = fileName
        });
    }
}
