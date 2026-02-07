using System.ComponentModel.DataAnnotations;

namespace InsuranceConsulting.Models.Users
{
    public class UserListDto
    {
        public int Id { get; set; }
        public string Username { get; set; } = null!;
        public bool Status { get; set; }
        public DateTime CreatedDate { get; set; }
    }

    public class CreateUserDto
    {
        [Required, MaxLength(50)]
        public string Username { get; set; } = null!;

        [Required, MaxLength(255)]
        public string Password { get; set; } = null!;

        public bool Status { get; set; } = true;
    }

    public class UpdateUserDto
    {
        [MaxLength(255)]
        public string? Password { get; set; }

        public bool Status { get; set; } = true;
    }
}
