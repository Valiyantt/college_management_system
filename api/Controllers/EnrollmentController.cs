using college_management_system.Data;
using college_management_system.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace college_management_system.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EnrollmentController : ControllerBase
    {
        private readonly AppDbContext _context;
        public EnrollmentController(AppDbContext context)
        {
            _context = context;
        }

        // 23. Student: Fill out enrollment form and submit requirements
        [HttpPost("submit-enrollment/{studentId}")]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> SubmitEnrollment(int studentId, [FromBody] EnrollmentForm form)
        {
            var student = await _context.Students.FindAsync(studentId);
            if (student == null) return NotFound();
            student.EnrollmentSubmittedAt = DateTime.UtcNow;
            student.RequirementsStatus = "Pending";
            // Save additional form data as needed
            await _context.SaveChangesAsync();
            return Ok("Enrollment form submitted.");
        }

        // New: Start an enrollment request (creates EnrollmentRecord)
        [HttpPost("start")]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> StartEnrollment([FromBody] StartEnrollmentDto dto)
        {
            var student = await _context.Students.FindAsync(dto.StudentId);
            if (student == null) return NotFound("Student not found");

            var record = new EnrollmentRecord
            {
                StudentId = dto.StudentId,
                CourseId = dto.CourseId,
                Status = "Pending",
                Notes = dto.Notes
            };
            _context.EnrollmentRecords.Add(record);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetEnrollment), new { id = record.Id }, record);
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetEnrollment(int id)
        {
            var rec = await _context.EnrollmentRecords
                .Include(r => r.Documents)
                .Include(r => r.Schedules)
                .FirstOrDefaultAsync(r => r.Id == id);
            if (rec == null) return NotFound();
            return Ok(rec);
        }

        [HttpGet("student/{studentId}")]
        [Authorize]
        public async Task<IActionResult> GetByStudent(int studentId)
        {
            var list = await _context.EnrollmentRecords
                .Where(r => r.StudentId == studentId)
                .Include(r => r.Documents)
                .Include(r => r.Schedules)
                .ToListAsync();
            return Ok(list);
        }

        [HttpPost("{id}/documents")]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> AddDocument(int id, [FromBody] DocumentDto dto)
        {
            var rec = await _context.EnrollmentRecords.FindAsync(id);
            if (rec == null) return NotFound();

            var doc = new RequirementDocument
            {
                EnrollmentRecordId = id,
                FileName = dto.FileName,
                FilePath = dto.FilePath,
                DocumentType = dto.DocumentType
            };
            _context.RequirementDocuments.Add(doc);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetEnrollment), new { id = id }, doc);
        }

        // Admin: verify enrollment requirements for a specific enrollment record
        [HttpPost("{id}/verify")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> VerifyEnrollment(int id)
        {
            var rec = await _context.EnrollmentRecords.FindAsync(id);
            if (rec == null) return NotFound();
            rec.Status = "Verified";
            rec.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return Ok("Enrollment verified.");
        }

        // Program Chair: assign schedule to an enrollment record
        [HttpPost("{id}/assign-schedule")]
        [Authorize(Roles = "ProgramChair")]
        public async Task<IActionResult> AssignScheduleToEnrollment(int id, [FromBody] ScheduleDto dto)
        {
            var rec = await _context.EnrollmentRecords.FindAsync(id);
            if (rec == null) return NotFound();
            var schedule = new Schedule
            {
                EnrollmentRecordId = id,
                CourseId = dto.CourseId,
                Details = dto.Details
            };
            _context.Schedules.Add(schedule);
            await _context.SaveChangesAsync();
            return Ok(schedule);
        }

        // Finalize enrollment: mark as Enrolled if verified
        [HttpPost("{id}/finalize")]
        [Authorize(Roles = "Administrator,ProgramChair")]
        public async Task<IActionResult> FinalizeEnrollment(int id)
        {
            var rec = await _context.EnrollmentRecords
                .Include(r => r.Schedules)
                .FirstOrDefaultAsync(r => r.Id == id);
            if (rec == null) return NotFound();
            if (rec.Status != "Verified") return BadRequest("Enrollment must be verified before finalizing.");
            rec.Status = "Enrolled";
            rec.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return Ok("Enrollment finalized.");
        }

        // 24. Admin: Verify student requirements
        [HttpPost("verify-requirements/{studentId}")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> VerifyRequirements(int studentId)
        {
            var student = await _context.Students.FindAsync(studentId);
            if (student == null) return NotFound();
            student.RequirementsStatus = "Verified";
            // Simulate sending portal credentials
            student.SISCredentials = $"SIS-{studentId}-{Guid.NewGuid().ToString().Substring(0,6)}";
            await _context.SaveChangesAsync();
            return Ok("Requirements verified and portal credentials sent.");
        }

        // 25. Program Chair: Assign schedule
        [HttpPost("assign-schedule/{studentId}")]
        [Authorize(Roles = "ProgramChair")]
        public IActionResult AssignSchedule(int studentId, [FromBody] string schedule)
        {
            // In a real system, you would save the schedule to the DB
            // For now, just simulate
            return Ok($"Schedule '{schedule}' assigned to student {studentId}.");
        }
    }

    public class EnrollmentForm
    {
        public string? AdditionalInfo { get; set; }
    }

    // DTOs for new endpoints
    public class StartEnrollmentDto
    {
        public int StudentId { get; set; }
        public int? CourseId { get; set; }
        public string? Notes { get; set; }
    }

    public class DocumentDto
    {
        public string FileName { get; set; } = string.Empty;
        public string? FilePath { get; set; }
        public string? DocumentType { get; set; }
    }

    public class ScheduleDto
    {
        public int CourseId { get; set; }
        public string? Details { get; set; }
    }
}
