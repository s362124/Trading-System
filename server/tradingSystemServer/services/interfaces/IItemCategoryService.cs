using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;
using tradingSystemServer.models;

namespace tradingSystemServer.services.interfaces
{
    public interface IItemCategoryService
    {
        public Task<List<ItemCategory>> GetAsync();
        public Task<ItemCategory?> GetAsync(string id);
        public Task CreateAsync(ItemCategory newItemCategory);
        public Task UpdateAsync(string id, ItemCategory updatedItemCategory);
        public Task RemoveAsync(string id);
    }
}
