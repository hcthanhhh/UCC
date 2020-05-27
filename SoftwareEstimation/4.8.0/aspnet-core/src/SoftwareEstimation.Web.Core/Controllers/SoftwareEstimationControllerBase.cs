using Abp.AspNetCore.Mvc.Controllers;
using Abp.IdentityFramework;
using Microsoft.AspNetCore.Identity;

namespace SoftwareEstimation.Controllers
{
    public abstract class SoftwareEstimationControllerBase: AbpController
    {
        protected SoftwareEstimationControllerBase()
        {
            LocalizationSourceName = SoftwareEstimationConsts.LocalizationSourceName;
        }

        protected void CheckErrors(IdentityResult identityResult)
        {
            identityResult.CheckErrors(LocalizationManager);
        }
    }
}
