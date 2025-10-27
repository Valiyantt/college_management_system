using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace college_management_system.Models
{
    public class EnrollmentRecord
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int StudentId { get; set; }

        public int? CourseId { get; set; }

        [Required]
        [MaxLength(50)]
        public string Status { get; set; } = "Pending"; // Pending, Verified, Enrolled, Cancelled

        public string? Notes { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        // Navigation
        public Student? Student { get; set; }
        public Course? Course { get; set; }
        public List<RequirementDocument>? Documents { get; set; }
        public List<Schedule>? Schedules { get; set; }
    }
}
