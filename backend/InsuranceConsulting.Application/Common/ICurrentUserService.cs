using System;
using System.Collections.Generic;
using System.Text;

namespace InsuranceConsulting.Application.Common
{
    public interface ICurrentUserService
    {
        int? UserId { get; }
    }
}
