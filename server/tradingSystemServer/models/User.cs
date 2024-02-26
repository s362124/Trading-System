using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace tradingSystemServer.models
{
    // Define an enumeration to represent user roles
    public enum UserRole
    {
        Admin, // Admin role
        User   // User role
    }

    // Define a class to represent a user
    public class User
    {
        // MongoDB ObjectId representing the user's identifier
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        // User's name
        [BsonElement("Name")]
        [BsonRequired]
        public string Name { get; set; }

        // User's surname
        [BsonElement("surname")]
        [BsonRequired]
        public string Surname { get; set; }

        // User's email address
        [BsonElement("email")]
        [BsonRequired]
        public string Email { get; set; }

        // User's password
        [BsonElement("password")]
        [BsonRequired]
        public string Password { get; set; }

        // Salt used for password hashing
        [BsonElement("salt")]
        public string Salt { get; set; } = "";

        // User's phone number
        [BsonElement("phoneNumber")]
        [BsonRepresentation(BsonType.Int32)]
        public int PhoneNumber { get; set; }

        // User's gender, default is male
        [BsonElement("gender")]
        [BsonRequired]
        public string Gender { get; set; } = "male";

        // User's address
        [BsonElement("address")]
        [BsonRequired]
        public string Address { get; set; } = "";

        // User's role, default is User
        [BsonElement("role")]
        [BsonRepresentation(BsonType.String)] // Represent enum as string in MongoDB
        [BsonRequired]
        public UserRole Role { get; set; } = UserRole.User;

        // Array of item IDs that the user has liked, initialized as an empty array
        [BsonElement("likedItems")]
        public string[] LikedItems { get; set; } = new string[0];

         // Date and time when the user was joined, default is the current date and time
        [BsonElement("joinedAt")]
        public DateTime JoinedAt { get; set; } = DateTime.Now;

    }
}
