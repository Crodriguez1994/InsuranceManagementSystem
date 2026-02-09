namespace InsuranceConsulting.Application.Dtos
{
    public class ClientInsuranceReportRow
    {
        public int ClientId { get; set; }
        public string Identification { get; set; } = null!;
        public string FullName { get; set; } = null!;

        public string? InsuranceCode { get; set; }
        public string? InsuranceName { get; set; }
        public decimal? InsuredAmount { get; set; }
        public decimal? Price { get; set; }
    }
}
