using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;
using tradingSystemServer.models;

namespace tradingSystemServer.services.interfaces
{
    public interface IItemService
    {
         public  Task<List<Item>> GetAsync();
         public  Task<Item?> GetAsync(string id);
         public  Task CreateAsync(Item newItem);
         public  Task UpdateAsync(string id, Item updatedItem);
         public  Task RemoveAsync(string id);
         public  Task<List<Item>> GetAsyncByCategory(string category);
         public  Task<List<Item>> GetAsyncByOwner(string owner);

    }
}
