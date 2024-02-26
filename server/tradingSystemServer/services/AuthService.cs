using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using tradingSystemServer.DTO;
using tradingSystemServer.models;
using tradingSystemServer.utils;
using Microsoft.Extensions.Configuration; // Add this namespace for IConfiguration

namespace tradingSystemServer.services
{
    // Service class to handle authentication-related operations
    public class AuthService
    {
        private readonly UserService _userService;
        private readonly string? key;

        // Constructor to initialize AuthService with UserService and IConfiguration
        public AuthService(UserService userService, IConfiguration config)
        {
            _userService = userService;
            this.key = config["JwtKey"];
            Console.WriteLine(this.key);
        }

        // Method to authenticate a user and generate JWT token
        public string Authenticate(string identifier, string password)
        {
            // Retrieve user by email
            var user = _userService.GetAsyncByEmail(identifier).Result;

            // Check if user exists and verify password
            if (user == null || !PasswordHasherUtil.VerifyPassword(password, user.Password, user.Salt))
            {
                throw new Exception("Bad credentials");
            }

            // Create token handler
            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenKey = Encoding.UTF8.GetBytes(key ?? "some_secret_key");

            // Create token descriptor
            var tokenDescriptor = new SecurityTokenDescriptor()
            {
                Subject = new ClaimsIdentity(new Claim[]{
                    new Claim(ClaimTypes.Email, identifier),
                    new Claim(ClaimTypes.Role, user.Role.ToString())
                }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(tokenKey),
                    SecurityAlgorithms.HmacSha256Signature
                )
            };

            // Create and return JWT token
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        // Method to handle user signup
        public async Task<IActionResult> Signup(SignupDTO data)
        {
            // Hash user's password
            var hash = PasswordHasherUtil.HashPassword(data.Password);

            // Create new user
            var user = new User
            {
                Id = "",
                Name = data.Name,
                Surname = data.Surname,
                Email = data.Email,
                Password = hash.hash,
                Address = data.Address,
                Salt = hash.salt,
                Gender = data.Gender,
                PhoneNumber = data.PhoneNumber,
                Role = data.Role
            };

            // Check if user with given email already exists
            if (await _userService.GetAsyncByEmail(user.Email) != null)
            {
                return new BadRequestObjectResult(new { message = "User already exists!" });
            }

            // Create user and return success response
            await _userService.CreateAsync(user);
            var createdUser = await _userService.GetAsyncByEmail(user.Email);
            return new OkObjectResult(new { message = "Registered Successfully, welcome to our platform!", user = createdUser });
        }

        // Method to handle user login
        public async Task<IActionResult> Login(SigninDTO data)
        {
            // Find user by email
            var userFound = await _userService.GetAsyncByEmail(data.email);

            // Check if user exists and verify password
            if (userFound == null || !PasswordHasherUtil.VerifyPassword(data.password, userFound.Password, userFound.Salt))
            {
                return new UnauthorizedResult();
            }

            // Return success response
            return new OkObjectResult(new { message = "Logged in Successfully, welcome back!", user = userFound });
        }
    }
}
