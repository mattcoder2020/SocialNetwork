using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class addedchatgroupforeinkeys : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ChatGroupMessages_ChatGroups_ChatGroupId",
                table: "ChatGroupMessages");

            migrationBuilder.AlterColumn<int>(
                name: "ChatGroupId",
                table: "ChatGroupMessages",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_ChatGroupMessages_ChatGroups_ChatGroupId",
                table: "ChatGroupMessages",
                column: "ChatGroupId",
                principalTable: "ChatGroups",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ChatGroupMessages_ChatGroups_ChatGroupId",
                table: "ChatGroupMessages");

            migrationBuilder.AlterColumn<int>(
                name: "ChatGroupId",
                table: "ChatGroupMessages",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddForeignKey(
                name: "FK_ChatGroupMessages_ChatGroups_ChatGroupId",
                table: "ChatGroupMessages",
                column: "ChatGroupId",
                principalTable: "ChatGroups",
                principalColumn: "Id");
        }
    }
}
