import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";

export const {
    signIn,
    signUp,
    getSession,
    deleteUser,
    signOut,
    updateUser,
    useSession,
} = createAuthClient();

export const authClient = createAuthClient({
    baseURL: process.env.AUTH_BASE_URL,
    plugins: [
        expoClient({
            scheme: "canopy",
            storagePrefix: "canopy",
            storage: SecureStore,
        }),
    ],
});
