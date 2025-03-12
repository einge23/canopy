import {
  SignedIn,
  SignedOut,
  useAuth,
  useSession,
  useUser,
} from "@clerk/clerk-expo";
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
import { useQuery } from "@tanstack/react-query";
import { EventDTO, getUserEventsByDate } from "~/api/events";
import EventCard from "~/components/pages/home/event_card";
import { Skeleton } from "~/components/ui/skeleton";

const boxHeight = 64;

export default function Home() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const flatGridRef = useRef<FlatList>(null);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
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

  const { getToken } = useAuth();

  const {
    isLoading,
    data: events,
    refetch: refetchEvents,
  } = useQuery({
    queryKey: ["events", user_id, currentDate],
    queryFn: async () => {
      const token = await getToken();
      console.log(token);
      if (!token) {
        throw new Error("Unable to get token.");
      }
      return getUserEventsByDate({ user_id, date: currentDate }, token);
    },
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });

  const renderHourContent = (hour: number) => {
    if (isLoading) {
      // Render skeleton placeholders
      return (
        <View className="relative flex-1 h-16 border-b border-white/10">
          {hour % 2 === 0 && (
            <Skeleton className="absolute h-12 rounded-md left-2 right-2 top-2" />
          )}
          {hour % 3 === 0 && (
            <Skeleton className="absolute h-8 rounded-md left-2 right-2 top-6" />
          )}
        </View>
      );
    }
  };

  const getEventsForHour = (hour: number) => {
    if (!events) return [];

    const today = new Date();
    const hourStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      hour,
      0,
      0
    );
    const hourEnd = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      hour + 1,
      0,
      0
    );

    return events.filter((event) => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);

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

  const handleOpenAddEventSheet = (hour: number) => {
    SheetManager.show("add-event-sheet", {
      payload: {
        selectedDate: new Date(),
        startHour: hour,
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
      },
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
                  selectedHour === item ? "bg-emerald-500/10" : ""
                }`}
                onPress={() => {
                  const hourEvents = getEventsForHour(item);
                  if (hourEvents.length === 0) {
                    setSelectedHour(item);
                    handleOpenAddEventSheet(item);
                  } else {
                    setSelectedHour(item);
                    handleOpenEditEventSheet(hourEvents[0]);
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
                  <Text className="text-sm font-light">{formatTime(item)}</Text>
                </View>
                <View
                  className={`flex-1 h-16 relative border-b ${
                    colorScheme === "dark"
                      ? "border-white/10"
                      : "border-green-900"
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
                          transform: [{ translateX: -4 }, { translateY: -4 }],
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
                          transform: [{ translateY: -1 }],
                        }}
                      />
                    </>
                  )}

                  {getEventsForHour(item).map((event) => {
                    const startTime = new Date(event.start);
                    const endTime = new Date(event.end);

                    const startMinutes =
                      startTime.getHours() === item
                        ? startTime.getMinutes()
                        : 0;

                    const endMinutes =
                      endTime.getHours() === item + 1
                        ? endTime.getMinutes()
                        : 60;

                    const top = (startMinutes / 60) * boxHeight;
                    const height =
                      ((endMinutes - startMinutes) / 60) * boxHeight;

                    return (
                      <View
                        key={event.id}
                        style={{
                          position: "absolute",
                          top,
                          left: 2,
                          right: 2,
                          height: boxHeight - 10,
                          zIndex: 50,
                        }}
                      >
                        <EventCard event={event} />
                      </View>
                    );
                  })}
                </View>
                {renderHourContent(item)}
              </Pressable>
            )}
            fixed={true}
            numColumns={1}
          />
          <View className="absolute right-4 bottom-4">
            <Button
              className="h-16 rounded-full w-14 bg-accent"
              onPress={() => setIsModalOpen(true)}
            >
              <Plus className="w-6 h-6" color={iconColor} />
            </Button>
            <AddEventModal open={isModalOpen} onOpenChange={setIsModalOpen} />
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
