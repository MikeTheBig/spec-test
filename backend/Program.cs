using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using MarketView.Api.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options => {
    options.AddPolicy("AllowLocalhost3000", policy => {
        policy.WithOrigins("http://localhost:3000").AllowAnyHeader().AllowAnyMethod();
    });
});

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("Default") ?? "Data Source=marketview.db")
);

var jwtKey = builder.Configuration["Jwt:Key"] ?? throw new InvalidOperationException("Jwt:Key not configured");
var keyBytes = Encoding.UTF8.GetBytes(jwtKey);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],        // Matcher token
            ValidAudience = builder.Configuration["Jwt:Audience"],    // Matcher token
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))

        };
    });

var app = builder.Build();

// Always enable Swagger UI (convenient for local/dev). Remove or guard this in production.
app.UseSwagger();
app.UseSwaggerUI();

app.UseRouting();
// CORS must be applied early so preflight (OPTIONS) requests aren't blocked by auth
app.UseCors("AllowLocalhost3000");
app.UseAuthentication();
app.UseAuthorization();

// ensure database and seed
using (var scope = app.Services.CreateScope()){
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
    MarketView.Api.Data.SeedData.EnsureSeed(db);
}

app.MapControllers();

app.Run();
