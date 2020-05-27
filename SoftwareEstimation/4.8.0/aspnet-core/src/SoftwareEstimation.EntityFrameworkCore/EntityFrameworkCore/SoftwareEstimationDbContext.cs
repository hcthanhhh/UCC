using Microsoft.EntityFrameworkCore;
using Abp.Zero.EntityFrameworkCore;
using SoftwareEstimation.Authorization.Roles;
using SoftwareEstimation.Authorization.Users;
using SoftwareEstimation.MultiTenancy;
using SoftwareEstimation.Projects;

namespace SoftwareEstimation.EntityFrameworkCore
{
    public class SoftwareEstimationDbContext : AbpZeroDbContext<Tenant, Role, User, SoftwareEstimationDbContext>
    {
        /* Define a DbSet for each entity of the application */
        public virtual DbSet<Project> Projects { get; set; }
        public SoftwareEstimationDbContext(DbContextOptions<SoftwareEstimationDbContext> options)
            : base(options)
        {
        }
    }
}
