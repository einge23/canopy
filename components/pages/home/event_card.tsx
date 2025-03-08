import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { EventDTO } from "~/api/events";
import { View } from "react-native";

interface EventCardProps {
    event: EventDTO;
}

export default function EventCard({ event }: EventCardProps) {

    return (
        <View className="z-10 h-64 rounded-full border">
            <Text>{event.name}</Text>
            <Text>{event.location}</Text>
            <Text>{event.description}</Text>
            <Text>{event.color}</Text>
            <Text>{event.recurrence_rule}</Text>
        </View>
    );
}
