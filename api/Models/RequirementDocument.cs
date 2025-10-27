using System.ComponentModel.DataAnnotations;

namespace college_management_system.Models
{
    public class RequirementDocument
    {
        public int Id { get; set; }

        [Required]
        public int EnrollmentRecordId { get; set; }

        [Required]
        [MaxLength(260)]
        public string FileName { get; set; } = string.Empty;

        [MaxLength(1024)]
        public string? FilePath { get; set; }

        [MaxLength(100)]
        public string? DocumentType { get; set; }

        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public EnrollmentRecord? EnrollmentRecord { get; set; }
    }
}
