using Microsoft.Extensions.Options;
using MongoDB.Driver;
using tradingSystemServer.DTO;
using tradingSystemServer.models;
using System.Collections.Generic;
using System.Threading.Tasks;
using  tradingSystemServer.services.interfaces;
namespace tradingSystemServer.services
{
    // Service class to handle item category-related operations
    public class ItemCategoryService : IItemCategoryService
    {
        // MongoDB collections for items and item categories
        private readonly IMongoCollection<Item> _itemCollection;
        private readonly IMongoCollection<ItemCategory> _itemCategoryCollection;

        // Constructor to initialize ItemCategoryService with database settings
        public ItemCategoryService(IOptions<TradingSystemDatabaseSettings> tradingSystemDatabaseSettings)
        {
            // Create a MongoDB client and get the database and collections
            var mongoClient = new MongoClient(tradingSystemDatabaseSettings.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(tradingSystemDatabaseSettings.Value.DatabaseName);

            // Set the collections
            _itemCollection = mongoDatabase.GetCollection<Item>(tradingSystemDatabaseSettings.Value.ItemCollectionName);
            _itemCategoryCollection = mongoDatabase.GetCollection<ItemCategory>(tradingSystemDatabaseSettings.Value.ItemCategoryCollectionName);
        }

        // Retrieve all item categories asynchronously
        public async Task<List<ItemCategory>> GetAsync() =>
            await _itemCategoryCollection.Find(_ => true).ToListAsync();

        // Retrieve an item category by ID asynchronously
        public async Task<ItemCategory?> GetAsync(string id) =>
            await _itemCategoryCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

        // Create a new item category asynchronously
        public async Task CreateAsync(ItemCategory newItemCategory) =>
            await _itemCategoryCollection.InsertOneAsync(newItemCategory);

        // Update an item category asynchronously
        public async Task UpdateAsync(string id, ItemCategory updatedItemCategory) =>
            await _itemCategoryCollection.ReplaceOneAsync(x => x.Id == id, updatedItemCategory);

        // Remove an item category asynchronously
        public async Task RemoveAsync(string id) =>
            await _itemCategoryCollection.DeleteOneAsync(x => x.Id == id);
    }
}
