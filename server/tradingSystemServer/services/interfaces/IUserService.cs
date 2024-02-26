using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;
using tradingSystemServer.models;

namespace tradingSystemServer.services.interfaces
{
    public interface IUserService
    {
         public  Task<List<User>> GetAsync();
         public  Task<User?> GetAsync(string id);
         public  Task<User?> GetAsyncByEmail(string email);
         public  Task CreateAsync(User newUser);
         public  Task UpdateAsync(string id, User updatedUser);
         public  Task RemoveAsync(string id);
         public  Task<IActionResult> AddItemToFavorite(string userId, string itemId);
    }
}
