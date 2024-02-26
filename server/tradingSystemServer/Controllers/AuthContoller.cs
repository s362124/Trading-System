using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using tradingSystemServer.DTO;
using tradingSystemServer.services;
using tradingSystemServer.utils;

namespace tradingSystemServer.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        [AllowAnonymous]
        [HttpPost("signup")]
        public async Task<IActionResult> Signup(SignupDTO data)
        {
            // Call the signup method of the AuthService
            return await _authService.Signup(data);
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public IActionResult Login(SigninDTO data)
        {
            // Authenticate user and get token from the AuthService
            var token = _authService.Authenticate(data.email, data.password);
            
            // If authentication fails, return Unauthorized status
            if (token == null)
            {
                return Unauthorized();
            }
            
            // If authentication succeeds, return token
            return Ok(new { token });
        }
    }
}
