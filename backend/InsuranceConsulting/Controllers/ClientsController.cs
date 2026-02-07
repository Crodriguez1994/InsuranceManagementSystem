using InsuranceConsulting.Controllers;
using InsuranceConsulting.Domain.Entities;
using InsuranceConsulting.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InsuranceConsulting.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ClientsController : ApiControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ClientsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/clients
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var clients = await _context.Clients
                .Where(x => !x.IsDeleted)
                .ToListAsync();

            return Ok(clients);
        }

        // GET: api/clients/{id}
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var client = await _context.Clients
                .FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted);

            if (client == null)
                return NotFound();

            return Ok(client);
        }

        // POST: api/clients
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Client client)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            client.Status = true;
            client.IsDeleted = false;

            _context.Clients.Add(client);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = client.Id }, client);
        }

        // PUT: api/clients/{id}
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] Client updatedClient)
        {
            if (id != updatedClient.Id)
                return BadRequest("Id mismatch");

            var client = await _context.Clients.FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted);
            if (client == null)
                return NotFound();

            client.FirstName = updatedClient.FirstName;
            client.LastName = updatedClient.LastName;
            client.FullName = updatedClient.FullName;
            client.Phone = updatedClient.Phone;
            client.Email = updatedClient.Email;
            client.Age = updatedClient.Age;
            client.Status = updatedClient.Status;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/clients/{id}
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var client = await _context.Clients.FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted);
            if (client == null)
                return NotFound();

            client.IsDeleted = true;
            client.Status = false;

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
