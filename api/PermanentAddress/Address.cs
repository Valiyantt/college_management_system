using System.ComponentModel.DataAnnotations;

namespace college_management_system.PermanentAddress
{
    public class Address
    {
        [Key]
        public int Id { get; set; }

    [Required]
    public required string Province { get; set; }

    [Required]
    public required string City { get; set; }

    [Required]
    public required string Barangay { get; set; }

    [Required]
    [Display(Name = "House Number/Building Number")]
    public required string HouseNumberOrBuildingNumber { get; set; }

    [Required]
    public required string StreetName { get; set; }

    [Required]
    [RegularExpression(@"^\d{4,6}$", ErrorMessage = "Zipcode must be 4-6 digits.")]
    public required string Zipcode { get; set; }
    }
}
