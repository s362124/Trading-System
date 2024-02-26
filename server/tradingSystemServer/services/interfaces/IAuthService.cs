using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;
using tradingSystemServer.models;

using tradingSystemServer.DTO;

namespace tradingSystemServer.services.interfaces
{
    public interface IAuthService
    {

        // Method to authenticate a user and generate JWT token
        public string Authenticate(string identifier, string password);
        // Method to handle user signup
        public Task<IActionResult> Signup(SignupDTO data);
        // Method to handle user login
        public Task<IActionResult> Login(SigninDTO data);
    }
}
