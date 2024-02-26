using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using tradingSystemServer.models;
using tradingSystemServer.services;
using System.Collections.Generic;
using System.Threading.Tasks;
using  tradingSystemServer.services.interfaces;
namespace tradingSystemServer.Controllers

{
    public class UpdatePasswordModel
        {
            public string NewPassword { get; set; }
        }
    // This controller manages users' data, including profiles and related information
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly UserService _userService;

        public UserController(UserService userService) =>
            _userService = userService;

        // Retrieves all users registered in the database
        [HttpGet]
        public async Task<List<User>> Get() =>
            await _userService.GetAsync();

        // Retrieves a single user by their identifier
        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> Get(string id)
        {
            var user = await _userService.GetAsync(id);

            if (user is null)
            {
                return NotFound();
            }

            return user;
        }

        // Retrieves a user by email
        [HttpGet("email/{email}")]
        public async Task<ActionResult<User>> GetByEmail(string email)
        {
            var user = await _userService.GetAsyncByEmail(email);

            if (user is null)
            {
                return NotFound();
            }

            return user;
        }

        // Creates a user in the database
        [HttpPost]
        public async Task<IActionResult> Post(User newUser)
        {
            await _userService.CreateAsync(newUser);

            return CreatedAtAction(nameof(Get), new { id = newUser.Id }, newUser);
        }

        // Updates a user's data given their id and the data needed to be changed
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, User updatedUser)
        {
            var user = await _userService.GetAsync(id);

            if (user is null)
            {
                return NotFound();
            }

            updatedUser.Id = user.Id;

            await _userService.UpdateAsync(id, updatedUser);

            return NoContent();
        }

        // Updates a user's password given their id and the new password 
        [HttpPut("updatePassword/{id}")]
        public async Task<IActionResult> UpdatePassword(string id, UpdatePasswordModel data)
        {
            try
            {
                await _userService.UpdatePasswordAsync(id, data.NewPassword);
                return Ok(new { message = "Password updated successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Failed to update password: {ex.Message}" });
            }
        }
        // Deletes a user from the database given their id
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var user = await _userService.GetAsync(id);

            if (user is null)
            {
                return NotFound();
            }

            await _userService.RemoveAsync(id);

            return NoContent();
        }

        // Adds an item to favorites of a user given user id and item id

        [HttpPut("addToFavorite/{userId}/{itemId}")]
        public async Task<IActionResult> AddItemToFavorite(string userId, string itemId)
        {
            var res = await _userService.AddItemToFavorite(userId, itemId);
            return res;
        }
        // Adds an item to favorites of a user given user id and item id
        [HttpPut("removeFromFavorite/{userId}/{itemId}")]
        public async Task<IActionResult> removeItemToFavorite(string userId, string itemId)
        {
            var res = await _userService.RemoveItemFromFavorite(userId, itemId);
            return res;
        }
    }
}
