using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ChoosyDbContext _context;

    public AuthController(ChoosyDbContext context)
    {
        _context = context;
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
            Email = registrationDto.Email
        };

        // Хэширование пароля
        using (var hmac = new HMACSHA512())
        {
            user.PasswordHash = Convert.ToBase64String(hmac.ComputeHash(Encoding.UTF8.GetBytes(user.PasswordHash)));
        }

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok("User registered successfully");
    }
}
