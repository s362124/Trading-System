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
    public class ItemCategoryServiceTests
    {
        private readonly IItemCategoryService _ItemCategoryService;

        public ItemCategoryServiceTests()
        {
            // Creating a fake instance of IItemCategoryService using FakeItEasy
            _ItemCategoryService = A.Fake<IItemCategoryService>();
        }

        [Fact]
        public async Task GetAsync_ReturnsListOfItemCategories()
        {
            // Arrange
            var fakeItemCategorys = new List<ItemCategory>
            {
                new ItemCategory { Id = "1", Label = "Technology" },
                new ItemCategory { Id = "2", Label = "Furniture" }
            };

            // Setting up fake behavior for the GetAsync method
            A.CallTo(() => _ItemCategoryService.GetAsync()).Returns(Task.FromResult(fakeItemCategorys));

            // Act
            var result = await _ItemCategoryService.GetAsync();

            // Assert
            Assert.Equal(fakeItemCategorys, result);
        }

        [Fact]
        public async Task GetAsync_ReturnsItemCategoryById()
        {
            // Arrange
            var ItemCategoryId = "1";
            var fakeItemCategory = new ItemCategory { Id = ItemCategoryId, Label = "Technology" };

            // Setting up fake behavior for the GetAsync method with an ID parameter
            A.CallTo(() => _ItemCategoryService.GetAsync(fakeItemCategory.Id)).Returns(Task.FromResult(fakeItemCategory));

            // Act
            var result = await _ItemCategoryService.GetAsync(ItemCategoryId);

            // Assert
            Assert.Equal(fakeItemCategory, result);
        }

        [Fact]
        public async Task CreateAsync_CreatesNewItemCategory()
        {   
            // Arrange
            var newItemCategory = new ItemCategory
            {
                Id="",
                Label = "Agriculture"
            };

            // Act
            await _ItemCategoryService.CreateAsync(newItemCategory);

            // Assert
            // Verifying if the CreateAsync method was called exactly once
            A.CallTo(() => _ItemCategoryService.CreateAsync(newItemCategory)).MustHaveHappenedOnceExactly();
    
            // Additional Assertion: Verify if the ItemCategory exists in the database
            var createdItemCategory = await _ItemCategoryService.GetAsync(newItemCategory.Id);
            Assert.NotNull(createdItemCategory); // Assert that the ItemCategory is not null
        }

        [Fact]
        public async Task UpdateAsync_UpdatesItemCategory()
        {   
            // Arrange
            var ItemCategoryId = "1"; // Use an existing ItemCategory ID for testing
            var originalItemCategory = new ItemCategory
            {  
                Id = ItemCategoryId,
                Label = "Technology",
                // Add other properties as needed
            };

            var updatedItemCategoryData = new ItemCategory
            {  
                Id = ItemCategoryId,
                Label = "Tech",
                // Add other updated properties
            };

            // Setting up fake behavior for the GetAsync method to return the original ItemCategory
            A.CallTo(() => _ItemCategoryService.GetAsync(ItemCategoryId)).Returns(Task.FromResult(originalItemCategory));

            // Act
            await _ItemCategoryService.UpdateAsync(ItemCategoryId, updatedItemCategoryData);

            // Assert
            // Verifying if the UpdateAsync method was called exactly once
            A.CallTo(() => _ItemCategoryService.UpdateAsync(ItemCategoryId, updatedItemCategoryData)).MustHaveHappenedOnceExactly();

            // Additional Assertion: Verify if the ItemCategory was updated correctly
            var updatedItemCategory = await _ItemCategoryService.GetAsync(ItemCategoryId);
            Assert.NotNull(updatedItemCategory); // Assert that the updated ItemCategory is not null
            // Add additional assertions for other properties if needed
        }

        [Fact]
        public async Task RemoveAsync_RemovesItemCategory()
        {
            // Arrange
            var ItemCategoryId = "1";

            // Act
            await _ItemCategoryService.RemoveAsync(ItemCategoryId);

            // Assert
            // Verifying if the RemoveAsync method was called exactly once
            A.CallTo(() => _ItemCategoryService.RemoveAsync(ItemCategoryId)).MustHaveHappenedOnceExactly();
        }
    }
}
