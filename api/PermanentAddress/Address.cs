using System.ComponentModel.DataAnnotations;

namespace college_management_system.PermanentAddress
{
    public class Address
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Province { get; set; }

        [Required]
        public string City { get; set; }

        [Required]
        public string Barangay { get; set; }

        [Required]
        [Display(Name = "House Number/Building Number")]
        public string HouseNumberOrBuildingNumber { get; set; }

        [Required]
        public string StreetName { get; set; }

        [Required]
        [RegularExpression(@"^\d{4,6}$", ErrorMessage = "Zipcode must be 4-6 digits.")]
        public string Zipcode { get; set; }
    }
}
