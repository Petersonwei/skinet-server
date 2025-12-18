using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class OrderItemDto
{
    public int ProductId { get; set; }

    [Required]
    public required string ProductName { get; set; }

    [Required]
    public required string PictureUrl { get; set; }

    public decimal Price { get; set; }

    public int Quantity { get; set; }
}