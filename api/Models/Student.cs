namespace college_management_system.Models
{
    public class Student
    {
        public int Id { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Email { get; set; }
        public int UserId { get; set; }
        public User? User { get; set; }

        // Enrollment/application status tracking
        public string? ApplicationStatus { get; set; } // e.g. Under Review, In Progress, Pay Testing Fee, Paid, Enrolled, etc.
        public string? ExamStatus { get; set; } // e.g. NotTaken, Passed, Conditional, Failed
        public string? EnrollmentStatus { get; set; } // e.g. Pending, Slot Secured, Enrolled
        public string? ScholarshipStatus { get; set; } // e.g. None, Applied, Approved, Disapproved
        public string? SISCredentials { get; set; } // For portal credentials
        public string? OTP { get; set; } // For email verification
        public DateTime? OTPGeneratedAt { get; set; }
        public bool EmailVerified { get; set; }
        public DateTime? ApplicationSubmittedAt { get; set; }
        public DateTime? EnrollmentSubmittedAt { get; set; }
        public string? RequirementsStatus { get; set; } // e.g. Pending, Verified
        public string? PaymentStatus { get; set; } // e.g. Unpaid, Paid, Partial
        public string? ExamCredentials { get; set; }
        public string? ExamResult { get; set; }
    }
}
