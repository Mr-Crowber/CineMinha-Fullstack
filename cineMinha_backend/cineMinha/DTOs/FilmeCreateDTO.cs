using System.ComponentModel.DataAnnotations;

namespace CineMinha.DTOs;

public class FilmeCreateDTO
{
    [Required, StringLength(150)] public required string Title { get; set; }
    [Required, StringLength(100)] public required string Genre { get; set; }
    [Required, StringLength(30)] public required string Duration { get; set; }
    [Required, StringLength(20)] public required string Rating { get; set; }
    [Required] public required string Description { get; set; }
    public string? Poster { get; set; }
    public string? HeroImage { get; set; }
    [StringLength(150)] public string HeroTitle { get; set; } = "";
    [StringLength(150)] public string HeroAccent { get; set; } = "";
    [Range(1888, 2200)] public int? Year { get; set; }
    [StringLength(150)] public string? Director { get; set; }
    [Required] public string Status { get; set; } = "Rascunho";
    public bool Featured { get; set; }
}
