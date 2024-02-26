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
    public class UserServiceTests
    {
        private readonly IUserService _userService;
        private readonly IItemService _itemService;
        public UserServiceTests()
        {
            // Creating a fake instance of IUserService using FakeItEasy
            _userService = A.Fake<IUserService>();
             _itemService = A.Fake<IItemService>();
        }

        [Fact]
        public async Task GetAsync_ReturnsListOfUsers()
        {
            // Arrange
            var fakeUsers = new List<User>
            {
                new User { Id = "1", Name = "John" },
                new User { Id = "2", Name = "Alice" }
            };

            // Setting up fake behavior for the GetAsync method
            A.CallTo(() => _userService.GetAsync()).Returns(Task.FromResult(fakeUsers));

            // Act
            var result = await _userService.GetAsync();

            // Assert
            Assert.Equal(fakeUsers, result);
        }

        [Fact]
        public async Task GetAsync_ReturnsUserById()
        {
            // Arrange
            var userId = "1";
            var fakeUser = new User { Id = userId, Name = "John" };

            // Setting up fake behavior for the GetAsync method with an ID parameter
            A.CallTo(() => _userService.GetAsync(fakeUser.Id)).Returns(Task.FromResult(fakeUser));

            // Act
            var result = await _userService.GetAsync(userId);

            // Assert
            Assert.Equal(fakeUser, result);
        }

        [Fact]
        public async Task CreateAsync_CreatesNewUser()
        {   
            // Arrange
            var newUser = new User
            {
                Id="",
                Name = "John",
                Surname="Doe",
                Email="Alice@test.com",
                Password="12345678",
                Gender="male",
                Salt="",
                PhoneNumber=12345678,
                Role=0
            };

            // Act
            await _userService.CreateAsync(newUser);

            // Assert
            // Verifying if the CreateAsync method was called exactly once
            A.CallTo(() => _userService.CreateAsync(newUser)).MustHaveHappenedOnceExactly();
    
            // Additional Assertion: Verify if the user exists in the database
            var createdUser = await _userService.GetAsync(newUser.Id);
            Assert.NotNull(createdUser); // Assert that the user is not null
        }

        [Fact]
        public async Task UpdateAsync_UpdatesUser()
        {   
            // Arrange
            var userId = "1"; // Use an existing user ID for testing
            var originalUser = new User
            {  
                Id = userId,
                Name = "Original Name",
                // Add other properties as needed
            };

            var updatedUserData = new User
            {  
                Id = userId,
                Name = "Updated Name",
                // Add other updated properties
            };

            // Setting up fake behavior for the GetAsync method to return the original user
            A.CallTo(() => _userService.GetAsync(userId)).Returns(Task.FromResult(originalUser));

            // Act
            await _userService.UpdateAsync(userId, updatedUserData);

            // Assert
            // Verifying if the UpdateAsync method was called exactly once
            A.CallTo(() => _userService.UpdateAsync(userId, updatedUserData)).MustHaveHappenedOnceExactly();

            // Additional Assertion: Verify if the user was updated correctly
            var updatedUser = await _userService.GetAsync(userId);
            Assert.NotNull(updatedUser); // Assert that the updated user is not null
            // Add additional assertions for other properties if needed
        }

        [Fact]
        public async Task RemoveAsync_RemovesUser()
        {
            // Arrange
            var userId = "1";

            // Act
            await _userService.RemoveAsync(userId);

            // Assert
            // Verifying if the RemoveAsync method was called exactly once
            A.CallTo(() => _userService.RemoveAsync(userId)).MustHaveHappenedOnceExactly();
        }
   
    }

}
