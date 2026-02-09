namespace InsuranceConsultingReport.Models
{
    public class QuerySearchViewModel
    {
        public string SearchType { get; set; } = "identification";
        public string Value { get; set; } = "";

        public string? ErrorMessage { get; set; }

        public ClientInfo? Client { get; set; }
        public InsuranceInfo? Insurance { get; set; }

        public List<InsuranceItem> Insurances { get; set; } = new();
        public List<ClientItem> Clients { get; set; } = new();
    }

    public class ClientInfo
    {
        public int Id { get; set; }
        public string Identification { get; set; } = "";
        public string FullName { get; set; } = "";
    }

    public class InsuranceInfo
    {
        public int Id { get; set; }
        public string Code { get; set; } = "";
        public string Name { get; set; } = "";
    }

    public class InsuranceItem
    {
        public int Id { get; set; }
        public string Code { get; set; } = "";
        public string Name { get; set; } = "";
        public decimal InsuredAmount { get; set; }
        public decimal Price { get; set; }
    }

    public class ClientItem
    {
        public int Id { get; set; }
        public string Identification { get; set; } = "";
        public string FullName { get; set; } = "";
        public string? Phone { get; set; }
        public int Age { get; set; }
        public string? Email { get; set; }
    }
}
