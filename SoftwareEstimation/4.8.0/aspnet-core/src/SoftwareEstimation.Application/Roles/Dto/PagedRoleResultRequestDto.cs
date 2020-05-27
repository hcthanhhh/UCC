using Abp.Application.Services.Dto;

namespace SoftwareEstimation.Roles.Dto
{
    public class PagedRoleResultRequestDto : PagedResultRequestDto
    {
        public string Keyword { get; set; }
    }
}

