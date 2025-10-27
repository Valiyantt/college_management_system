using college_management_system.Data;
using college_management_system.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace college_management_system.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExamController : ControllerBase
    {
        private readonly AppDbContext _context;
        public ExamController(AppDbContext context)
        {
            _context = context;
        }

        // 13. Student: Log in using exam credentials (simulated)
        [HttpPost("login-exam")]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> LoginExam([FromBody] ExamLoginRequest req)
        {
            var student = await _context.Students.FirstOrDefaultAsync(s => s.ExamCredentials == req.ExamCredentials);
            if (student == null) return Unauthorized();
            // Simulate exam login
            return Ok("Exam login successful. You may now take the exam.");
        }

        // 14. Student: Take entrance exam (simulated)
        [HttpPost("submit-exam/{studentId}")]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> SubmitExam(int studentId, [FromBody] ExamSubmission submission)
        {
            var student = await _context.Students.FindAsync(studentId);
            if (student == null) return NotFound();
            // Simulate exam scoring
            student.ExamStatus = "Under Review";
            student.ExamResult = submission.Result;
            await _context.SaveChangesAsync();
            return Ok("Exam submitted. Await result.");
        }

        // 16. API: Send exam result (simulated)
        [HttpPost("send-exam-result/{studentId}")]
        [Authorize(Roles = "Administrator,Guidance")]
        public async Task<IActionResult> SendExamResult(int studentId, [FromBody] string result)
        {
            var student = await _context.Students.FindAsync(studentId);
            if (student == null) return NotFound();
            student.ExamStatus = result;
            // TODO: Send result via email
            await _context.SaveChangesAsync();
            return Ok("Exam result sent.");
        }

        // 18. Guidance: View student exam results
        [HttpGet("results")]
        [Authorize(Roles = "Guidance,Administrator")]
        public async Task<IActionResult> GetExamResults()
        {
            var results = await _context.Students.Select(s => new { s.Id, s.FirstName, s.LastName, s.ExamStatus, s.ExamResult }).ToListAsync();
            return Ok(results);
        }
    }

    public class ExamLoginRequest
    {
        public required string ExamCredentials { get; set; }
    }
    public class ExamSubmission
    {
        public required string Result { get; set; }
    }
}
