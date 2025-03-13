import * as React from "react";
import { Pressable, View } from "react-native";
import { Text } from "~/components/ui/text";
import { ThemeToggle } from "~/components/ThemeToggle";
import UserButton from "./pages/home/user-button";
import * as Haptics from "expo-haptics";
import { ChevronLeft, ChevronRight } from "lucide-react-native";

interface NavbarProps {
    selectedDate: Date;
    onPreviousDay: () => void;
    onNextDay: () => void;
    isToday: boolean;
}

export function Navbar({
    selectedDate,
    onPreviousDay,
    onNextDay,
    isToday,
}: NavbarProps) {
    const formattedDate = selectedDate.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    return (
        <View className="flex-row items-center justify-between p-4 bg-background border-b border-border">
            <View className="flex-row items-center">
                <Pressable
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        onPreviousDay();
                    }}
                    className="p-2 mr-2"
                >
                    <ChevronLeft size={20} />
                </Pressable>

                <Text className="text-xl font-semibold text-foreground">
                    {formattedDate}
                </Text>

                <Pressable
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        onNextDay();
                    }}
                    className="p-2 ml-2"
                >
                    <ChevronRight size={20} />
                </Pressable>
            </View>

            <View className="flex-row items-center">
                <ThemeToggle />
                <View style={{ width: 20 }} />
                <UserButton />
            </View>
        </View>
    );
}
