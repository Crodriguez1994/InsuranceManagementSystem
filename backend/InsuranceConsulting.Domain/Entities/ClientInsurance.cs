using System.ComponentModel.DataAnnotations.Schema;

namespace InsuranceConsulting.Domain.Entities
{
    public class ClientInsurance : BaseEntity
    {
        public int ClientId { get; set; }
        public int InsuranceId { get; set; }

        [ForeignKey(nameof(ClientId))]
        public Client Client { get; set; } = null!;

        [ForeignKey(nameof(InsuranceId))]
        public Insurance Insurance { get; set; } = null!;
    }
}
