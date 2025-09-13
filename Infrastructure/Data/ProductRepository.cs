using System.Security.Cryptography;
using Core.Entities;
using Core.Interfaces;

namespace Infrastructure.Data;

public class ProductRepository : IProductRepository
{
    public void AddProduct(Product product)
    {
        throw new NotImplementedException();
    }

    public void DeleteProduct(Product product)
    {
        throw new NotImplementedException();
    }

    public Task<Product?> GetProductByIdAsync(int id)
    {
        throw new NotImplementedException();
    }

    public Task<IReadOnlyList<Product>> GetProductsAsync()
    {
        throw new NotImplementedException();
    }

    public bool ProductExists(int id)
    {
        throw new NotImplementedException();
    }

    public Task<bool> SaveAllAsync()
    {
        throw new NotImplementedException();
    }

    public Oid UpdateProuct(Product product)
    {
        throw new NotImplementedException();
    }
}
