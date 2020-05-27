using System.Threading.Tasks;
using Abp.Authorization;
using Abp.Runtime.Session;
using SoftwareEstimation.Configuration.Dto;

namespace SoftwareEstimation.Configuration
{
    [AbpAuthorize]
    public class ConfigurationAppService : SoftwareEstimationAppServiceBase, IConfigurationAppService
    {
        public async Task ChangeUiTheme(ChangeUiThemeInput input)
        {
            await SettingManager.ChangeSettingForUserAsync(AbpSession.ToUserIdentifier(), AppSettingNames.UiTheme, input.Theme);
        }
    }
}
