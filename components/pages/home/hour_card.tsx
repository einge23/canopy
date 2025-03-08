import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "~/components/pages/home/card";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";

interface HourCardProps {
    hour: number;
}

export default function HourCard({ hour }: HourCardProps) {
    const formattedHour = new Date(2024, 0, 1, hour).toLocaleString("en-US", {
        hour: "numeric",
        hour12: true,
    });

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>{formattedHour}</CardTitle>
                <CardDescription>Schedule for this hour</CardDescription>
            </CardHeader>
            <CardContent>
                <Text>Activities planned for {formattedHour}</Text>
            </CardContent>
            <CardFooter>
                <Button>
                    <Text>Add Event</Text>
                </Button>
            </CardFooter>
        </Card>
    );
}
