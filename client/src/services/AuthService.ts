import axios from "axios";
import { HttpClient } from "../utils/HttpClient";
import { LoginDTO, SignupDTO } from "../types/Auth";

// Define a class for interacting with authentication-related APIs
export class AuthService extends HttpClient<any> {
    constructor() {
        super("auth"); // Call the constructor of the parent class with the endpoint "auth"
    }

    // Method to log in a user
    public async login(data: LoginDTO): Promise<any> {
        try {
            const response = await axios.post(`${this.apiurl}/login`, { ...data }); // Send a POST request to the login endpoint with the provided data
            localStorage.setItem("token", response.data.token); // Store the received token in local storage
            return response.data; // Return the response data
        } catch (error) {
            throw error; // Throw any errors that occur during the request
        }
    }

    // Method to sign up a user
    public async signup(data: SignupDTO): Promise<any> {
        try {
            const response = await axios.post(`${this.apiurl}/signup`, { ...data }); // Send a POST request to the signup endpoint with the provided data
            return response.data; // Return the response data
        } catch (error) {
            throw error; // Throw any errors that occur during the request
        }
    }
}
