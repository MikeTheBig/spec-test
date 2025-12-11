using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BCrypt.Net;
using MarketView.Api.Data;
using MarketView.Api.Models;

namespace MarketView.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _cfg;
    public AuthController(AppDbContext db, IConfiguration cfg){ _db = db; _cfg = cfg; }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] User model){
        if (await _db.Users.AnyAsync(u => u.Email == model.Email)) return BadRequest(new { error = "already_registered" });
        var user = new User { Email = model.Email, Name = model.Name, PasswordHash = BCrypt.Net.BCrypt.HashPassword(model.PasswordHash) };
        _db.Users.Add(user);
        await _db.SaveChangesAsync();
        var token = GenerateToken(user);
        return Ok(new { token, user = new { user.Id, user.Email, user.Name } });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] User creds){
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == creds.Email);
        if (user == null) return BadRequest(new { error = "not_found" });
        if (!BCrypt.Net.BCrypt.Verify(creds.PasswordHash, user.PasswordHash)) return BadRequest(new { error = "invalid_credentials" });
        var token = GenerateToken(user);
        return Ok(new { token, user = new { user.Id, user.Email, user.Name } });
    }

    private string GenerateToken(User user){
    var jwtKey = _cfg["Jwt:Key"] ?? throw new InvalidOperationException("Jwt:Key not configured");
    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
    
    var claims = new[] { 
        new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()), 
        new Claim(JwtRegisteredClaimNames.Email, user.Email) 
    };
    
    var token = new JwtSecurityToken(
        issuer: _cfg["Jwt:Issuer"] ?? throw new InvalidOperationException("Jwt:Issuer not configured"),
        audience: _cfg["Jwt:Audience"] ?? throw new InvalidOperationException("Jwt:Audience not configured"),
        claims: claims, 
        expires: DateTime.UtcNow.AddDays(7), 
        signingCredentials: creds
    );
    
    return new JwtSecurityTokenHandler().WriteToken(token);
}
}
