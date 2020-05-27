using Abp.Application.Services;
using Abp.Application.Services.Dto;
using SoftwareEstimation.MultiTenancy.Dto;

namespace SoftwareEstimation.MultiTenancy
{
    public interface ITenantAppService : IAsyncCrudAppService<TenantDto, int, PagedTenantResultRequestDto, CreateTenantDto, TenantDto>
    {
    }
}

