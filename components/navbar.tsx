import * as React from "react";
import { View, Pressable, useColorScheme } from "react-native";
import { Text } from "~/components/ui/text";
import { ThemeToggle } from "~/components/ThemeToggle";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useRouter } from "expo-router";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { LogOut, User } from "lucide-react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import UserButton from "./pages/home/user-button";

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
            <UserButton />
            <ThemeToggle />
        </View>
    );
}
