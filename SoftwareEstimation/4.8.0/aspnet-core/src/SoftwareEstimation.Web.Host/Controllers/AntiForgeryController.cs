using Microsoft.AspNetCore.Antiforgery;
using SoftwareEstimation.Controllers;

namespace SoftwareEstimation.Web.Host.Controllers
{
    public class AntiForgeryController : SoftwareEstimationControllerBase
    {
        private readonly IAntiforgery _antiforgery;

        public AntiForgeryController(IAntiforgery antiforgery)
        {
            _antiforgery = antiforgery;
        }

        public void GetToken()
        {
            _antiforgery.SetCookieTokenAndHeader(HttpContext);
        }
    }
}
