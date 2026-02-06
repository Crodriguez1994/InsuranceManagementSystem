namespace InsuranceConsulting.Domain.Entities
{
    public abstract class BaseEntity
    {
        public int Id { get; set; }

        public bool Status { get; set; } = true;

        public DateTime CreatedDate { get; set; }

        public int UserCreated { get; set; }

        public DateTime? ModifiedDate { get; set; }

        public int? UserModified { get; set; }
    }
}
