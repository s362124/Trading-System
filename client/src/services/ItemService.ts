import axios from "axios";
import { Item } from "../types/Item";
import { HttpClient } from "../utils/HttpClient";

// Define a class for interacting with item-related APIs
export class ItemService extends HttpClient<Item> {
    constructor() {
        super("Item"); // Call the constructor of the parent class with the endpoint "Item"
    }
    
    // Method to fetch multiple items by category ID
    async getMultipleByCategory(id: string): Promise<Item[]> {
        try {
            const res = await axios.get(`${this.apiurl}/filterByCategory/${id}`); // Send a GET request to the appropriate API endpoint
            return res.data; // Return the fetched data
        } catch (error) {
            throw error; // Throw any errors that occur during the request
        }
    }
}
