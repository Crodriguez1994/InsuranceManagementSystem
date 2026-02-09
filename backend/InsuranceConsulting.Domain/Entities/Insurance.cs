using System.ComponentModel.DataAnnotations;

namespace InsuranceConsulting.Domain.Entities
{
    public class Insurance : BaseEntity
    {
        [Required]
        [MaxLength(20)]
        public string Code { get; set; } = null!;

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = null!;

        public decimal InsuredAmount { get; set; }

        public decimal Price { get; set; }
        public ICollection<ClientInsurance> ClientInsurances { get; set; } = new List<ClientInsurance>();

    }
}
