using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ChoosyDbContext _context;

    private readonly HashingService _hashingService;

    public AuthController(ChoosyDbContext context, HashingService hashingService)
    {
        _context = context;
        _hashingService = hashingService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] UserRegistrationDto registrationDto)
    {
        // Проверка существования пользователя
        if (await _context.Users.AnyAsync(u => u.Username == registrationDto.Username))
        {
            return BadRequest("Username already exists");
        }

        // Создание нового пользователя
        var user = new User
        {
            Username = registrationDto.Username,
            Email = registrationDto.Email,
            PasswordHash = _hashingService.HashPassword(registrationDto.Password)
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok("User registered successfully");
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] UserRegistrationDto loginDto)
    {
        var user = await _context.Users.SingleOrDefaultAsync(u => u.Email == loginDto.Email);
    
        if (user == null)
        {
            return Unauthorized("Invalid username or password");
        }

        if (user == null || !_hashingService.VerifyPassword(loginDto.Password, user.PasswordHash))
        {
            return Unauthorized("Invalid email or password");
        }

        return Ok("User logged in successfully");
    }
}
