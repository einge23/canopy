import { SignedIn, SignedOut, useSession, useUser } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import {
    Dimensions,
    FlatList,
    Pressable,
    useColorScheme,
    View,
} from "react-native";
import { FlatGrid } from "react-native-super-grid";
import { SafeAreaView } from "react-native-safe-area-context";
import { Navbar } from "~/components/navbar";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react-native";
import AddEventModal from "~/components/pages/home/add-event-modal";
import { SheetManager } from "react-native-actions-sheet";

const boxHeight = 64;

export default function Home() {
    const [currentTime, setCurrentTime] = useState(new Date());
    const flatGridRef = useRef<FlatList>(null);
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedHour, setSelectedHour] = useState<number | null>(null);
    const { user } = useUser();
    const user_id = parseInt(user?.id as string);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const scrollTimer = setTimeout(() => {
            if (flatGridRef.current) {
                try {
                    flatGridRef.current.scrollToIndex({
                        index: currentTime.getHours(),
                        animated: true,
                        viewPosition: 0.3,
                    });
                    console.log(`Scrolling to hour: ${currentTime.getHours()}`);
                } catch (error) {
                    console.error("Error scrolling:", error);
                }
            }
        }, 300);

        return () => clearTimeout(scrollTimer);
    }, [currentTime]);

    const colorScheme = useColorScheme();
    const iconColor = colorScheme === "dark" ? "white" : "black";

    const formatTime = (hour: number): string => {
        const ampm = hour >= 12 ? "PM" : "AM";
        const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
        return `${formattedHour} ${ampm}`;
    };

    const getCurrentTimeOffset = () => {
        const minutes = currentTime.getMinutes();
        return (minutes / 60) * boxHeight - 6;
    };

    const handleOpenAddEventSheet = (hour: number) => {
        SheetManager.show("add-event-sheet", {
            payload: { selectedDate: new Date(), startHour: hour, user_id },
            onClose: () => {
                setSelectedHour(null);
            },
        });
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
                            <Pressable
                                className={`flex-row w-full ${
                                    selectedHour === item
                                        ? "bg-emerald-500/10"
                                        : ""
                                }`}
                                onPress={() => {
                                    setSelectedHour(item);
                                    handleOpenAddEventSheet(item);
                                }}
                            >
                                <View
                                    className={`w-20 p-4 border-r border-b ${
                                        colorScheme === "dark"
                                            ? "border-white/10"
                                            : "border-gray-300"
                                    }`}
                                >
                                    <Text className="text-sm font-light">
                                        {formatTime(item)}
                                    </Text>
                                </View>
                                <View
                                    className={`flex-1 h-16 relative border-b ${
                                        colorScheme === "dark"
                                            ? "border-white/10"
                                            : "border-gray-300"
                                    }`}
                                >
                                    {item === currentTime.getHours() && (
                                        <>
                                            <View
                                                className="bg-emerald-700"
                                                style={{
                                                    position: "absolute",
                                                    top: getCurrentTimeOffset(),
                                                    left: 0,
                                                    width: 8,
                                                    height: 8,
                                                    borderRadius: 4,
                                                    zIndex: 1000,
                                                    transform: [
                                                        { translateX: -4 },
                                                        { translateY: -4 },
                                                    ],
                                                }}
                                            />
                                            <View
                                                className="bg-emerald-700"
                                                style={{
                                                    position: "absolute",
                                                    top: getCurrentTimeOffset(),
                                                    left: 0,
                                                    right: 0,
                                                    height: 2,
                                                    zIndex: 1000,
                                                    transform: [
                                                        { translateY: -1 },
                                                    ],
                                                }}
                                            />
                                        </>
                                    )}
                                </View>
                            </Pressable>
                        )}
                        fixed={true}
                        numColumns={1}
                    />
                    <View className="absolute bottom-4 right-4">
                        <Button
                            className="w-14 h-16 rounded-full bg-accent"
                            onPress={() => setIsModalOpen(true)}
                        >
                            <Plus className="w-6 h-6" color={iconColor} />
                        </Button>
                        <AddEventModal
                            open={isModalOpen}
                            onOpenChange={setIsModalOpen}
                        />
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
