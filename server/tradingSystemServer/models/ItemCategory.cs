using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace tradingSystemServer.models
{
    // Define a class to represent an item category in the trading system
    public class ItemCategory
    {
        // MongoDB ObjectId representing the item category's identifier
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        // Label of the item category
        [BsonElement("Label")]
        [BsonRequired]
        public string Label { get; set; }

        // Array of items belonging to this category (nullable)
        [BsonElement("Items")]
        public Item[]? Items { get; set; }
    }
}
