import { Redirect, Stack } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { View } from "react-native";
import { Text } from "~/components/ui/text";

export default function AuthLayout() {
    const { isSignedIn, isLoaded } = useAuth();

    if (!isLoaded) {
        return (
            <View className="flex-1 items-center justify-center">
                <Text>Loading...</Text>
            </View>
        );
    }

    if (isSignedIn) {
        return <Redirect href="/home" />;
    }

    return <Stack screenOptions={{ headerShown: false }} />;
}
