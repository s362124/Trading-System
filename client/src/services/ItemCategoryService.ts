import { ItemCategory } from "../types/ItemCategory";
import { HttpClient } from "../utils/HttpClient";

// Define a class for interacting with item category-related APIs
export class ItemCategoryService extends HttpClient<ItemCategory> {
    constructor() {
        super("ItemCategory"); // Call the constructor of the parent class with the endpoint "ItemCategory"
    }
}
