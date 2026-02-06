using System.ComponentModel.DataAnnotations;

namespace InsuranceConsulting.Domain.Entities
{
    public class User : BaseEntity
    {
        [Required]
        [MaxLength(50)]
        public string Username { get; set; } = null!;

        [Required]
        [MaxLength(255)]
        public string Password { get; set; } = null!;
    }
}
