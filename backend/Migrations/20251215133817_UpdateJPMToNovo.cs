using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MarketView.Api.Migrations
{
    /// <inheritdoc />
    public partial class UpdateJPMToNovo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
{
    migrationBuilder.Sql(@"
        UPDATE Stocks 
        SET Symbol = 'NOVO-B.CO', Company = 'Novo Nordisk', Price = 500 
        WHERE Symbol = 'JPM';
    ");
}

protected override void Down(MigrationBuilder migrationBuilder)
{
    migrationBuilder.Sql(@"
        UPDATE Stocks 
        SET Symbol = 'JPM', Company = 'JP Morgan Chase & Co.', Price = 180 
        WHERE Symbol = 'NOVO-B.CO';
    ");
}
    }
}
