using Core.Entities;
using Core.Interfaces;
using Microsoft.Extensions.Configuration;
using Stripe;

namespace Infrastructure.Services;

public class PaymentService : IPaymentService
{
    private readonly IConfiguration _config;
    private readonly ICartService _cartService;
    private readonly IGenericRepository<Core.Entities.Product> _productRepo;
    private readonly IGenericRepository<DeliveryMethod> _deliveryRepo;

    public PaymentService(IConfiguration config, ICartService cartService,
        IGenericRepository<Core.Entities.Product> productRepo,
        IGenericRepository<DeliveryMethod> deliveryRepo)
    {
        _config = config;
        _cartService = cartService;
        _productRepo = productRepo;
        _deliveryRepo = deliveryRepo;
    }

    public async Task<ShoppingCart?> CreateOrUpdatePaymentIntent(string cartId)
    {
        StripeConfiguration.ApiKey = _config["StripeSettings:SecretKey"];

        var cart = await _cartService.GetCartAsync(cartId);
        if (cart == null) return null;

        var shippingPrice = 0m;

        if (cart.DeliveryMethodId.HasValue)
        {
            var deliveryMethod = await _deliveryRepo.GetByIdAsync((int)cart.DeliveryMethodId);
            if (deliveryMethod != null)
            {
                shippingPrice = deliveryMethod.Price;
            }
        }

        foreach (var item in cart.Items)
        {
            var productItem = await _productRepo.GetByIdAsync(item.ProductId);
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
            var options = new PaymentIntentUpdateOptions
            {
                Amount = amount
            };
            intent = await service.UpdateAsync(cart.PaymentIntentId, options);
        }

        await _cartService.SetCartAsync(cart);
        return cart;
    }
}