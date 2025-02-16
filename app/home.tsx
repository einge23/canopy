import * as React from "react";
import { ScrollView, View } from "react-native";
import HourCard from "~/components/pages/home/hour_card";

export default function Home() {
    const currentHour = new Date().getHours();

    const hours = Array.from({ length: 24 }, (_, i) => (currentHour + i) % 24);

    return (
        <ScrollView
            className="flex-1 bg-secondary/30"
            contentContainerStyle={{ padding: 24 }}
        >
            <View className="flex-1 p-6 gap-5">
                {hours.map((hour) => (
                    <HourCard key={hour} hour={hour} />
                ))}
            </View>
        </ScrollView>
    );
}
