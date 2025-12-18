using System.ComponentModel.DataAnnotations;
using Core.Entities.OrderAggregate;

namespace API.DTOs;

public class CreateOrderDto
{
    [Required]
    public string CartId { get; set; } = string.Empty;

    public int DeliveryMethodId { get; set; }

    public ShippingAddress ShippingAddress { get; set; } = null!;

    public PaymentSummary PaymentSummary { get; set; } = null!;
}