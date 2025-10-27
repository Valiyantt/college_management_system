using college_management_system.Data;
using college_management_system.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace college_management_system.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Administrator")]
    public class AdmissionsController : ControllerBase
    {
        private readonly AppDbContext _context;
        public AdmissionsController(AppDbContext context)
        {
            _context = context;
        }

        // 5. Verify student and update status
        [HttpPost("verify-student/{studentId}")]
        public async Task<IActionResult> VerifyStudent(int studentId)
        {
            var student = await _context.Students.FindAsync(studentId);
            if (student == null) return NotFound();
            student.ApplicationStatus = "In Progress";
            // Simulate sending email for payment
            // TODO: Integrate real email service
            await _context.SaveChangesAsync();
            return Ok("Student verified and notified for payment.");
        }

        // 10. View application status
        [HttpGet("application-status/{studentId}")]
        public async Task<IActionResult> GetApplicationStatus(int studentId)
        {
            var student = await _context.Students.FindAsync(studentId);
            if (student == null) return NotFound();
            return Ok(new { student.ApplicationStatus, student.PaymentStatus });
        }

        // 11. Auto-send entrance exam link and credentials (simulated)
        [HttpPost("send-exam-link/{studentId}")]
        public async Task<IActionResult> SendExamLink(int studentId)
        {
            var student = await _context.Students.FindAsync(studentId);
            if (student == null) return NotFound();
            student.ExamCredentials = $"EXAM-{studentId}-{Guid.NewGuid().ToString().Substring(0,6)}";
            student.ApplicationStatus = "Exam Link Sent";
            // TODO: Integrate real email service
            await _context.SaveChangesAsync();
            return Ok(new { message = "Exam link and credentials sent.", examCredentials = student.ExamCredentials });
        }

        // 12. Manually send exam link (optional)
        [HttpPost("manual-send-exam-link/{studentId}")]
        public async Task<IActionResult> ManualSendExamLink(int studentId)
        {
            // For now, same as SendExamLink
            return await SendExamLink(studentId);
        }
    }
}
