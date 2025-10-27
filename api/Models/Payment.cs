namespace college_management_system.Models
{
    public class Payment
    {
        public int Id { get; set; }
        public int StudentId { get; set; }
        public Student? Student { get; set; }
        public decimal Amount { get; set; }
        public DateTime PaidAt { get; set; }
        public string? ProcessedBy { get; set; } // Username or UserId of Finance

        // Payment tracking
        public string? PaymentType { get; set; } // e.g. ExamFee, ReservationFee, TuitionFee
        public string? Status { get; set; } // e.g. Pending, Paid, Overdue
        public string? InvoiceNumber { get; set; }
    }
}
