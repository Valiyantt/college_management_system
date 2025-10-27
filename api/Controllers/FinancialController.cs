using college_management_system.Data;
using college_management_system.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace college_management_system.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FinancialController : ControllerBase
    {
        private readonly AppDbContext _context;
        public FinancialController(AppDbContext context)
        {
            _context = context;
        }

        // 6. Treasury: Create exam fee
        [HttpPost("create-exam-fee/{studentId}")]
        [Authorize(Roles = "FinanceTreasury")]
        public async Task<IActionResult> CreateExamFee(int studentId, [FromBody] decimal amount)
        {
            var payment = new Payment
            {
                StudentId = studentId,
                Amount = amount,
                PaidAt = DateTime.MinValue,
                ProcessedBy = User.Identity?.Name,
                PaymentType = "ExamFee",
                Status = "Pending"
            };
            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();
            return Ok(payment);
        }

        // 8. Student: Pay the exam fee (simulate over the counter)
        [HttpPost("pay-exam-fee/{paymentId}")]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> PayExamFee(int paymentId)
        {
            var payment = await _context.Payments.FindAsync(paymentId);
            if (payment == null) return NotFound();
            payment.Status = "Paid";
            payment.PaidAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return Ok("Exam fee paid.");
        }

        // 9. Cashier: Create invoice after payment
        [HttpPost("create-invoice/{paymentId}")]
        [Authorize(Roles = "FinanceCashier")]
        public async Task<IActionResult> CreateInvoice(int paymentId)
        {
            var payment = await _context.Payments.FindAsync(paymentId);
            if (payment == null) return NotFound();
            payment.InvoiceNumber = $"INV-{paymentId}-{Guid.NewGuid().ToString().Substring(0,6)}";
            await _context.SaveChangesAsync();
            return Ok(new { payment.InvoiceNumber, payment.Status });
        }

        // 19. Treasury: Create reservation fee
        [HttpPost("create-reservation-fee/{studentId}")]
        [Authorize(Roles = "FinanceTreasury")]
        public async Task<IActionResult> CreateReservationFee(int studentId, [FromBody] decimal amount)
        {
            var payment = new Payment
            {
                StudentId = studentId,
                Amount = amount,
                PaidAt = DateTime.MinValue,
                ProcessedBy = User.Identity?.Name,
                PaymentType = "ReservationFee",
                Status = "Pending"
            };
            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();
            return Ok(payment);
        }

        // 21. Cashier: Process reservation payment
        [HttpPost("pay-reservation-fee/{paymentId}")]
        [Authorize(Roles = "FinanceCashier")]
        public async Task<IActionResult> PayReservationFee(int paymentId)
        {
            var payment = await _context.Payments.FindAsync(paymentId);
            if (payment == null) return NotFound();
            payment.Status = "Paid";
            payment.PaidAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return Ok("Reservation fee paid.");
        }

        // 28. Treasury: Create tuition fee
        [HttpPost("create-tuition-fee/{studentId}")]
        [Authorize(Roles = "FinanceTreasury")]
        public async Task<IActionResult> CreateTuitionFee(int studentId, [FromBody] decimal amount)
        {
            var payment = new Payment
            {
                StudentId = studentId,
                Amount = amount,
                PaidAt = DateTime.MinValue,
                ProcessedBy = User.Identity?.Name,
                PaymentType = "TuitionFee",
                Status = "Pending"
            };
            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();
            return Ok(payment);
        }

        // 29. Student: Pay tuition fee
        [HttpPost("pay-tuition-fee/{paymentId}")]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> PayTuitionFee(int paymentId)
        {
            var payment = await _context.Payments.FindAsync(paymentId);
            if (payment == null) return NotFound();
            payment.Status = "Paid";
            payment.PaidAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return Ok("Tuition fee paid.");
        }

        // 30. Cashier: Create Statement of Account (SOA)
        [HttpPost("create-soa/{studentId}")]
        [Authorize(Roles = "FinanceCashier")]
        public async Task<IActionResult> CreateSOA(int studentId)
        {
            var payments = await _context.Payments.Where(p => p.StudentId == studentId && p.Status == "Paid").ToListAsync();
            var total = payments.Sum(p => p.Amount);
            var soa = $"SOA-{studentId}-{Guid.NewGuid().ToString().Substring(0,6)}";
            // In a real system, you would save SOA details to the DB
            return Ok(new { SOA = soa, TotalPaid = total });
        }
    }
}
