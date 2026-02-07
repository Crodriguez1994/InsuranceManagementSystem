using System;
using System.Collections.Generic;
using System.Text;

namespace InsuranceConsulting.Application.Dtos
{
    public class LoginRequestDto
    {
        public string Username { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
}
