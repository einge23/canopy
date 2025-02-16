import axios from "axios";

const baseURL =
    process.env.NODE_ENV === "production"
        ? "https://canopy-api-production.up.railway.app"
        : "http://localhost:3000";

export const api = axios.create({
    baseURL: baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});
