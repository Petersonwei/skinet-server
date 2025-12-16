using System.ComponentModel.DataAnnotations;

namespace Core.Entities.OrderAggregate;

public class PaymentSummary
{
    [Required]
    public required string Last4 { get; set; }

    [Required]
    public required string Brand { get; set; }

    public int ExpMonth { get; set; }

    public int ExpYear { get; set; }
}