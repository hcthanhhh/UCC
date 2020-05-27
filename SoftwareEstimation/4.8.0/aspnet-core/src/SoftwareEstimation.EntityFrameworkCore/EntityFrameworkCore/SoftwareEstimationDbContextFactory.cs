using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using SoftwareEstimation.Configuration;
using SoftwareEstimation.Web;

namespace SoftwareEstimation.EntityFrameworkCore
{
    /* This class is needed to run "dotnet ef ..." commands from command line on development. Not used anywhere else */
    public class SoftwareEstimationDbContextFactory : IDesignTimeDbContextFactory<SoftwareEstimationDbContext>
    {
        public SoftwareEstimationDbContext CreateDbContext(string[] args)
        {
            var builder = new DbContextOptionsBuilder<SoftwareEstimationDbContext>();
            var configuration = AppConfigurations.Get(WebContentDirectoryFinder.CalculateContentRootFolder());

            SoftwareEstimationDbContextConfigurer.Configure(builder, configuration.GetConnectionString(SoftwareEstimationConsts.ConnectionStringName));

            return new SoftwareEstimationDbContext(builder.Options);
        }
    }
}
