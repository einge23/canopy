import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import * as React from "react";
import { ScrollView, View } from "react-native";
import HourCard from "~/components/pages/home/hour_card";
import { SignOutButton } from "~/components/pages/home/sign-out-buton";
import { Text } from "~/components/ui/text";
export default function Home() {
    const currentHour = new Date().getHours();

    const hours = Array.from({ length: 24 }, (_, i) => (currentHour + i) % 24);
    const { user } = useUser();

    return (
        <View className="flex-1">
            {" "}
            <SignedIn>
                <View className="flex-1">
                    {" "}
                    <View className=" bg-background">
                        <Text className="text-lg">
                            Hello {user?.emailAddresses[0].emailAddress}
                        </Text>
                        <SignOutButton />
                    </View>
                    <ScrollView className="flex-1 bg-secondary/30">
                        <View>
                            {hours.map((hour) => (
                                <HourCard key={hour} hour={hour} />
                            ))}
                        </View>
                    </ScrollView>
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
        </View>
    );

    // return (
    //     <ScrollView
    //         className="flex-1 bg-secondary/30"
    //         contentContainerStyle={{ padding: 24 }}
    //     >
    //         <View className="flex-1 p-6 gap-5">
    //             {hours.map((hour) => (
    //                 <HourCard key={hour} hour={hour} />
    //             ))}
    //         </View>
    //     </ScrollView>
    // );
}
