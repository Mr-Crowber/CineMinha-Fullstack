namespace CineMinha.Models;

public class Filme
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public required string Genre { get; set; }
    public required string Duration { get; set; }
    public required string Rating { get; set; }
    public required string Description { get; set; }
    public string? Poster { get; set; }
    public string? HeroImage { get; set; }
    public string HeroTitle { get; set; } = "";
    public string HeroAccent { get; set; } = "";
    public int? Year { get; set; }
    public string? Director { get; set; }
    public string Status { get; set; } = "Rascunho";
    public bool Featured { get; set; }
}
