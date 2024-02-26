import axios from "axios";
import { HttpClient } from "../utils/HttpClient";

// Define a class for interacting with file-related APIs
export default class FileService extends HttpClient<any> {
    constructor() {
        super('File'); // Call the constructor of the parent class with the endpoint "File"
    }

    // Method to upload a file
    async uploadFile(data: File) {
        try {
            const formData = new FormData();
            formData.append('file', data); // Append the file to the FormData object
            const res = await axios.post(`${this.apiurl}/uploadFile`, formData, {
                headers: {
                    Authorization: `Bearer ${this.authToken}`, // Include authorization token in the request headers
                    ContentType: 'multipart/form-data' // Set content type to multipart/form-data
                }
            });
            return res.data; // Return the response data
        } catch (error) {
            throw error; // Throw any errors that occur during the request
        }
    }

    // Method to fetch a file by filename
    async getFile(filename: string) {
        try {
            const res = await axios.get(`${this.apiurl}/GetImage/${filename}`, {
                headers: {
                    Authorization: `Bearer ${this.authToken}` // Include authorization token in the request headers
                }
            });
            return res.data; // Return the fetched data
        } catch (error) {
            throw error; // Throw any errors that occur during the request
        }
    }
}
