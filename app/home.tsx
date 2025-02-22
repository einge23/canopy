import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import {
    Dimensions,
    FlatList,
    ScrollView,
    useColorScheme,
    View,
} from "react-native";
import { FlatGrid, FlatGridProps } from "react-native-super-grid";
import { SafeAreaView } from "react-native-safe-area-context";
import { Navbar } from "~/components/navbar";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react-native";

const { height } = Dimensions.get("window");
const boxHeight = 80;

export default function Home() {
    const [currentTime, setCurrentTime] = useState(new Date());
    const flatGridRef = useRef<FlatList>(null);
    const hours = Array.from({ length: 24 }, (_, i) => i);

    useEffect(() => {
        // Update current time every minute
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);

        // Scroll to current hour
        if (flatGridRef.current) {
            flatGridRef.current.scrollToIndex({
                index: currentTime.getHours(),
                animated: true,
            });
        }

        return () => clearInterval(timer);
    }, []);

    const { user } = useUser();
    const colorScheme = useColorScheme();
    const iconColor = colorScheme === "dark" ? "white" : "black";

    const formatTime = (hour: number): string => {
        const ampm = hour >= 12 ? "PM" : "AM";
        const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
        return `${formattedHour} ${ampm}`;
    };

    const getCurrentTimeOffset = () => {
        const minutes = currentTime.getMinutes();
        return (minutes / 60) * boxHeight - 1;
    };

    return (
        <SafeAreaView className="flex-1 bg-background">
            <SignedIn>
                <View className="flex-1">
                    <Navbar />
                    <FlatGrid
                        ref={flatGridRef}
                        itemDimension={Dimensions.get("window").width}
                        data={hours}
                        spacing={0}
                        getItemLayout={(data, index) => ({
                            length: boxHeight,
                            offset: boxHeight * index,
                            index,
                        })}
                        renderItem={({ item }) => (
                            <View
                                className={`flex-row w-full border-b ${
                                    colorScheme === "dark"
                                        ? "border-white/10"
                                        : "border-gray-400"
                                }`}
                            >
                                <View
                                    className={`w-20 p-4 border-r ${
                                        colorScheme === "dark"
                                            ? "border-white/10"
                                            : "border-gray-400"
                                    }`}
                                >
                                    <Text className="text-sm font-light">
                                        {formatTime(item)}
                                    </Text>
                                </View>
                                <View className="flex-1 h-16 relative">
                                    {item === currentTime.getHours() && (
                                        <>
                                            <View
                                                style={{
                                                    position: "absolute",
                                                    top: getCurrentTimeOffset(),
                                                    left: 0,
                                                    width: 8,
                                                    height: 8,
                                                    borderRadius: 4,
                                                    backgroundColor: "#7473fb",
                                                    zIndex: 1000,
                                                    transform: [
                                                        { translateY: -22.3 },
                                                        { translateX: -5 },
                                                    ],
                                                }}
                                            />
                                            <View
                                                style={{
                                                    position: "absolute",
                                                    top: getCurrentTimeOffset(),
                                                    left: 0,
                                                    right: 0,
                                                    height: 2,
                                                    zIndex: 1000,
                                                    backgroundColor: "#7473fb",
                                                    transform: [
                                                        { translateY: -19.9 },
                                                    ],
                                                }}
                                            />
                                        </>
                                    )}
                                </View>
                            </View>
                        )}
                        fixed={true}
                        numColumns={1}
                    />
                    <View className="absolute bottom-4 right-4">
                        <Button className="w-14 h-16 rounded-full bg-accent">
                            <Plus className="w-6 h-6" color={iconColor} />
                        </Button>
                    </View>
                </View>
            </SignedIn>
            <SignedOut>
                <Link href="/(auth)/sign-in">
                    <Text>Sign in</Text>
                </Link>
                <Link href="/(auth)/sign-up">
                    <Text>Sign up</Text>
                </Link>
            </SignedOut>
        </SafeAreaView>
    );
}
