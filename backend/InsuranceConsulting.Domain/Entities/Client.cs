using System.ComponentModel.DataAnnotations;

namespace InsuranceConsulting.Domain.Entities
{
    public class Client : BaseEntity
    {
        [Required]
        [MaxLength(20)]
        public string Identification { get; set; } = null!;

        [Required]
        [MaxLength(100)]
        public string FirstName { get; set; } = null!;

        [Required]
        [MaxLength(100)]
        public string LastName { get; set; } = null!;

        [Required]
        [MaxLength(200)]
        public string FullName { get; set; } = null!;

        [MaxLength(20)]
        public string? Phone { get; set; }

        public int Age { get; set; }

        [MaxLength(200)]
        public string? Email { get; set; }

        public bool IsDeleted { get; set; }
        public ICollection<ClientInsurance> ClientInsurances { get; set; } = new List<ClientInsurance>();

    }
}
