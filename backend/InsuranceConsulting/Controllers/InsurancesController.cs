using InsuranceConsulting.Domain.Entities;
using InsuranceConsulting.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InsuranceConsulting.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class InsurancesController : ApiControllerBase
    {
        private readonly ApplicationDbContext _context;

        public InsurancesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/insurances
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var list = await _context.Insurances
                .Where(x => x.Status)
                .ToListAsync();

            return Ok(list);
        }

        // GET: api/insurances/{id}
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var entity = await _context.Insurances
                .FirstOrDefaultAsync(x => x.Id == id && x.Status);

            if (entity == null) return NotFound();

            return Ok(entity);
        }

        // POST: api/insurances
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Insurance insurance)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (await ValidateDuplicateInsurance(insurance.Code, true))
                return Conflict(new { message = "Code already exists" });

            _context.Insurances.Add(insurance);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = insurance.Id }, insurance);
        }

        // PUT: api/insurances/{id}
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] Insurance updated)
        {
            if (id != updated.Id)
                return BadRequest("Id mismatch");

            if (await ValidateDuplicateInsurance(updated.Code, false, id))
                return Conflict(new { message = "Code already exists" });


            var entity = await _context.Insurances.FirstOrDefaultAsync(x => x.Id == id && x.Status);
            if (entity == null) return NotFound();

            entity.Code = updated.Code;
            entity.Name = updated.Name;
            entity.InsuredAmount = updated.InsuredAmount;
            entity.Price = updated.Price;
            entity.Status = updated.Status;


            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/insurances/{id}
        // Soft delete: Status = 0
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var entity = await _context.Insurances.FirstOrDefaultAsync(x => x.Id == id && x.Status);
            if (entity == null) return NotFound();

            await _context.SaveChangesAsync();

            return NoContent();
        }

        private async Task<bool> ValidateDuplicateInsurance(string code, bool isNew, int? insuranceId = null)
        {
            code = code.Trim().ToLower();

            if (isNew)
                return await _context.Insurances.AnyAsync(x => x.Code.ToLower() == code && x.Status);

            return await _context.Insurances.AnyAsync(x =>
                x.Code.ToLower() == code && x.Status && x.Id != insuranceId);
        }

    }
}
