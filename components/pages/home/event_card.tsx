import { Card, CardContent } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { EventDTO } from "~/api/events";
import { View } from "react-native";
import { MapPin } from "lucide-react-native";

interface EventCardProps {
    event: EventDTO;
}
export default function EventCard({ event }: EventCardProps) {
    return (
        <Card
            className="h-full overflow-hidden border-l-4 shadow-lg"
            style={{
                backgroundColor: event.color,
                borderLeftColor: event.color,
                zIndex: 11,
            }}
        >
            <CardContent className="p-1 flex-row items-center">
                <View className="flex-1">
                    <View className="flex-row items-center">
                        <Text
                            className="text-xs  text-black font-bold shadow-sm flex-shrink"
                            numberOfLines={1}
                        >
                            {event.name}
                        </Text>

                        {event.location && (
                            <View className="flex-row items-center ml-4 flex-shrink-0">
                                <MapPin
                                    height={10}
                                    width={10}
                                    color="#666666"
                                />
                                <Text
                                    className="text-xs text-muted font-semibold shadow-sm ml-0.5"
                                    numberOfLines={1}
                                >
                                    {event.location}
                                </Text>
                            </View>
                        )}
                    </View>
                    <Text className="text-xs font-light text-black mt-1 shadow-sm">
                        {event.description && event.description.length > 80
                            ? `${event.description.substring(0, 80)}...`
                            : event.description}
                    </Text>
                </View>
            </CardContent>
        </Card>
    );
}
