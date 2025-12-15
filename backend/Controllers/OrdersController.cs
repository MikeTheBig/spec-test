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

        var sub = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(sub)) return Unauthorized();
        var userId = int.Parse(sub);
        var orders = await _db.Orders.Where(o => o.UserId == userId).ToListAsync();
        return Ok(orders);
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] Order req)
    {
        var sub = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(sub)) return Unauthorized(new { error = "missing_sub_claim" });
        var userId = int.Parse(sub);

        // Find user
        var user = await _db.Users.FindAsync(userId);
        if (user == null) return NotFound();

        // Beregn cost
        var cost = req.Quantity * req.Price;

        // Check balance for buy orders
        if (req.Quantity > 0 && user.Balance < cost)
        {
            return BadRequest(new { error = "Insufficient balance" });
        }

        // Opdater balance
        user.Balance -= cost; // Buy = minus, Sell (negative qty) = plus

        req.UserId = userId;
        req.CreatedAt = DateTime.UtcNow;
        _db.Orders.Add(req);
        await _db.SaveChangesAsync();

        return Ok(req);
    }

    [HttpGet("history")]
    [Authorize]
    public async Task<IActionResult> GetHistory([FromQuery] string? symbol = null)
    {
        var sub = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(sub)) return Unauthorized();
        var userId = int.Parse(sub);

        var query = _db.Orders
            .Include(o => o.Stock) // Så vi får stock info med
            .Where(o => o.UserId == userId);

        if (!string.IsNullOrEmpty(symbol))
        {
            query = query.Where(o => o.Symbol == symbol);
        }

        var orders = await query
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();

        return Ok(orders.Select(o => new
        {
            o.Id,
            o.Symbol,
            stockName = o.Stock?.Company ?? o.Symbol,
            o.Quantity,
            o.Price,
            total = o.Quantity * o.Price,
            type = o.Quantity > 0 ? "BUY" : "SELL", // Antager negative quantity = sell
            o.CreatedAt
        }));
    }

    [HttpGet("portfolio")]
    [Authorize]
    public async Task<IActionResult> GetPortfolio()
    {
        var sub = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(sub)) return Unauthorized();
        var userId = int.Parse(sub);

        var orders = await _db.Orders
            .Include(o => o.Stock)
            .Where(o => o.UserId == userId)
            .ToListAsync();

        var holdings = orders
            .GroupBy(o => o.Symbol)
            .Select(g => new
            {
                Symbol = g.Key,
                StockName = g.First().Stock?.Company ?? g.Key,
                Quantity = g.Sum(o => o.Quantity),
                AveragePrice = g.Where(o => o.Quantity > 0).Any() ? g.Where(o => o.Quantity > 0).Sum(o => o.Quantity * o.Price) / g.Where(o => o.Quantity > 0).Sum(o => o.Quantity) : 0,
                totalCost = g.Where(o => o.Quantity > 0).Sum(o => o.Quantity * o.Price)
            })
            .Where(h => h.Quantity != 0) // Fjern beholdninger med 0 quantity
            .ToList();
        return Ok(holdings);
    }

    [HttpGet("balance")]
    [Authorize]
    public async Task<IActionResult> GetBalance()
    {
        var sub = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(sub)) return Unauthorized();
        var userId = int.Parse(sub);

        // Find user
        var user = await _db.Users.FindAsync(userId);
        if (user == null) return NotFound();

        return Ok(new { balance = user.Balance });
    }

    [HttpPost("balance/deposit")]
    [Authorize]
    public async Task<IActionResult> DepositBalance([FromBody] decimal amount)
    {
        var sub = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(sub)) return Unauthorized();
        var userId = int.Parse(sub);

        // Find user
        var user = await _db.Users.FindAsync(userId);
        if (user == null) return NotFound();

        // Update balance
        user.Balance += amount;
        await _db.SaveChangesAsync();

        return Ok(new { balance = user.Balance });
    }
}