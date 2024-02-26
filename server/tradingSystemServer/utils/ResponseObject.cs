namespace tradingSystemServer.utils
{
    // Class representing a response object with message, error, and data
    public class ResponseObject
    {
        // Properties for message, error, and data
        public string? Message { get; set; }
        public string? Error { get; set; }
        public object? Data { get; set; }

        // Constructor to initialize response object with message, error, and data
        public ResponseObject(string? message, string? error, object? data)
        {
            Message = message;
            Error = error;
            Data = data;
        }

        // Constructor to initialize response object with message and data
        public ResponseObject(string message, object value)
        {
            Message = message;
            Data = value;
        }

        // Constructor to initialize response object with error message
        public ResponseObject(string error)
        {
            Error = error;
        }
    }
}
