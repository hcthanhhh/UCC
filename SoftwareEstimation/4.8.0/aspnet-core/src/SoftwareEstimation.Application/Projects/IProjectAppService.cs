using Abp.Application.Services;
using Abp.Application.Services.Dto;
using SoftwareEstimation.Projects.Dto;
using System;
using System.Threading.Tasks;

namespace SoftwareEstimation.Projects
{
    public interface IProjectAppService: IApplicationService
    {
        void CreateWithLink(ProjectInput Projects);
        Task<ListResultDto<ProjectListDto>> GetListProject();
        Task<ProjectDetailOutput> GetProjectDetail(EntityDto<Guid> input);
    }
}