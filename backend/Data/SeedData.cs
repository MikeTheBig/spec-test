using MarketView.Api.Models;

namespace MarketView.Api.Data;

public static class SeedData
{
    public static void EnsureSeed(AppDbContext db){
        if (db.Stocks.Any()) return;
        var arr = new[] {
            new Stock { Symbol = "AAPL", Company = "Apple Inc.", Price = 174.55m },
            new Stock { Symbol = "MSFT", Company = "Microsoft Corp.", Price = 339.12m },
            new Stock { Symbol = "GOOGL", Company = "Alphabet Inc.", Price = 132.44m },
            new Stock { Symbol = "AMZN", Company = "Amazon.com, Inc.", Price = 142.19m },
            new Stock { Symbol = "NVDA", Company = "NVIDIA Corp.", Price = 540.11m },
            new Stock { Symbol = "TSLA", Company = "Tesla, Inc.", Price = 242.55m },
            new Stock { Symbol = "META", Company = "Meta Platforms", Price = 331.22m },
            new Stock { Symbol = "JPM", Company = "JPMorgan Chase", Price = 139.5m },
            new Stock { Symbol = "V", Company = "Visa Inc.", Price = 245.66m },
            new Stock { Symbol = "DIS", Company = "The Walt Disney Co.", Price = 94.11m }
        };
        db.Stocks.AddRange(arr);
        db.SaveChanges();
    }
}
