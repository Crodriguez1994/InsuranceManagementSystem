using InsuranceConsulting.Domain.Entities;
using InsuranceConsulting.Infrastructure.Persistence;
using InsuranceConsulting.Models.ClientInsurances;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InsuranceConsulting.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ClientInsurancesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ClientInsurancesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/clientinsurances/client/5
        [HttpGet("client/{clientId:int}")]
        public async Task<ActionResult<List<InsuranceCheckDto>>> GetByClient(int clientId)
        {
            var clientExists = await _context.Clients.AnyAsync(c => c.Id == clientId && !c.IsDeleted);
            if (!clientExists) return NotFound(new { message = "Client not found" });

            var assignedIds = await _context.ClientInsurances
                .Where(x => x.ClientId == clientId && x.Status)
                .Select(x => x.InsuranceId)
                .ToListAsync();

            var list = await _context.Insurances
                .Where(i => i.Status)
                .OrderBy(i => i.Code)
                .Select(i => new InsuranceCheckDto
                {
                    InsuranceId = i.Id,
                    Code = i.Code,
                    Name = i.Name,
                    Assigned = assignedIds.Contains(i.Id)
                })
                .ToListAsync();

            return Ok(list);
        }

        // POST: api/clientinsurances/assign
        [HttpPost("assign")]
        public async Task<IActionResult> Assign([FromBody] AssignInsurancesDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var client = await _context.Clients.FirstOrDefaultAsync(c => c.Id == dto.ClientId && !c.IsDeleted);
            if (client == null) return NotFound(new { message = "Client not found" });

            var validInsuranceIds = await _context.Insurances
                .Where(i => i.Status && dto.InsuranceIds.Contains(i.Id))
                .Select(i => i.Id)
                .ToListAsync();

            var current = await _context.ClientInsurances
                .Where(x => x.ClientId == dto.ClientId && x.Status)
                .ToListAsync();

            var toDisable = current.Where(x => !validInsuranceIds.Contains(x.InsuranceId)).ToList();
            foreach (var ci in toDisable)
                _context.ClientInsurances.Remove(ci);

            var currentIds = current.Select(x => x.InsuranceId).ToHashSet();
            var toAdd = validInsuranceIds.Where(id => !currentIds.Contains(id)).ToList();

            foreach (var insuranceId in toAdd)
            {
                _context.ClientInsurances.Add(new ClientInsurance
                {
                    ClientId = dto.ClientId,
                    InsuranceId = insuranceId,
                    Status = true
                });
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
