namespace college_management_system.Models
{
    public class User
    {
    public int Id { get; set; }
    public string? Username { get; set; }
    public string? PasswordHash { get; set; }
    public string? EmailHash { get; set; }
    public string? Role { get; set; } // Administrator, Student, FinanceTreasury, FinanceCashier
    }
}
