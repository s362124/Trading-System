import axios from "axios";
import { User } from "../types/User";
import { HttpClient } from "../utils/HttpClient";

// Define a class for interacting with user-related APIs
export class UserService extends HttpClient<User> {
    constructor() {
        super("User"); // Call the constructor of the parent class with the endpoint "User"
    }

    // Method to fetch user data by email
    public async getByEmail(email: string): Promise<User | any> {
        try {
            const response = await axios.get(`${this.apiurl}/email/${email}`, {
                headers: {
                    Authorization: `Bearer ${this.authToken}` // Include authorization token in the request headers
                }
            });
            return response.data; // Return the fetched user data
        } catch (error) {
            throw error; // Throw any errors that occur during the request
        }
    }

    // Method to fetch liked items by user ID
    public async getLikedItems(id: string): Promise<string[] | any> {
        try {
            const response = await axios.get(`${this.apiurl}/likedItems/${id}`, {
                headers: {
                    Authorization: `Bearer ${this.authToken}` // Include authorization token in the request headers
                }
            });
            return response.data; // Return the fetched liked items data
        } catch (error) {
            throw error; // Throw any errors that occur during the request
        }
    }

    // Method to add an item to a user's favorite list
    public async addItemToFavorite(userId: string, itemId: string): Promise<any> {
        try {
            const response = await axios.put(`${this.apiurl}/addToFavorite/${userId}/${itemId}`, undefined, {
                headers: {
                    Authorization: `Bearer ${this.authToken}` // Include authorization token in the request headers
                }
            });
            return response.data; // Return the response data after adding the item to the favorite list
        } catch (error) {
            throw error; // Throw any errors that occur during the request
        }
    }

    // Method to remove an item from a user's favorite list
    public async removeItemToFavorite(userId: string, itemId: string): Promise<any> {
        try {
            const response = await axios.put(`${this.apiurl}/removeFromFavorite/${userId}/${itemId}`, undefined, {
                headers: {
                    Authorization: `Bearer ${this.authToken}` // Include authorization token in the request headers
                }
            });
            return response.data; // Return the response data after adding the item to the favorite list
        } catch (error) {
            throw error; // Throw any errors that occur during the request
        }
    }

    // Method to update user's password
    public async updatePassword(userId: string, newPassword: string): Promise<any> {
        try {
            const response = await axios.put(`${this.apiurl}/updatePassword/${userId}`, 
                {NewPassword:newPassword}
            , {
                headers: {
                    Authorization: `Bearer ${this.authToken}` // Include authorization token in the request headers
                }
            });
            return response.data; // Return the response data after updating password
        } catch (error) {
            throw error; // Throw any errors that occur during the request
        }
    }
}
