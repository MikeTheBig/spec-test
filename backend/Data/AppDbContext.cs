using Microsoft.EntityFrameworkCore;
using MarketView.Api.Models;

namespace MarketView.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<Stock> Stocks => Set<Stock>();
}
