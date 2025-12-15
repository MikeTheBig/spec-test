namespace MarketView.Api.Models;

public class Order
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Symbol { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal Price { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Stock? Stock { get; set; }
}
