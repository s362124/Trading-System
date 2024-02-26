using tradingSystemServer.models;
namespace tradingSystemServer.DTO
{
    // Data transfer object (DTO) for user signup
    public class SignupDTO
    {
        // Properties representing user signup information
        public string Name { get; set; }
        public string Surname { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Gender { get; set; }
        public string Address { get; set; }
        public int PhoneNumber { get; set; } // Change Int32 to int for consistency
        public UserRole Role { get; set; }

        // Constructor to initialize SignupDTO with user signup information
        public SignupDTO(string name, string surname, string email, string password, string gender, int phoneNumber, UserRole role, string address)
        {
            Name = name;
            Surname = surname;
            Email = email;
            Password = password;
            Gender = gender;
            PhoneNumber = phoneNumber;
            Role = role;
            Address = address;
        }
    }
}
