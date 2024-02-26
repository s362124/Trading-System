using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;
using tradingSystemServer.models;
using  tradingSystemServer.services.interfaces;
using tradingSystemServer.utils;
namespace tradingSystemServer.services
{
    // Service class to handle user-related operations
    public class UserService : IUserService
    {
        // MongoDB collections for users and items
        private readonly IMongoCollection<User> _usersCollection;
        private readonly IMongoCollection<Item> _itemCollection;

        // Constructor to initialize UserService with database settings
        public UserService(IOptions<TradingSystemDatabaseSettings> tradingSystemDatabaseSettings)
        {
            // Create a MongoDB client and get the database and collections
            var mongoClient = new MongoClient(tradingSystemDatabaseSettings.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(tradingSystemDatabaseSettings.Value.DatabaseName);

            // Set the collections
            _usersCollection = mongoDatabase.GetCollection<User>(tradingSystemDatabaseSettings.Value.UsersCollectionName);
            _itemCollection = mongoDatabase.GetCollection<Item>(tradingSystemDatabaseSettings.Value.ItemCollectionName);
        }

        // Retrieve all users asynchronously
        public async Task<List<User>> GetAsync() =>
            await _usersCollection.Find(_ => true).ToListAsync();

        // Retrieve a user by ID asynchronously
        public async Task<User?> GetAsync(string id) =>
            await _usersCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

        // Retrieve a user by email asynchronously
        public async Task<User?> GetAsyncByEmail(string email) =>
            await _usersCollection.Find(x => x.Email == email).FirstOrDefaultAsync();

        // Create a new user asynchronously
        public async Task CreateAsync(User newUser) =>
            await _usersCollection.InsertOneAsync(newUser);

        // Update a user asynchronously
        public async Task UpdateAsync(string id, User updatedUser) =>
            await _usersCollection.ReplaceOneAsync(x => x.Id == id, updatedUser);

        // Remove a user asynchronously
        public async Task RemoveAsync(string id) =>
            await _usersCollection.DeleteOneAsync(x => x.Id == id);
// This method adds an item to a user's list of favorite items in the database.
public async Task<IActionResult> AddItemToFavorite(string userId, string itemId)
{
    // Retrieve the user from the database based on the provided userId.
    var user = await GetAsync(userId);
    
    // If the user is not found, return a BadRequestObjectResult with a message indicating that the user was not found.
    if (user == null)
    {
        return new BadRequestObjectResult(new { message = "User not found" });
    }

    // Define an update operation to add the itemId to the LikedItems array in the user document.
    var updateDefinition = Builders<User>.Update.AddToSet(u => u.LikedItems, itemId);
    
    // Perform the update operation to add the item to the user's favorites.
    var result = await _usersCollection.UpdateOneAsync(u => u.Id == userId, updateDefinition);

    // If the update operation is acknowledged and the modified count is greater than 0, the item was successfully added.
    if (result.IsAcknowledged && result.ModifiedCount > 0)
    {
        // Retrieve the updated user from the database.
        var updatedUser = await GetAsync(userId);
        
        // Return an OkObjectResult with a success message and the updated list of liked items.
        return new OkObjectResult(new { message = "Added to favorite successfully", data = updatedUser?.LikedItems });
    }
    else
    {
        // If the update operation fails, return a BadRequestObjectResult with a failure message.
        return new BadRequestObjectResult(new { message = "Failed to add item to favorites" });
    }
}

// This method removes an item from a user's list of favorite items in the database.
public async Task<IActionResult> RemoveItemFromFavorite(string userId, string itemId)
{
    // Retrieve the user from the database based on the provided userId.
    var user = await GetAsync(userId);
    
    // If the user is not found, return a BadRequestObjectResult with a message indicating that the user was not found.
    if (user == null)
    {
        return new BadRequestObjectResult(new { message = "User not found" });
    }

    // Define an update operation to remove the itemId from the LikedItems array in the user document.
    var updateDefinition = Builders<User>.Update.Pull(u => u.LikedItems, itemId);
    
    // Perform the update operation to remove the item from the user's favorites.
    var result = await _usersCollection.UpdateOneAsync(u => u.Id == userId, updateDefinition);

    // If the update operation is acknowledged and the modified count is greater than 0, the item was successfully removed.
    if (result.IsAcknowledged && result.ModifiedCount > 0)
    {
        // Retrieve the updated user from the database.
        var updatedUser = await GetAsync(userId);
        
        // Return an OkObjectResult with a success message and the updated list of liked items.
        return new OkObjectResult(new { message = "Removed from favorites successfully", data = updatedUser?.LikedItems });
    }
    else
    {
        // If the update operation fails, return a BadRequestObjectResult with a failure message.
        return new BadRequestObjectResult(new { message = "Failed to remove item from favorites" });
    }
}

        // Update a user's password asynchronously
        public async Task UpdatePasswordAsync(string id, string newPassword)
            {
                var existingUser = await _usersCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

                if (existingUser == null)
                {
                // Handle case where user with given ID doesn't exist
                    throw new Exception("User not found");
                }

                // Hash the new password
                var hash = PasswordHasherUtil.HashPassword(newPassword);


            
                // Update only the password field
             var updateDefinition = Builders<User>.Update
                    .Set(u => u.Password, hash.hash)
                    .Set(u => u.Salt, hash.salt);


                // Perform the update
                await _usersCollection.UpdateOneAsync(u => u.Id == id, updateDefinition);
            }
        
    }
}
