namespace tradingSystemServer.models
{
    // A class to hold settings related to the trading system database
    public class TradingSystemDatabaseSettings
    {
        // Connection string for the MongoDB database
        public string ConnectionString { get; set; } = null!;

        // Name of the MongoDB database
        public string DatabaseName { get; set; } = null!;

        // Name of the collection that stores user data
        public string UsersCollectionName { get; set; } = null!;

        // Name of the collection that stores item data
        public string ItemCollectionName { get; set; } = null!;

        // Name of the collection that stores item category data
        public string ItemCategoryCollectionName { get; set; } = null!;
    }
}
