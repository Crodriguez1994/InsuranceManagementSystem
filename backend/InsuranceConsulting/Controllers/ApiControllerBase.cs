using InsuranceConsulting.Security;
using Microsoft.AspNetCore.Mvc;

namespace InsuranceConsulting.Controllers
{
    [ApiController]
    public abstract class ApiControllerBase : ControllerBase
    {
        protected int CurrentUserId => User.GetUserId();
    }
}
