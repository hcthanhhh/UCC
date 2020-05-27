using System.Data.Common;
using Microsoft.EntityFrameworkCore;

namespace SoftwareEstimation.EntityFrameworkCore
{
    public static class SoftwareEstimationDbContextConfigurer
    {
        public static void Configure(DbContextOptionsBuilder<SoftwareEstimationDbContext> builder, string connectionString)
        {
            builder.UseSqlServer(connectionString);
        }

        public static void Configure(DbContextOptionsBuilder<SoftwareEstimationDbContext> builder, DbConnection connection)
        {
            builder.UseSqlServer(connection);
        }
    }
}
