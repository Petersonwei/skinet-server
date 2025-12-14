using System.Text.Json;
using Core.Entities;
using Microsoft.AspNetCore.Identity;

namespace Infrastructure.Data;

public class StoreContextSeed
{
    public static async Task SeedAsync(StoreContext context, UserManager<AppUser> userManager)
    {
        if (!context.Products.Any())
        {
            var productsData = await File.ReadAllTextAsync("../Infrastructure/Data/SeedData/products.json");

            var products = JsonSerializer.Deserialize<List<Product>>(productsData);

            if (products == null) return;

            context.Products.AddRange(products);
            await context.SaveChangesAsync();
        }

        if (!userManager.Users.Any())
        {
            var user = new AppUser
            {
                FirstName = "Test",
                LastName = "User",
                Email = "test@example.com",
                UserName = "test@example.com",
                EmailConfirmed = true
            };

            var result = await userManager.CreateAsync(user, "Pa$$w0rd");
            if (result.Succeeded)
            {
                Console.WriteLine("Test user created successfully");
            }
            else
            {
                Console.WriteLine($"Failed to create test user: {string.Join(", ", result.Errors.Select(e => e.Description))}");
            }
        }
    }
}
