import { betterAuth } from "better-auth";
import {
    signUp as authSignUp,
    signIn as authSignIn,
    signOut as authSignOut,
} from "~/lib/auth-client";

export const auth = betterAuth({
    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
    },
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60,
        },
    },
    trustedOrigins: ["canopy://"],
});

export async function signUp(
    email: string,
    password: string,
    name: string,
    image?: string
) {
    const { data, error } = await authSignUp.email(
        {
            email,
            password,
            name,
            image,
            callbackURL: "/",
        },
        {
            onRequest: (ctx) => {
                //show loading
            },
            onSuccess: (ctx) => {
                //redirect to the dashboard or sign in page
            },
            onError: (ctx) => {
                // display the error message
                alert(ctx.error.message);
            },
        }
    );
    return { data, error };
}

export async function signIn(email: string, password: string) {
    const { data, error } = await authSignIn.email(
        {
            email,
            password,
            callbackURL: "/",
            rememberMe: true,
        },
        {
            onRequest: (ctx) => {
                //show loading
            },
            onSuccess: (ctx) => {
                //redirect to the dashboard or sign in page
            },
            onError: (ctx) => {
                // display the error message
                alert(ctx.error.message);
            },
        }
    );
    return { data, error };
}

export async function signOut() {
    await authSignOut();
}
