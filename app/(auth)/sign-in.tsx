import { useSignIn } from "@clerk/clerk-expo";
import { Href, Link, useRouter } from "expo-router";
import {
    View,
    TextInput,
    Keyboard,
    TouchableWithoutFeedback,
} from "react-native";
import React, { useCallback, useState } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";

export default function Page() {
    const { signIn, setActive, isLoaded } = useSignIn();
    const router = useRouter();

    const [emailAddress, setEmailAddress] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [lastNavTime, setLastNavTime] = useState(0);
    const NAVIGATION_COOLDOWN = 1000;

    const handleNavigation = useCallback(
        (path: Href) => {
            const now = Date.now();
            if (now - lastNavTime < NAVIGATION_COOLDOWN) {
                return;
            }
            setLastNavTime(now);
            router.replace(path);
        },
        [lastNavTime]
    );

    const onSignInPress = useCallback(async () => {
        if (!isLoaded || loading) return;

        try {
            setLoading(true);
            const signInAttempt = await signIn.create({
                identifier: emailAddress,
                password,
            });

            // If sign-in process is complete, set the created session as active
            // and redirect the user
            if (signInAttempt.status === "complete") {
                await setActive({ session: signInAttempt.createdSessionId });
                handleNavigation("/");
            } else {
                // If the status isn't complete, check why. User might need to
                // complete further steps.
                console.error(JSON.stringify(signInAttempt, null, 2));
            }
        } catch (err) {
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            console.error(JSON.stringify(err, null, 2));
        } finally {
            setLoading(false);
        }
    }, [isLoaded, emailAddress, password]);

    return (
        <View className="flex-1 items-center bg-accent pt-16">
            <Text className="text-4xl font-bold mb-6 text-foreground">
                welcome!
            </Text>

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
                                autoCapitalize="none"
                                value={emailAddress}
                                placeholder="Enter email"
                                onChangeText={(emailAddress) =>
                                    setEmailAddress(emailAddress)
                                }
                            />
                            <TextInput
                                value={password}
                                className="w-full rounded-xl border border-border bg-background p-4 mt-4 font-light text-foreground"
                                placeholder="Enter password"
                                secureTextEntry={true}
                                onChangeText={(password) =>
                                    setPassword(password)
                                }
                            />
                        </View>
                        <Button
                            className="w-full rounded-xl mt-8"
                            onPress={onSignInPress}
                        >
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
        </View>
    );
}

// return (
//     <View>
//         <TextInput
//             autoCapitalize="none"
//             value={emailAddress}
//             placeholder="Enter email"
//             onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
//         />
//         <TextInput
//             value={password}
//             placeholder="Enter password"
//             secureTextEntry={true}
//             onChangeText={(password) => setPassword(password)}
//         />
//         <Button title="Sign in" onPress={onSignInPress} />
//         <View>
//             <Text>Don't have an account?</Text>
//             <Link href="/sign-up">
//                 <Text>Sign up</Text>
//             </Link>
//         </View>
//     </View>
// );
// }

// export default function SignInCard() {
//     const [username, setUsername] = useState("");
//     const [password, setPassword] = useState("");

//     return (
//         <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//             <Card className="w-[90%] max-w-sm bg-background p-6">
//                 <CardHeader className="items-center space-y-4 pb-6">
//                     <CardTitle className="text-center text-2xl pb-6">
//                         sign in to canopy
//                     </CardTitle>
//                     <Text className="text-center text-muted-foreground font-light">
//                         sign in to your account to access your schedule and
//                         more.
//                     </Text>
//                 </CardHeader>
//                 <CardContent className="space-y-6">
//                     <View className="space-y-6">
//                         <TextInput
//                             className="w-full rounded-xl border border-border bg-background p-4 font-light text-foreground"
//                             placeholder="Username"
//                             value={username}
//                             onChangeText={setUsername}
//                         />
//                         <TextInput
//                             className="w-full rounded-xl border border-border bg-background p-4 mt-4 font-light text-foreground"
//                             placeholder="Password"
//                             value={password}
//                             secureTextEntry
//                             onChangeText={setPassword}
//                         />
//                     </View>
//                     <Button className="w-full rounded-xl mt-8">
//                         <Text className="text-center">Sign In</Text>
//                     </Button>
//                 </CardContent>
//                 <CardFooter className="pt-6">
//                     <Text className="text-center text-foreground font-light">
//                         don't have an account? click{" "}
//                         <Link
//                             className="text-foreground underline font-light"
//                             href="/sign-up"
//                         >
//                             here
//                         </Link>{" "}
//                         to sign up.
//                     </Text>
//                 </CardFooter>
//             </Card>
//         </TouchableWithoutFeedback>
//     );
// }
