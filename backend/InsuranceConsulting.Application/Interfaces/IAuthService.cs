using InsuranceConsulting.Application.Dtos;

namespace InsuranceConsulting.Application.Interfaces
{
    public interface IAuthService
    {
        LoginResponseDto Login(LoginRequestDto request);
    }
}
