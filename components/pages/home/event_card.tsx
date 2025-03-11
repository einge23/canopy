import { Card, CardContent } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { EventDTO } from "~/api/events";
import { View } from "react-native";

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
            }}
        >
            <CardContent className="p-1 flex-row items-center">
                <View className="flex-1">
                    <Text
                        className="text-xs text-black font-bold shadow-sm"
                        numberOfLines={1}
                    >
                        {event.name}
                    </Text>
                    {event.location && (
                        <Text
                            className="text-xs text-muted shadow-sm"
                            numberOfLines={1}
                        >
                            {event.location}
                        </Text>
                    )}
                </View>
            </CardContent>
        </Card>
    );
}
