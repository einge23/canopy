import { SignedIn, SignedOut, useAuth, useUser } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import {
    Dimensions,
    FlatList,
    NativeScrollEvent,
    NativeSyntheticEvent,
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
import { useQuery } from "@tanstack/react-query";
import { EventDTO, getUserEventsByDate } from "~/api/events";
import EventCard from "~/components/pages/home/event_card";
import EventCardSkeleton from "~/components/pages/home/event-card-skeleton";

const boxHeight = 64;

export default function Home() {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const flatGridRef = useRef<FlatList>(null);
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedHour, setSelectedHour] = useState<number | null>(null);
    const [scrollOffset, setScrollOffset] = useState(0);

    const { user } = useUser();
    if (!user) {
        return null;
    }

    const user_id = user.id;

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);

        return () => clearInterval(timer);
    }, []);

    const currentDate = React.useMemo(() => new Date(), []);

    const goToPreviousDay = () => {
        const prevDay = new Date(selectedDate);
        prevDay.setDate(prevDay.getDate() - 1);
        setSelectedDate(prevDay);
    };

    const goToNextDay = () => {
        const nextDay = new Date(selectedDate);
        nextDay.setDate(nextDay.getDate() + 1);
        setSelectedDate(nextDay);
    };

    // Check if selected date is today
    const isToday = React.useMemo(() => {
        const today = new Date();
        return (
            selectedDate.getDate() === today.getDate() &&
            selectedDate.getMonth() === today.getMonth() &&
            selectedDate.getFullYear() === today.getFullYear()
        );
    }, [selectedDate]);

    const { getToken } = useAuth();

    const {
        isLoading,
        data: events,
        refetch: refetchEvents,
    } = useQuery({
        // Keep the query key the same
        queryKey: ["events", user_id, selectedDate.toISOString().split("T")[0]],
        queryFn: async () => {
            const token = await getToken();
            if (!token) {
                throw new Error("Unable to get token.");
            }

            // Create a date object with time set to noon to avoid timezone edge cases
            const queryDate = new Date(
                selectedDate.getFullYear(),
                selectedDate.getMonth(),
                selectedDate.getDate(),
                12,
                0,
                0
            );

            return getUserEventsByDate({ user_id, date: queryDate }, token);
        },
        staleTime: 5 * 60 * 1000, // 5 minutes - data won't be refetched until stale
        refetchOnWindowFocus: false, // Don't refetch when window regains focus
        refetchOnMount: false, // Don't refetch when component remounts
        refetchOnReconnect: false, // Don't refetch on reconnect
    });

    const getEventsForHour = (hour: number) => {
        if (!events) return [];

        // Create date objects for the hour range in the selected date
        const hourStart = new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
            hour,
            0,
            0
        );

        const hourEnd = new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
            hour + 1,
            0,
            0
        );

        return events.filter((event) => {
            // Parse ISO strings to Date objects for comparison
            const eventStart = new Date(event.start);
            const eventEnd = new Date(event.end);

            // Event overlaps with this hour if:
            // It starts before the hour ends AND ends after the hour starts
            return eventStart < hourEnd && eventEnd > hourStart;
        });
    };

    useEffect(() => {
        const scrollTimer = setTimeout(() => {
            if (flatGridRef.current) {
                try {
                    flatGridRef.current.scrollToIndex({
                        index: currentTime.getHours(),
                        animated: true,
                        viewPosition: 0.3,
                    });
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

    const handleOpenAddEventSheet = (startHour: number) => {
        SheetManager.show("add-event-sheet", {
            payload: {
                selectedDate: currentDate,
                startHour: startHour,
                endHour: startHour + 1, // Default to 1 hour event
                user_id,
                refetchEvents,
                getToken,
            },
            onClose: () => {
                setSelectedHour(null);
            },
        });
    };

    const handleOpenEditEventSheet = (event: EventDTO) => {
        SheetManager.show("edit-event-sheet", {
            payload: {
                event,
                refetchEvents,
                getToken,
            },
            onClose: () => {
                setSelectedHour(null);
            },
        });
    };

    const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offset = e.nativeEvent.contentOffset.y;
        setScrollOffset(offset);
    };

    return (
        <SafeAreaView className="flex-1 bg-background">
            <SignedIn>
                <View className="flex-1">
                    <Navbar
                        selectedDate={selectedDate}
                        onPreviousDay={goToPreviousDay}
                        onNextDay={goToNextDay}
                        isToday={isToday}
                    />
                    <View style={{ flex: 1 }}>
                        <FlatGrid
                            ref={flatGridRef}
                            itemDimension={Dimensions.get("window").width}
                            data={hours}
                            spacing={0}
                            onScroll={handleScroll}
                            scrollEventThrottle={16}
                            getItemLayout={(data, index) => ({
                                length: boxHeight,
                                offset: boxHeight * index,
                                index,
                            })}
                            renderItem={({ item }) => {
                                const hourEvents = getEventsForHour(item);
                                const hasEvents = hourEvents.length > 0;
                                return (
                                    <Pressable
                                        className={`flex-row w-full ${
                                            selectedHour === item
                                                ? "bg-emerald-500/10"
                                                : ""
                                        }`}
                                        onPress={() => {
                                            if (hasEvents) {
                                                setSelectedHour(item);
                                                handleOpenEditEventSheet(
                                                    hourEvents[0]
                                                );
                                            } else {
                                                setSelectedHour(item);
                                                handleOpenAddEventSheet(item);
                                            }
                                        }}
                                    >
                                        <View
                                            className={`w-20 p-4 border-r border-b ${
                                                colorScheme === "dark"
                                                    ? "border-white/10"
                                                    : "border-green-900"
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
                                                    : "border-green-900"
                                            }`}
                                        >
                                            {item ===
                                                currentTime.getHours() && (
                                                <>
                                                    <View
                                                        className="bg-emerald-700"
                                                        style={{
                                                            position:
                                                                "absolute",
                                                            top: getCurrentTimeOffset(),
                                                            left: 0,
                                                            width: 8,
                                                            height: 8,
                                                            borderRadius: 4,
                                                            zIndex: 10,
                                                            transform: [
                                                                {
                                                                    translateX:
                                                                        -4,
                                                                },
                                                                {
                                                                    translateY:
                                                                        -4,
                                                                },
                                                            ],
                                                        }}
                                                    />
                                                    <View
                                                        className="bg-emerald-700"
                                                        style={{
                                                            position:
                                                                "absolute",
                                                            top: getCurrentTimeOffset(),
                                                            left: 0,
                                                            right: 0,
                                                            height: 2,
                                                            zIndex: 1000,
                                                            transform: [
                                                                {
                                                                    translateY:
                                                                        -1,
                                                                },
                                                            ],
                                                        }}
                                                    />
                                                </>
                                            )}

                                            {isLoading ? (
                                                // Show skeletons if loading
                                                <>
                                                    {item % 2 === 0 && (
                                                        <View
                                                            style={{
                                                                position:
                                                                    "absolute",
                                                                top: 0,
                                                                left: 2,
                                                                right: 2,
                                                                height:
                                                                    boxHeight -
                                                                    10,
                                                                zIndex: 50,
                                                            }}
                                                        >
                                                            <EventCardSkeleton />
                                                        </View>
                                                    )}
                                                </>
                                            ) : (
                                                // Show actual events when loaded
                                                getEventsForHour(item).map(
                                                    (event) => {
                                                        const startTime =
                                                            new Date(
                                                                event.start
                                                            );
                                                        const endTime =
                                                            new Date(event.end);

                                                        const startMinutes =
                                                            startTime.getHours() ===
                                                            item
                                                                ? startTime.getMinutes()
                                                                : 0;

                                                        const endMinutes =
                                                            endTime.getHours() ===
                                                            item + 1
                                                                ? endTime.getMinutes()
                                                                : 60;

                                                        const top =
                                                            (startMinutes /
                                                                60) *
                                                            boxHeight;
                                                        const height =
                                                            ((endMinutes -
                                                                startMinutes) /
                                                                60) *
                                                            boxHeight;

                                                        return (
                                                            <View
                                                                key={event.id}
                                                                style={{
                                                                    position:
                                                                        "absolute",
                                                                    top,
                                                                    left: 2,
                                                                    right: 2,
                                                                    height:
                                                                        height >
                                                                        10
                                                                            ? height
                                                                            : boxHeight -
                                                                              10,
                                                                    zIndex: 50,
                                                                }}
                                                            >
                                                                <EventCard
                                                                    event={
                                                                        event
                                                                    }
                                                                />
                                                            </View>
                                                        );
                                                    }
                                                )
                                            )}
                                        </View>
                                    </Pressable>
                                );
                            }}
                            fixed={true}
                            numColumns={1}
                        />
                    </View>

                    <View className="absolute right-4 bottom-4">
                        <Button
                            className="h-16 rounded-full w-14 bg-accent"
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
