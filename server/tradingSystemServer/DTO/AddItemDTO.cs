namespace tradingSystemServer.DTO
{
    // Data transfer object (DTO) for adding an item
    public class AddItemDTO
    {
        // Properties representing item information
        public string Label { get; set; }
        public string Description { get; set; }
        public double Price { get; set; }
        public string Category { get; set; }

        // Constructor to initialize AddItemDTO with item information
        public AddItemDTO(string label, string description, double price, string category)
        {
            Label = label;
            Description = description;
            Price = price;
            Category = category;
        }
    }
}
