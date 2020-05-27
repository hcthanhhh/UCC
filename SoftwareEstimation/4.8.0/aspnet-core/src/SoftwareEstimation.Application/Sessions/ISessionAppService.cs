using System.Threading.Tasks;
using Abp.Application.Services;
using SoftwareEstimation.Sessions.Dto;

namespace SoftwareEstimation.Sessions
{
    public interface ISessionAppService : IApplicationService
    {
        Task<GetCurrentLoginInformationsOutput> GetCurrentLoginInformations();
    }
}
