using System.Threading.Tasks;
using SoftwareEstimation.Configuration.Dto;

namespace SoftwareEstimation.Configuration
{
    public interface IConfigurationAppService
    {
        Task ChangeUiTheme(ChangeUiThemeInput input);
    }
}
