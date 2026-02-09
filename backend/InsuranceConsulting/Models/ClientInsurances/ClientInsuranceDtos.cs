using System.ComponentModel.DataAnnotations;

namespace InsuranceConsulting.Models.ClientInsurances
{
    public class AssignInsurancesDto
    {
        [Required]
        public int ClientId { get; set; }

        [Required]
        public List<int> InsuranceIds { get; set; } = new();
    }
    public class InsuranceCheckDto
    {
        public int InsuranceId { get; set; }
        public string Code { get; set; } = null!;
        public string Name { get; set; } = null!;
        public bool Assigned { get; set; }
    }
}
