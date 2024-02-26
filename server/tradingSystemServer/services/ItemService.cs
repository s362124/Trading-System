using Microsoft.Extensions.Options;
using MongoDB.Driver;
using tradingSystemServer.DTO;
using tradingSystemServer.models;
using System.Collections.Generic;
using System.Threading.Tasks;
using  tradingSystemServer.services.interfaces;
namespace tradingSystemServer.services
{
    // Service class to handle item-related operations
    public class ItemService : IItemService
    {
        // MongoDB collections for items and item categories
        private readonly IMongoCollection<Item> _itemCollection;
        private readonly IMongoCollection<ItemCategory> _itemCategoryCollection;

        // Constructor to initialize ItemService with database settings
        public ItemService(IOptions<TradingSystemDatabaseSettings> tradingSystemDatabaseSettings)
        {
            // Create a MongoDB client and get the database and collections
            var mongoClient = new MongoClient(tradingSystemDatabaseSettings.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(tradingSystemDatabaseSettings.Value.DatabaseName);

            // Set the collections
            _itemCollection = mongoDatabase.GetCollection<Item>(tradingSystemDatabaseSettings.Value.ItemCollectionName);
            _itemCategoryCollection = mongoDatabase.GetCollection<ItemCategory>(tradingSystemDatabaseSettings.Value.ItemCategoryCollectionName);
        }

        // Retrieve all items asynchronously
        public async Task<List<Item>> GetAsync() =>
            await _itemCollection.Find(_ => true).ToListAsync();

        // Retrieve items by category asynchronously
        public async Task<List<Item>> GetAsyncByCategory(string category) =>
            await _itemCollection.Find(x => x.Category == category).ToListAsync();

        // Retrieve items by owner asynchronously
        public async Task<List<Item>> GetAsyncByOwner(string owner) =>
            await _itemCollection.Find(x => x.Owner == owner).ToListAsync();

        // Retrieve an item by ID asynchronously
        public async Task<Item?> GetAsync(string id) =>
            await _itemCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

        // Create a new item asynchronously
        public async Task CreateAsync(Item newItem) =>
            await _itemCollection.InsertOneAsync(newItem);

        // Update an item asynchronously
        public async Task UpdateAsync(string id, Item updatedItem) =>
            await _itemCollection.ReplaceOneAsync(x => x.Id == id, updatedItem);

        // Remove an item asynchronously
        public async Task RemoveAsync(string id) =>
            await _itemCollection.DeleteOneAsync(x => x.Id == id);
    }
}
