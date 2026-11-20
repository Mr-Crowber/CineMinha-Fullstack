namespace CineMinha.DTOs;

public class IngressoResponseDTO
{
    public int Id { get; set; }
    public int FilmeId { get; set; }
    public required string NomeFilme { get; set; }
    public required string NomeCliente { get; set; }
    public DateTime DataSessao { get; set; }
    public TimeSpan Horario { get; set; }
    public int Sala { get; set; }
    public int Quantidade { get; set; }
    public decimal ValorUnitario { get; set; }
    public decimal ValorTotal { get; set; }
}