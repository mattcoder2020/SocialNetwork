using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations.DataContextIpProfileMigrations
{
    /// <inheritdoc />
    public partial class adjustappnamecolumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AppName",
                table: "IpProfiles");

            migrationBuilder.AddColumn<string>(
                name: "AppName",
                table: "VisitedPaths",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AppName",
                table: "VisitedPaths");

            migrationBuilder.AddColumn<string>(
                name: "AppName",
                table: "IpProfiles",
                type: "text",
                nullable: true);
        }
    }
}
