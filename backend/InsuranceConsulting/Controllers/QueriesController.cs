using InsuranceConsulting.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InsuranceConsulting.Controllers
{
    [AllowAnonymous] 
    [ApiController]
    [Route("api/[controller]")]
    public class QueriesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public QueriesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/queries/by-client/0950271593
        [HttpGet("by-client/{identification}")]
        public async Task<IActionResult> GetInsurancesByClient(string identification)
        {
            identification = identification.Trim();

            var client = await _context.Clients
                .Where(c => !c.IsDeleted && c.Identification == identification)
                .Select(c => new { c.Id, c.Identification, c.FullName })
                .FirstOrDefaultAsync();

            if (client == null)
                return NotFound(new { message = "Client not found" });

            var insurances = await _context.ClientInsurances
                .Where(ci => ci.ClientId == client.Id && ci.Status)
                .Join(_context.Insurances.Where(i => i.Status),
                    ci => ci.InsuranceId,
                    i => i.Id,
                    (ci, i) => new
                    {
                        i.Id,
                        i.Code,
                        i.Name,
                        i.InsuredAmount,
                        i.Price
                    })
                .OrderBy(x => x.Code)
                .ToListAsync();

            return Ok(new
            {
                client,
                insurances
            });
        }

        // GET: api/queries/by-insurance/SEG-001
        [HttpGet("by-insurance/{code}")]
        public async Task<IActionResult> GetClientsByInsurance(string code)
        {
            code = code.Trim();

            var insurance = await _context.Insurances
                .Where(i => i.Status && i.Code == code)
                .Select(i => new { i.Id, i.Code, i.Name })
                .FirstOrDefaultAsync();

            if (insurance == null)
                return NotFound(new { message = "Insurance not found" });

            var clients = await _context.ClientInsurances
                .Where(ci => ci.InsuranceId == insurance.Id && ci.Status)
                .Join(_context.Clients.Where(c => !c.IsDeleted),
                    ci => ci.ClientId,
                    c => c.Id,
                    (ci, c) => new
                    {
                        c.Id,
                        c.Identification,
                        c.FullName,
                        c.Phone,
                        c.Age,
                        c.Email
                    })
                .OrderBy(x => x.FullName)
                .ToListAsync();

            return Ok(new
            {
                insurance,
                clients
            });
        }
    }
}
