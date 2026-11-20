using System.ComponentModel.DataAnnotations;

namespace CineMinha.DTOs;

public class SalaCreateDTO
{
    [Required, StringLength(50)] public required string Nome { get; set; }
    [Range(1, 260)] public int Capacidade { get; set; }
    [Required] public string Status { get; set; } = "Ativa";
    [Required, StringLength(100)] public required string Formato { get; set; }
    [Required, StringLength(100)] public required string Som { get; set; }
}
