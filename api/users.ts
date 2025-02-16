import { User } from "~/models/user";
import { api } from "./api-base";

export async function getUserbyId(id: number): Promise<User> {
    try {
        const response = await api.get<User>(`/users/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}
