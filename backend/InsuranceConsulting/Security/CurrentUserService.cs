using InsuranceConsulting.Application.Common;
using System.Security.Claims;

namespace InsuranceConsulting.Security
{
    public class CurrentUserService : ICurrentUserService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        public CurrentUserService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }
        public int? UserId
        {
            get
            {
                var user = _httpContextAccessor.HttpContext?.User;
                if (user?.Identity?.IsAuthenticated != true) return null;

                var idValue = user.FindFirstValue(ClaimTypes.NameIdentifier);
                if (int.TryParse(idValue, out var id)) return id;

                return null;
            }
        }
    }
}
