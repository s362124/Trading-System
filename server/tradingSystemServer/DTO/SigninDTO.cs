namespace tradingSystemServer.DTO
{
    // Data transfer object (DTO) for user signin
    public class SigninDTO
    {
        // Properties representing user signin information
        public string email { get; set; }
        public string password { get; set; }

        // Constructor to initialize SigninDTO with user signin information
        public SigninDTO(string email, string password)
        {
            this.email = email;
            this.password = password;
        }
    }
}
