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
}
