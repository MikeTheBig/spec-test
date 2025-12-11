using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using MarketView.Api.Data;
using MarketView.Api.Models;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;

namespace MarketView.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly AppDbContext _db;
    public OrdersController(AppDbContext db) { _db = db; }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> List()
    {
        Console.WriteLine("=== LIST ORDERS DEBUG ===");
        Console.WriteLine($"User.Identity.IsAuthenticated: {User.Identity?.IsAuthenticated}");

        var sub = User.FindFirstValue(JwtRegisteredClaimNames.Sub);
        if (string.IsNullOrEmpty(sub)) return Unauthorized();
        var userId = int.Parse(sub);
        var orders = await _db.Orders.Where(o => o.UserId == userId).ToListAsync();
        return Ok(orders);
    }

    [HttpPost]
    [Authorize]
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] Order req)
    {
        var sub = User.FindFirstValue(ClaimTypes.NameIdentifier); // Brug denne i stedet!
        if (string.IsNullOrEmpty(sub)) return Unauthorized(new { error = "missing_sub_claim" });
        var userId = int.Parse(sub);

        req.UserId = userId;
        req.CreatedAt = DateTime.UtcNow;
        _db.Orders.Add(req);
        await _db.SaveChangesAsync();
        return Ok(req);
    }

}