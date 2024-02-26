using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace tradingSystemServer.models
{
    // Define a class to represent an item in the trading system
    public class Item
    {
        // MongoDB ObjectId representing the item's identifier
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        // Label of the item
        [BsonElement("Label")]
        [BsonRequired]
        public string Label { get; set; }

        // Description of the item
        [BsonElement("Description")]
        [BsonRequired]
        public string Description { get; set; }

        // Price of the item
        [BsonElement("Price")]
        [BsonRequired]
        public double Price { get; set; }

        // Date and time when the item was added, default is the current date and time
        [BsonElement("AddedOn")]
        public DateTime AddedOn { get; set; } = DateTime.Now;

        // Owner of the item, represented as a MongoDB ObjectId
        [BsonElement("Owner")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Owner { get; set; }

        // Image URL of the item, initialized as an empty string
        [BsonElement("image")]
        public string Image { get; set; } = "";

        // Category of the item, represented as a MongoDB ObjectId
        [BsonElement("Category")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Category { get; set; }
    }
}
