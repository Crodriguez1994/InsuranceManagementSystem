using InsuranceConsulting.Domain.Entities;
using InsuranceConsulting.Infrastructure.Persistence;
using InsuranceConsulting.Models.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InsuranceConsulting.Controllers
{
        [Authorize]
        [ApiController]
        [Route("api/[controller]")]
        public class UsersController : ControllerBase
        {
            private readonly ApplicationDbContext _context;

            public UsersController(ApplicationDbContext context)
            {
                _context = context;
            }

            // GET: api/users
            [HttpGet]
            public async Task<ActionResult<List<UserListDto>>> GetAll()
            {
                var list = await _context.Users
                    .Where(x => x.Status)
                    .OrderBy(x => x.Username)
                    .Select(x => new UserListDto
                    {
                        Id = x.Id,
                        Username = x.Username,
                        Status = x.Status,
                        CreatedDate = x.CreatedDate
                    })
                    .ToListAsync();

                return Ok(list);
            }

            // GET: api/users/5
            [HttpGet("{id:int}")]
            public async Task<ActionResult<UserListDto>> GetById(int id)
            {
                var user = await _context.Users
                    .Where(x => x.Id == id && x.Status)
                    .Select(x => new UserListDto
                    {
                        Id = x.Id,
                        Username = x.Username,
                        Status = x.Status,
                        CreatedDate = x.CreatedDate
                    })
                    .FirstOrDefaultAsync();

                if (user == null) return NotFound();

                return Ok(user);
            }

            // POST: api/users
            [HttpPost]
            public async Task<IActionResult> Create([FromBody] CreateUserDto dto)
            {
                if (!ModelState.IsValid) return BadRequest(ModelState);

                var normalized = dto.Username.Trim().ToLower();

                var exists = await _context.Users
                    .AnyAsync(x => x.Username.ToLower() == normalized && x.Status);

                if (exists)
                    return Conflict(new { message = "Username already exists" });

                var entity = new User
                {
                    Username = dto.Username.Trim(),
                    Password = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                    Status = dto.Status
                };

                _context.Users.Add(entity);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetById), new { id = entity.Id }, new
                {
                    entity.Id,
                    entity.Username,
                    entity.Status,
                    entity.CreatedDate
                });
            }

            // PUT: api/users/5
            [HttpPut("{id:int}")]
            public async Task<IActionResult> Update(int id, [FromBody] UpdateUserDto dto)
            {
                if (!ModelState.IsValid) return BadRequest(ModelState);

                var entity = await _context.Users.FirstOrDefaultAsync(x => x.Id == id && x.Status);
                if (entity == null) return NotFound();

                entity.Status = dto.Status;

                if (!string.IsNullOrWhiteSpace(dto.Password))
                {
                    entity.Password = BCrypt.Net.BCrypt.HashPassword(dto.Password);
                }

                await _context.SaveChangesAsync();
                return NoContent();
            }

            // DELETE: api/users/5 
            [HttpDelete("{id:int}")]
            public async Task<IActionResult> Delete(int id)
            {
                var entity = await _context.Users.FirstOrDefaultAsync(x => x.Id == id && x.Status);
                if (entity == null) return NotFound();

                _context.Users.Remove(entity);
                await _context.SaveChangesAsync();

                return NoContent();
            }
        }
}
