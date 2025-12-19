using Core.Entities;
using Core.Interfaces;
using Microsoft.Extensions.Configuration;
using Stripe;

namespace Infrastructure.Services;

public class PaymentService : IPaymentService
{
    private readonly IConfiguration _config;
    private readonly ICartService _cartService;
    private readonly IUnitOfWork _unit;

    public PaymentService(IConfiguration config, ICartService cartService, IUnitOfWork unit)
    {
        _config = config;
        _cartService = cartService;
        _unit = unit;
    }

    public async Task<ShoppingCart?> CreateOrUpdatePaymentIntent(string cartId)
    {
        StripeConfiguration.ApiKey = _config["StripeSettings:SecretKey"];

        var cart = await _cartService.GetCartAsync(cartId);
        if (cart == null) return null;

        var shippingPrice = 0m;

        if (cart.DeliveryMethodId.HasValue)
        {
            var deliveryMethod = await _unit.Repository<DeliveryMethod>().GetByIdAsync((int)cart.DeliveryMethodId);
            if (deliveryMethod != null)
            {
                shippingPrice = deliveryMethod.Price;
            }
        }

        foreach (var item in cart.Items)
        {
            var productItem = await _unit.Repository<Core.Entities.Product>().GetByIdAsync(item.ProductId);
            if (productItem != null && item.Price != productItem.Price)
            {
                item.Price = productItem.Price;
            }
        }

        var service = new PaymentIntentService();
        PaymentIntent intent;

        var amount = (long)(cart.Items.Sum(x => x.Quantity * x.Price * 100) + (shippingPrice * 100));

        if (string.IsNullOrEmpty(cart.PaymentIntentId))
        {
            var options = new PaymentIntentCreateOptions
            {
                Amount = amount,
                Currency = "usd",
                PaymentMethodTypes = new List<string> { "card" }
            };
            intent = await service.CreateAsync(options);
            cart.PaymentIntentId = intent.Id;
            cart.ClientSecret = intent.ClientSecret;
        }
        else
        {
            // Get the existing PaymentIntent to check its status
            intent = await service.GetAsync(cart.PaymentIntentId);

            // Only update if the PaymentIntent hasn't succeeded yet
            if (intent.Status != "succeeded")
            {
                var options = new PaymentIntentUpdateOptions
                {
                    Amount = amount
                };
                intent = await service.UpdateAsync(cart.PaymentIntentId, options);
            }
            else
            {
                // If succeeded, create a new PaymentIntent
                var options = new PaymentIntentCreateOptions
                {
                    Amount = amount,
                    Currency = "usd",
                    PaymentMethodTypes = new List<string> { "card" }
                };
                intent = await service.CreateAsync(options);
                cart.PaymentIntentId = intent.Id;
                cart.ClientSecret = intent.ClientSecret;
            }
        }

        await _cartService.SetCartAsync(cart);
        return cart;
    }
}