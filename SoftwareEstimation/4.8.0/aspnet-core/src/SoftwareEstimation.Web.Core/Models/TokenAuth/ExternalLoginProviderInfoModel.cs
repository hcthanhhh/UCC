using Abp.AutoMapper;
using SoftwareEstimation.Authentication.External;

namespace SoftwareEstimation.Models.TokenAuth
{
    [AutoMapFrom(typeof(ExternalLoginProviderInfo))]
    public class ExternalLoginProviderInfoModel
    {
        public string Name { get; set; }

        public string ClientId { get; set; }
    }
}
