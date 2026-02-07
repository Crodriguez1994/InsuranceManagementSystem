using System.Security.Claims;

namespace InsuranceConsulting.Security
{
    public static class ClaimsPrincipalExtensions
    {
        public static int GetUserId(this ClaimsPrincipal user)
        {
            var idValue = user.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrWhiteSpace(idValue) || !int.TryParse(idValue, out var userId))
                throw new UnauthorizedAccessException("Missing or invalid user id claim.");

            return userId;
        }
    }
}
