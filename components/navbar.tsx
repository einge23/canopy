import * as React from "react";
import { Pressable, View } from "react-native";
import { Text } from "~/components/ui/text";
import { ThemeToggle } from "~/components/ThemeToggle";
import UserButton from "./pages/home/user-button";
import * as Haptics from "expo-haptics";

export function Navbar() {
    const today = new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
    });

    return (
        <View className="flex-row items-center justify-between p-4 bg-background border-b border-border">
            <Text className="text-xl font-semibold text-foreground">
                {today}
            </Text>
            <View className="flex-row items-center">
                <ThemeToggle />
                <View style={{ width: 20 }} />
                <UserButton />
            </View>
        </View>
    );
}
