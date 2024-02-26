using System;
using System.Security.Cryptography;
using System.Text;

namespace tradingSystemServer.utils
{
    // Utility class for hashing and verifying passwords
    public class PasswordHasherUtil
    {
        private const int SaltSize = 16;
        private const int HashSize = 20; // Size of the hashed password

        // Method to hash a password and generate a salt
        public static (string hash, string salt) HashPassword(string password)
        {
            using (var rng = new RNGCryptoServiceProvider())
            {
                // Generate a random salt
                byte[] saltBytes = new byte[SaltSize];
                rng.GetBytes(saltBytes);
                string salt = Convert.ToBase64String(saltBytes);

                // Hash the password with the salt using PBKDF2
                using (var pbkdf2 = new Rfc2898DeriveBytes(password, saltBytes, 10000))
                {
                    byte[] hashBytes = pbkdf2.GetBytes(HashSize);
                    string hash = Convert.ToBase64String(hashBytes);

                    return (hash, salt);
                }
            }
        }

        // Method to verify a password using stored hash and salt
        public static bool VerifyPassword(string password, string storedHash, string storedSalt)
        {
            byte[] saltBytes = Convert.FromBase64String(storedSalt);

            using (var pbkdf2 = new Rfc2898DeriveBytes(password, saltBytes, 10000))
            {
                byte[] hashBytes = pbkdf2.GetBytes(HashSize);
                string hashToCheck = Convert.ToBase64String(hashBytes);

                return hashToCheck == storedHash;
            }
        }
    }
}
