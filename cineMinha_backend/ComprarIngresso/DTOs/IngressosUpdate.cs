namespace CineMinha.DTOs;

public class IngressoUpdateDTO
{
    public int FilmeId { get; set; }
    public required string NomeCliente { get; set; }
    public DateTime DataSessao { get; set; }
    public TimeSpan Horario { get; set; }
    public int Sala { get; set; }
    public int Quantidade { get; set; }
}

