import React, { useState } from "react";
import {
    View,
    TextInput,
    Keyboard,
    TouchableWithoutFeedback,
} from "react-native";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { Link } from "expo-router";

export default function SignInCard() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Card className="w-[90%] max-w-sm bg-background p-6">
                <CardHeader className="items-center space-y-4 pb-6">
                    <CardTitle className="text-center text-2xl pb-6">
                        sign in to canopy
                    </CardTitle>
                    <Text className="text-center text-muted-foreground font-light">
                        sign in to your account to access your schedule and
                        more.
                    </Text>
                </CardHeader>
                <CardContent className="space-y-6">
                    <View className="space-y-6">
                        <TextInput
                            className="w-full rounded-xl border border-border bg-background p-4 font-light text-foreground"
                            placeholder="Username"
                            value={username}
                            onChangeText={setUsername}
                        />
                        <TextInput
                            className="w-full rounded-xl border border-border bg-background p-4 mt-4 font-light text-foreground"
                            placeholder="Password"
                            value={password}
                            secureTextEntry
                            onChangeText={setPassword}
                        />
                    </View>
                    <Button className="w-full rounded-xl mt-8">
                        <Text className="text-center">Sign In</Text>
                    </Button>
                </CardContent>
                <CardFooter className="pt-6">
                    <Text className="text-center text-foreground font-light">
                        don't have an account? click{" "}
                        <Link
                            className="text-foreground underline font-light"
                            href="/sign-up"
                        >
                            here
                        </Link>{" "}
                        to sign up.
                    </Text>
                </CardFooter>
            </Card>
        </TouchableWithoutFeedback>
    );
}
