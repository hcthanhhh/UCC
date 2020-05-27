using Abp.Authorization;
using SoftwareEstimation.Authorization.Roles;
using SoftwareEstimation.Authorization.Users;

namespace SoftwareEstimation.Authorization
{
    public class PermissionChecker : PermissionChecker<Role, User>
    {
        public PermissionChecker(UserManager userManager)
            : base(userManager)
        {
        }
    }
}
