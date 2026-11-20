using System.ComponentModel.DataAnnotations;

namespace CineMinha.DTOs;

public class SessaoCreateDTO
{
    [Range(1, int.MaxValue)] public int FilmeId { get; set; }
    public DateTime DataSessao { get; set; }
    public TimeSpan Horario { get; set; }
    [Range(1, int.MaxValue)] public int SalaId { get; set; }
    [Required, StringLength(60)] public required string Formato { get; set; }
    [Range(typeof(decimal), "0.01", "9999", ParseLimitsInInvariantCulture = true)]
    public decimal ValorInteira { get; set; } = 30m;
    [Range(typeof(decimal), "0.01", "9999", ParseLimitsInInvariantCulture = true)]
    public decimal ValorMeia { get; set; } = 15m;
}
