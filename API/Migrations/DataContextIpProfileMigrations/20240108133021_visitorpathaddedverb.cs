using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations.DataContextIpProfileMigrations
{
    /// <inheritdoc />
    public partial class visitorpathaddedverb : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Verb",
                table: "VisitedPaths",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Verb",
                table: "VisitedPaths");
        }
    }
}
