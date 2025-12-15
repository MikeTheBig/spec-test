using Microsoft.AspNetCore.Mvc;
using MarketView.Api.Data;
using MarketView.Api.Models;
using Microsoft.EntityFrameworkCore;
using YahooFinanceApi;

namespace MarketView.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StocksController : ControllerBase
{
    private readonly AppDbContext _db;
    public StocksController(AppDbContext db) { _db = db; }

    [HttpGet]
public async Task<IActionResult> List()
{
    var stocks = await _db.Stocks.ToListAsync();
    var updatedStocks = new List<object>();
    
    foreach (var stock in stocks)
    {
        try
        {
            var securities = await Yahoo.Symbols(stock.Symbol)
                .Fields(Field.RegularMarketPrice, Field.RegularMarketPreviousClose, Field.ShortName)
                .QueryAsync();
            
            var yahooData = securities[stock.Symbol];
            var price = (decimal)yahooData.RegularMarketPrice;
            var prevClose = (decimal)yahooData.RegularMarketPreviousClose;
            var change = price - prevClose;
            var changePercent = (change / prevClose) * 100;
            
            updatedStocks.Add(new
            {
                stock.Id,
                stock.Symbol,
                company = yahooData.ShortName ?? stock.Company,
                price = price,
                change = change,
                changePercent = changePercent
            });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Yahoo API failed for {stock.Symbol}: {ex.Message}");
            updatedStocks.Add(new
            {
                stock.Id,
                stock.Symbol,
                stock.Company,
                stock.Price,
                change = 0m,
                changePercent = 0m
            });
        }
    }
    
    return Ok(updatedStocks);
}

    [HttpGet("{symbol}")]
    public async Task<IActionResult> GetPrice(string symbol)
    {
        try
        {
            var securities = await Yahoo.Symbols(symbol)
                .Fields(Field.RegularMarketPrice)
                .QueryAsync();

            var price = (decimal)securities[symbol].RegularMarketPrice;

            return Ok(new { symbol, price });
        }
        catch (Exception ex)
        {
            return NotFound(new { error = $"Symbol not found: {ex.Message}" });
        }
    }
    
}