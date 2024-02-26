import axios from "axios";

// Define a generic class HttpClient
export class HttpClient<T> {
    protected apiurl: string; // Base URL for API endpoints
    protected authToken: string; // Authentication token

    // Constructor to initialize the base URL and authentication token
    constructor(controllerEndpoint: string) {
        this.apiurl = `http://localhost:4200/api/${controllerEndpoint}`; // Set the API base URL
        this.authToken = localStorage.getItem("token") ?? ""; // Get the authentication token from local storage or set to an empty string
    }

    // Method to fetch a single item by ID from the server
    public async getSingle(id: string): Promise<T | any> {
        try {
            const response = await axios.get(`${this.apiurl}/${id}`, {
                headers: {
                    Authorization: `Bearer ${this.authToken}` // Set the authorization header with the authentication token
                }
            });
            return response.data; // Return the data received from the server
        } catch (error) {
            throw error; // Throw any errors encountered during the request
        }
    }

    // Method to fetch multiple items from the server
    public async getMultiple(): Promise<T[] | any> {
        try {
            const response = await axios.get(`${this.apiurl}`, {
                headers: {
                    Authorization: `Bearer ${this.authToken}`
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Method to create a new item on the server
    public async create(data: Partial<T>): Promise<T | any> {
        try {
            const response = await axios.post(`${this.apiurl}`, {
                id: "", // Assuming the ID is empty as it's likely auto-generated on the server
                ...data // Spread the provided data
            }, {
                headers: {
                    Authorization: `Bearer ${this.authToken}`
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Method to update an existing item on the server
    public async update(data: Partial<T>, id: string): Promise<T | any> {
        try {
            const response = await axios.put(`${this.apiurl}/${id}`, {
                ...data
            }, {
                headers: {
                    Authorization: `Bearer ${this.authToken}`
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Method to delete an item from the server by ID
    public async delete(id: string): Promise<T | any> {
        try {
            const response = await axios.delete(`${this.apiurl}/${id}`, {
                headers: {
                    Authorization: `Bearer ${this.authToken}`
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}
