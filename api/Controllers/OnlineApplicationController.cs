using college_management_system.Data;
using college_management_system.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace college_management_system.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OnlineApplicationController : ControllerBase
    {
        private readonly AppDbContext _context;
        public OnlineApplicationController(AppDbContext context)
        {
            _context = context;
        }

        // 1. Fill out the initial information form
        [HttpPost("register-student")]
        public async Task<IActionResult> RegisterStudent([FromBody] Student student)
        {
            if (await _context.Students.AnyAsync(s => s.Email == student.Email))
                return BadRequest("Email already registered");
            student.ApplicationStatus = "Under Review";
            student.EmailVerified = false;
            student.OTP = GenerateOtp();
            student.OTPGeneratedAt = DateTime.UtcNow;
            student.ApplicationSubmittedAt = DateTime.UtcNow;
            _context.Students.Add(student);
            await _context.SaveChangesAsync();
            // TODO: Send OTP via email
            return Ok(new { message = "Student registered. Please verify your email.", otp = student.OTP });
        }

        // 2. Verify email (OTP)
        [HttpPost("verify-email")]
        public async Task<IActionResult> VerifyEmail([FromBody] EmailVerificationRequest req)
        {
            var student = await _context.Students.FirstOrDefaultAsync(s => s.Email == req.Email);
            if (student == null) return NotFound("Student not found");
            if (student.OTP != req.OTP) return BadRequest("Invalid OTP");
            if (student.OTPGeneratedAt == null || (DateTime.UtcNow - student.OTPGeneratedAt.Value).TotalMinutes > 10)
                return BadRequest("OTP expired");
            student.EmailVerified = true;
            student.ApplicationStatus = "Email Verified";
            await _context.SaveChangesAsync();
            return Ok("Email verified. You may now log in.");
        }

        // 4. Log in (handled by AuthController)

        // 15. View application status
        [HttpGet("status/{email}")]
        public async Task<IActionResult> GetStatus(string email)
        {
            var student = await _context.Students.FirstOrDefaultAsync(s => s.Email == email);
            if (student == null) return NotFound("Student not found");
            return Ok(new
            {
                student.ApplicationStatus,
                student.ExamStatus,
                student.EnrollmentStatus,
                student.ScholarshipStatus,
                student.RequirementsStatus,
                student.PaymentStatus
            });
        }

        private string GenerateOtp()
        {
            using var rng = RandomNumberGenerator.Create();
            var bytes = new byte[4];
            rng.GetBytes(bytes);
            return BitConverter.ToUInt32(bytes, 0).ToString().Substring(0, 6);
        }
    }

    public class EmailVerificationRequest
    {
        public required string Email { get; set; }
        public required string OTP { get; set; }
    }
}
