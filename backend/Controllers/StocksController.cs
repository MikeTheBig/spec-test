using Microsoft.AspNetCore.Mvc;
using MarketView.Api.Data;
using MarketView.Api.Models;

namespace MarketView.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StocksController : ControllerBase
{
    private readonly AppDbContext _db;
    public StocksController(AppDbContext db){ _db = db; }

    [HttpGet]
    public IActionResult Get(){
        var s = _db.Stocks.Select(x => new { x.Symbol, x.Company, x.Price }).ToList();
        return Ok(s);
    }
}
