import axios from "axios";
import { Origami } from "lucide-react-native";

// const baseURL =
//   process.env.EXPO_PUBLIC_API_ENV === "production"
//     ? "https://canopy-api-production.up.railway.app"
//     : "http://localhost:3000";

const baseURL = "http://localhost:3000";

console.log(process.env.EXPO_PUBLIC_API_ENV);

// Create a function to get a configured API instance with auth
export const getAuthenticatedApi = (token: string) => {
    // Clone the api instance
    const authenticatedApi = axios.create({
        withCredentials: true,
        baseURL: baseURL,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "*/*",
            Host: "expo",
            Connection: "keep-alive",
            "Accept-Encoding": "gzip, deflate, br",
            "User-Agent": "Canopy Client",
            Referer: "localhost:3000",
            Origin: "localhost:3000",
            "Sec-Fetch-Dest": "localhost:3000",
            "X-Forwarded-Host": "localhost:3000",
            "X-Forwarded-Proto": "http",
        },
        timeout: 10000,
    });

    // Add the same interceptors
    authenticatedApi.interceptors.response.use(
        // Same response handler as before
        (response) => {
            console.log("API Response:", {
                status: response.status,
                statusText: response.statusText,
                data: response.data,
                url: response.config.url,
            });
            return response;
        },
        // Same error handler as before
        (error) => {
            // Error handling code...
            return Promise.reject(error);
        }
    );

    return authenticatedApi;
};

export const api = axios.create({
    baseURL: baseURL,
    headers: {
        "Content-Type": "application/json",
    },
    // Add timeout to get better error messages
    timeout: 10000,
});

api.interceptors.response.use(
    (response) => {
        console.log("API Response:", {
            status: response.status,
            statusText: response.statusText,
            data: response.data,
            url: response.config.url,
        });
        return response;
    },
    (error) => {
        // Format error response in a more readable way
        if (error.response) {
            console.error("API Error:", {
                status: error.response.status,
                statusText: error.response.statusText || "No status text",
                url: error.config?.url,
                endpoint: `${error.config?.baseURL || ""}${
                    error.config?.url || ""
                }`,
                method: error.config?.method?.toUpperCase(),
                requestData: error.config?.data
                    ? JSON.parse(error.config.data)
                    : null,
                responseData: error.response.data,
            });
        } else if (error.request) {
            // Request was made but no response received
            console.error("API Error: No response received", {
                url: error.config?.url,
                method: error.config?.method?.toUpperCase(),
            });
        } else {
            // Something else happened while setting up the request
            console.error("API Error:", error.message);
        }

        return Promise.reject(error);
    }
);
