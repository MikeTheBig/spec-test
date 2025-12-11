namespace MarketView.Api.Models;

public class Stock
{
    public int Id { get; set; }
    public string Symbol { get; set; } = string.Empty;
    public string Company { get; set; } = string.Empty;
    public decimal Price { get; set; }
}
