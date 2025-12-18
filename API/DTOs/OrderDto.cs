using System.ComponentModel.DataAnnotations;
using Core.Entities.OrderAggregate;

namespace API.DTOs;

public class OrderDto
{
    public int Id { get; set; }

    public DateTime OrderDate { get; set; }

    [Required]
    public required string BuyerEmail { get; set; }

    [Required]
    public required ShippingAddress ShippingAddress { get; set; }

    [Required]
    public required string DeliveryMethod { get; set; }

    public decimal ShippingPrice { get; set; }

    [Required]
    public required PaymentSummary PaymentSummary { get; set; }

    public List<OrderItemDto> OrderItems { get; set; } = [];

    public decimal Subtotal { get; set; }

    public decimal Total { get; set; }

    [Required]
    public required string Status { get; set; }

    [Required]
    public required string PaymentIntentId { get; set; }
}