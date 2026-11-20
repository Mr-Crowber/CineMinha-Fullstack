using System.ComponentModel.DataAnnotations;

namespace CineMinha.DTOs;

public class AssentoCompraDTO
{
    [Required, StringLength(5, MinimumLength = 2)]
    public required string Assento { get; set; }

    [Required]
    public required string TipoIngresso { get; set; }
}

public class CompraIngressoDTO
{
    [Range(1, int.MaxValue)] public int SessaoId { get; set; }
    [Required, StringLength(100)] public required string NomeCliente { get; set; }
    [Required, MinLength(1), MaxLength(12)] public required List<AssentoCompraDTO> Assentos { get; set; }
    [Required, StringLength(40)] public required string FormaPagamento { get; set; }
}

public class IngressoResponseDTO
{
    public int Id { get; set; }
    public required string PedidoId { get; set; }
    public int SessaoId { get; set; }
    public int FilmeId { get; set; }
    public required string NomeFilme { get; set; }
    public required string NomeCliente { get; set; }
    public DateTime DataSessao { get; set; }
    public TimeSpan Horario { get; set; }
    public int SalaId { get; set; }
    public required string NomeSala { get; set; }
    public required string Assento { get; set; }
    public required string TipoIngresso { get; set; }
    public decimal ValorUnitario { get; set; }
    public required string FormaPagamento { get; set; }
    public required string Status { get; set; }
    public DateTime CriadoEm { get; set; }
}
