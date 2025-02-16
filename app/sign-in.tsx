import * as React from "react";
import { View } from "react-native";
import { authClient } from "~/lib/auth-client";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import SignInCard from "~/components/pages/sign-in/sign-in-card";

export default function SignIn() {
    const { data: session, isPending } = authClient.useSession();

    const handleSignIn = async () => {};

    if (!session) {
        return (
            <>
                <View className="flex-1 items-center bg-accent pt-16">
                    <Text className="text-4xl font-bold mb-6 text-foreground">
                        welcome!
                    </Text>
                    <SignInCard />
                </View>
            </>
        );
    }

    return (
        <View>
            <Text>Text</Text>
        </View>
    );
}
