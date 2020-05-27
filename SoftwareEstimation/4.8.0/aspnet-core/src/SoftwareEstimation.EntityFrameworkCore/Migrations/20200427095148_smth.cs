using Microsoft.EntityFrameworkCore.Migrations;

namespace SoftwareEstimation.Migrations
{
    public partial class smth : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<long>(
                name: "UserID",
                table: "AppProjects",
                nullable: false,
                oldClrType: typeof(int));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "UserID",
                table: "AppProjects",
                nullable: false,
                oldClrType: typeof(long));
        }
    }
}
