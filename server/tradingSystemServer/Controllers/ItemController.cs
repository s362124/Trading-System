using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using tradingSystemServer.models;
using tradingSystemServer.services;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace tradingSystemServer.Controllers
{
    // This controller is responsible for managing item data
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ItemController : ControllerBase
    {
        private readonly ItemService _itemService;

        public ItemController(ItemService itemService) =>
            _itemService = itemService;

        // Retrieves all items registered in the database
        [HttpGet]
        [AllowAnonymous]
        public async Task<List<Item>> Get() =>
            await _itemService.GetAsync();

        // Retrieves all items filtered by category
        [HttpGet("filterByCategory/{id}")]
        [AllowAnonymous]
        public async Task<List<Item>> GetByCategory(string id) =>
            await _itemService.GetAsyncByCategory(id);

        // Retrieves a single item by its identifier
        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<ActionResult<Item>> Get(string id)
        {
            var item = await _itemService.GetAsync(id);

            if (item is null)
            {
                return NotFound();
            }

            return item;
        }

        // Creates an item in the database
        [HttpPost]
        public async Task<IActionResult> Post(Item data)
        {
            await _itemService.CreateAsync(data);

            return CreatedAtAction(nameof(Get), new { id = data.Id }, data);
        }

        // Updates a specific item's data given its id and the data needed to be changed
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, Item data)
        {
            var item = await _itemService.GetAsync(id);

            if (item is null)
            {
                return NotFound();
            }

            data.Id = item.Id;

            await _itemService.UpdateAsync(id, data);

            return NoContent();
        }

        // Deletes an item from the database given its id
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var item = await _itemService.GetAsync(id);

            if (item is null)
            {
                return NotFound();
            }

            await _itemService.RemoveAsync(id);

            return NoContent();
        }
    }
}
