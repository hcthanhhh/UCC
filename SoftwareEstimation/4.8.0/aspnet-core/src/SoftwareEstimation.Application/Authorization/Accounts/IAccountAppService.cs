using System.Threading.Tasks;
using Abp.Application.Services;
using SoftwareEstimation.Authorization.Accounts.Dto;

namespace SoftwareEstimation.Authorization.Accounts
{
    public interface IAccountAppService : IApplicationService
    {
        Task<IsTenantAvailableOutput> IsTenantAvailable(IsTenantAvailableInput input);

        Task<RegisterOutput> Register(RegisterInput input);
    }
}
