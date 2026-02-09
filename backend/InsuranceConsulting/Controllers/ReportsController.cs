using InsuranceConsulting.Application.Dtos;
using InsuranceConsulting.Infrastructure.Persistence;
using iTextSharp.text;
using iTextSharp.text.pdf;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace InsuranceConsulting.Controllers
{
    [AllowAnonymous]
    [ApiController]
    [Route("api/[controller]")]
    public class ReportsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ReportsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/reports/clients-insurances/pdf
        [HttpGet("clients-insurances/pdf")]
        public async Task<IActionResult> ClientsInsurancesPdf([FromQuery] string? identification, [FromQuery] string? insuranceCode)
        {

            identification = string.IsNullOrWhiteSpace(identification) ? null : identification.Trim();
            insuranceCode = string.IsNullOrWhiteSpace(insuranceCode) ? null : insuranceCode.Trim();

            if (identification == null && insuranceCode == null)
                return BadRequest(new { message = "identification or insuranceCode is required" });

            var pId = new SqlParameter("@Identification", (object?)identification ?? DBNull.Value);
            var pCode = new SqlParameter("@InsuranceCode", (object?)insuranceCode ?? DBNull.Value);

            var rows = await _context.Set<ClientInsuranceReportRow>()
                .FromSqlRaw("EXEC dbo.sp_ReportClientsInsurances @Identification, @InsuranceCode", pId, pCode)
                .AsNoTracking()
                .ToListAsync();

            if (rows.Count == 0)
                return NotFound(new { message = "No data found for the selected filter" });


            // Agrupar por cliente
            var groups = rows
                .GroupBy(r => new { r.ClientId, r.Identification, r.FullName })
                .OrderBy(g => g.Key.FullName)
                .ToList();

            using var ms = new MemoryStream();

            var doc = new Document(PageSize.A4, 36, 36, 36, 36);
            PdfWriter.GetInstance(doc, ms);
            doc.Open();

            var title = new Paragraph("Clients & Assigned Insurances", FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 16));
            doc.Add(title);
            doc.Add(new Paragraph($"Generated: {DateTime.Now:yyyy-MM-dd HH:mm}", FontFactory.GetFont(FontFactory.HELVETICA, 10)));
            doc.Add(new Paragraph(" "));

            foreach (var g in groups)
            {
                var header = new Paragraph($"{g.Key.FullName}  |  {g.Key.Identification}",
                    FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 12));
                doc.Add(header);

                PdfPTable table = new PdfPTable(4) { WidthPercentage = 100 };
                table.SetWidths(new float[] { 18, 44, 19, 19 });

                AddHeaderCell(table, "Code");
                AddHeaderCell(table, "Insurance");
                AddHeaderCell(table, "Insured Amount");
                AddHeaderCell(table, "Price");

                var items = g.Where(x => !string.IsNullOrEmpty(x.InsuranceCode)).ToList();

                if (items.Count == 0)
                {
                    var cell = new PdfPCell(new Phrase("No insurances assigned"))
                    {
                        Colspan = 4,
                        Padding = 6
                    };
                    table.AddCell(cell);
                }
                else
                {
                    foreach (var r in items)
                    {
                        AddCell(table, r.InsuranceCode ?? "-");
                        AddCell(table, r.InsuranceName ?? "-");
                        AddCell(table, (r.InsuredAmount ?? 0).ToString("0.00"), Element.ALIGN_RIGHT);
                        AddCell(table, (r.Price ?? 0).ToString("0.00"), Element.ALIGN_RIGHT);
                    }
                }

                doc.Add(table);
                doc.Add(new Paragraph(" "));
            }

            doc.Close();

            var bytes = ms.ToArray();
            return File(bytes, "application/pdf", "ClientsInsurances.pdf");
        }

        private static void AddHeaderCell(PdfPTable table, string text)
        {
            var font = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 10);
            var cell = new PdfPCell(new Phrase(text, font))
            {
                BackgroundColor = new BaseColor(240, 240, 240),
                Padding = 6
            };
            table.AddCell(cell);
        }

        private static void AddCell(PdfPTable table, string text, int align = Element.ALIGN_LEFT)
        {
            var font = FontFactory.GetFont(FontFactory.HELVETICA, 10);
            var cell = new PdfPCell(new Phrase(text, font))
            {
                HorizontalAlignment = align,
                Padding = 6
            };
            table.AddCell(cell);
        }
    }
}
