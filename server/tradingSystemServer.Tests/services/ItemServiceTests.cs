using FakeItEasy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;
using tradingSystemServer.models;
using tradingSystemServer.services;
using tradingSystemServer.services.interfaces;
using Xunit;

namespace tradingSystemServer.Tests.Services
{
    public class ItemServiceTests
    {
        private readonly IItemService _itemService;

        public ItemServiceTests()
        {
            // Creating a fake instance of IItemService using FakeItEasy
            _itemService = A.Fake<IItemService>();
        }

        [Fact]
        public async Task GetAsync_ReturnsListOfItems()
        {
            // Arrange
            var fakeItems = new List<Item>
            {
                new Item { Id = "1", Label = "Computer" },
                new Item { Id = "2", Label = "Chair" }
            };

            // Setting up fake behavior for the GetAsync method
            A.CallTo(() => _itemService.GetAsync()).Returns(Task.FromResult(fakeItems));

            // Act
            var result = await _itemService.GetAsync();

            // Assert
            Assert.Equal(fakeItems, result);
        }

        [Fact]
        public async Task GetAsync_ReturnsItemById()
        {
            // Arrange
            var ItemId = "1";
            var fakeItem = new Item { Id = ItemId, Label = "Computer" };

            // Setting up fake behavior for the GetAsync method with an ID parameter
            A.CallTo(() => _itemService.GetAsync(fakeItem.Id)).Returns(Task.FromResult(fakeItem));

            // Act
            var result = await _itemService.GetAsync(ItemId);

            // Assert
            Assert.Equal(fakeItem, result);
        }

        [Fact]
        public async Task CreateAsync_CreatesNewItem()
        {   
            // Arrange
            var newItem = new Item
            {
                Id="",
                Label = "Hair Drier",
                Price=50
            };

            // Act
            await _itemService.CreateAsync(newItem);

            // Assert
            // Verifying if the CreateAsync method was called exactly once
            A.CallTo(() => _itemService.CreateAsync(newItem)).MustHaveHappenedOnceExactly();
    
            // Additional Assertion: Verify if the Item exists in the database
            var createdItem = await _itemService.GetAsync(newItem.Id);
            Assert.NotNull(createdItem); // Assert that the Item is not null
        }

        [Fact]
        public async Task UpdateAsync_UpdatesItem()
        {   
            // Arrange
            var ItemId = "1"; // Use an existing Item ID for testing
            var originalItem = new Item
            {  
                Id = ItemId,
                Label = "Computer",
                // Add other properties as needed
            };

            var updatedItemData = new Item
            {  
                Id = ItemId,
                Label = "Gaming computer",
                // Add other updated properties
            };

            // Setting up fake behavior for the GetAsync method to return the original Item
            A.CallTo(() => _itemService.GetAsync(ItemId)).Returns(Task.FromResult(originalItem));

            // Act
            await _itemService.UpdateAsync(ItemId, updatedItemData);

            // Assert
            // Verifying if the UpdateAsync method was called exactly once
            A.CallTo(() => _itemService.UpdateAsync(ItemId, updatedItemData)).MustHaveHappenedOnceExactly();

            // Additional Assertion: Verify if the Item was updated correctly
            var updatedItem = await _itemService.GetAsync(ItemId);
            Assert.NotNull(updatedItem); // Assert that the updated Item is not null
            // Add additional assertions for other properties if needed
        }

        [Fact]
        public async Task RemoveAsync_RemovesItem()
        {
            // Arrange
            var ItemId = "1";

            // Act
            await _itemService.RemoveAsync(ItemId);

            // Assert
            // Verifying if the RemoveAsync method was called exactly once
            A.CallTo(() => _itemService.RemoveAsync(ItemId)).MustHaveHappenedOnceExactly();
        }
    }
}
