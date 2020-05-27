using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.AutoMapper;
using Abp.Collections.Extensions;
using Abp.Domain.Repositories;
using Abp.Runtime.Session;
using Abp.UI;
using Microsoft.EntityFrameworkCore;
using Microsoft.Net.Http.Headers;
using SoftwareEstimation.Projects.Dto;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace SoftwareEstimation.Projects
{
    public class ProjectAppService : SoftwareEstimationAppServiceBase, IProjectAppService
    {

        private readonly IRepository<Project, Guid> _projectRespository;
        public ProjectAppService()
        {

        }
        public ProjectAppService(IRepository<Project, Guid> projectRepository)
        {
            _projectRespository = projectRepository;
        }
        public async void CreateWithLink(ProjectInput Projects)
        {
            var @project = Project.CreateWithLink(AbpSession.GetUserId(), Projects.Title, Projects.Description, Projects.Type, Projects.LinkURL);
            await _projectRespository.InsertAsync(@project);
        }

        public async Task<ListResultDto<ProjectListDto>> GetListProject()
        {
            var projects = await _projectRespository
                .GetAll()
                .Where( e => (e.UserID== AbpSession.GetUserId()))
                //.OrderByDescending(e => e.CreationTime)
                //.Take(64)
                .ToListAsync();
            return new ListResultDto<ProjectListDto>(projects.MapTo<List<ProjectListDto>>());
        }

        public async Task<ProjectDetailOutput> GetProjectDetail(EntityDto<Guid> input)
        {

            var @project = await _projectRespository
                .GetAll()
                .Where(e => e.Id == input.Id)
                .FirstOrDefaultAsync();

            if (@project == null)
            {
                throw new UserFriendlyException("Could not found the event, maybe it's deleted.");
            }

            return @project.MapTo<ProjectDetailOutput>();

        }
    }
}
