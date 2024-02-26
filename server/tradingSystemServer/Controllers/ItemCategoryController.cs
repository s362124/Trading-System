using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using tradingSystemServer.models;
using tradingSystemServer.services;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace tradingSystemServer.Controllers
{
    // This controller is responsible for managing categories data
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ItemCategoryController : ControllerBase
    {
        private readonly ItemCategoryService _itemCategoryService;

        public ItemCategoryController(ItemCategoryService itemCategoryService) =>
            _itemCategoryService = itemCategoryService;

        // Retrieves all categories registered in the database
        [HttpGet]
        [AllowAnonymous]
        public async Task<List<ItemCategory>> Get() =>
            await _itemCategoryService.GetAsync();

        // Retrieves a single category by its identifier
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<ItemCategory>> Get(string id)
        {
            var itemCategory = await _itemCategoryService.GetAsync(id);

            if (itemCategory is null)
            {
                return NotFound();
            }

            return itemCategory;
        }

        // Creates a category in the database
        [HttpPost]
        public async Task<IActionResult> Post(ItemCategory data)
        {
            await _itemCategoryService.CreateAsync(data);

            return CreatedAtAction(nameof(Get), new { id = data.Id }, data);
        }

        // Updates a specific category's data given its id and the data needed to be changed
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, ItemCategory data)
        {
            var itemCategory = await _itemCategoryService.GetAsync(id);

            if (itemCategory is null)
            {
                return NotFound();
            }

            data.Id = itemCategory.Id;

            await _itemCategoryService.UpdateAsync(id, data);

            return NoContent();
        }

        // Deletes a category from the database given its id
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var itemCategory = await _itemCategoryService.GetAsync(id);

            if (itemCategory is null)
            {
                return NotFound();
            }

            await _itemCategoryService.RemoveAsync(id);

            return NoContent();
        }
    }
}
