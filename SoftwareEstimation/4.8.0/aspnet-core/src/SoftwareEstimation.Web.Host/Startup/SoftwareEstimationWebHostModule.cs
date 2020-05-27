using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Abp.Modules;
using Abp.Reflection.Extensions;
using SoftwareEstimation.Configuration;

namespace SoftwareEstimation.Web.Host.Startup
{
    [DependsOn(
       typeof(SoftwareEstimationWebCoreModule))]
    public class SoftwareEstimationWebHostModule: AbpModule
    {
        private readonly IHostingEnvironment _env;
        private readonly IConfigurationRoot _appConfiguration;

        public SoftwareEstimationWebHostModule(IHostingEnvironment env)
        {
            _env = env;
            _appConfiguration = env.GetAppConfiguration();
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(SoftwareEstimationWebHostModule).GetAssembly());
        }
    }
}
