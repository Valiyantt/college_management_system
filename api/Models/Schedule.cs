using System.ComponentModel.DataAnnotations;

namespace college_management_system.Models
{
    public class Schedule
    {
        public int Id { get; set; }

        [Required]
        public int EnrollmentRecordId { get; set; }

        [Required]
        public int CourseId { get; set; }

        public string? Details { get; set; }

        public DateTime AssignedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public EnrollmentRecord? EnrollmentRecord { get; set; }
        public Course? Course { get; set; }
    }
}
