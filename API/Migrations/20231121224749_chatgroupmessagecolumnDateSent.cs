using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class chatgroupmessagecolumnDateSent : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "ChatGroupId",
                table: "ChatGroupMessages",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddColumn<DateTime>(
                name: "MessageSent",
                table: "ChatGroupMessages",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.CreateIndex(
                name: "IX_ChatGroupMessages_ChatGroupId",
                table: "ChatGroupMessages",
                column: "ChatGroupId");

            migrationBuilder.AddForeignKey(
                name: "FK_ChatGroupMessages_ChatGroups_ChatGroupId",
                table: "ChatGroupMessages",
                column: "ChatGroupId",
                principalTable: "ChatGroups",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ChatGroupMessages_ChatGroups_ChatGroupId",
                table: "ChatGroupMessages");

            migrationBuilder.DropIndex(
                name: "IX_ChatGroupMessages_ChatGroupId",
                table: "ChatGroupMessages");

            migrationBuilder.DropColumn(
                name: "MessageSent",
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
        }
    }
}
