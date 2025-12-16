using System.ComponentModel.DataAnnotations;

namespace Core.Entities.OrderAggregate;

public class ProductItemOrdered
{
    public int ProductId { get; set; }

    [Required]
    public required string ProductName { get; set; }

    [Required]
    public required string PictureUrl { get; set; }
}