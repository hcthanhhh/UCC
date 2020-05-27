using Microsoft.Extensions.Configuration;
using Castle.MicroKernel.Registration;
using Abp.Events.Bus;
using Abp.Modules;
using Abp.Reflection.Extensions;
using SoftwareEstimation.Configuration;
using SoftwareEstimation.EntityFrameworkCore;
using SoftwareEstimation.Migrator.DependencyInjection;

namespace SoftwareEstimation.Migrator
{
    [DependsOn(typeof(SoftwareEstimationEntityFrameworkModule))]
    public class SoftwareEstimationMigratorModule : AbpModule
    {
        private readonly IConfigurationRoot _appConfiguration;

        public SoftwareEstimationMigratorModule(SoftwareEstimationEntityFrameworkModule abpProjectNameEntityFrameworkModule)
        {
            abpProjectNameEntityFrameworkModule.SkipDbSeed = true;

            _appConfiguration = AppConfigurations.Get(
                typeof(SoftwareEstimationMigratorModule).GetAssembly().GetDirectoryPathOrNull()
            );
        }

        public override void PreInitialize()
        {
            Configuration.DefaultNameOrConnectionString = _appConfiguration.GetConnectionString(
                SoftwareEstimationConsts.ConnectionStringName
            );

            Configuration.BackgroundJobs.IsJobExecutionEnabled = false;
            Configuration.ReplaceService(
                typeof(IEventBus), 
                () => IocManager.IocContainer.Register(
                    Component.For<IEventBus>().Instance(NullEventBus.Instance)
                )
            );
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(SoftwareEstimationMigratorModule).GetAssembly());
            ServiceCollectionRegistrar.Register(IocManager);
        }
    }
}
