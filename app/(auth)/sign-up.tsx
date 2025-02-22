import * as React from "react";
import {
    Text,
    TextInput,
    View,
    TouchableWithoutFeedback,
    Keyboard,
} from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";

export default function SignUpScreen() {
    const { isLoaded, signUp, setActive } = useSignUp();
    const router = useRouter();

    const [emailAddress, setEmailAddress] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [pendingVerification, setPendingVerification] = React.useState(false);
    const [code, setCode] = React.useState("");

    // Handle submission of sign-up form
    const onSignUpPress = async () => {
        if (!isLoaded) return;

        // Start sign-up process using email and password provided
        try {
            await signUp.create({
                emailAddress,
                password,
            });

            // Send user an email with verification code
            await signUp.prepareEmailAddressVerification({
                strategy: "email_code",
            });

            // Set 'pendingVerification' to true to display second form
            // and capture OTP code
            setPendingVerification(true);
        } catch (err) {
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            console.error(JSON.stringify(err, null, 2));
        }
    };

    // Handle submission of verification form
    const onVerifyPress = async () => {
        if (!isLoaded) return;

        try {
            // Use the code the user provided to attempt verification
            const signUpAttempt = await signUp.attemptEmailAddressVerification({
                code,
            });

            // If verification was completed, set the session to active
            // and redirect the user
            if (signUpAttempt.status === "complete") {
                await setActive({ session: signUpAttempt.createdSessionId });
                router.replace("/");
            } else {
                // If the status is not complete, check why. User may need to
                // complete further steps.
                console.error(JSON.stringify(signUpAttempt, null, 2));
            }
        } catch (err) {
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            console.error(JSON.stringify(err, null, 2));
        }
    };

    if (pendingVerification) {
        return (
            <View className="flex-1 items-center bg-accent pt-16">
                <Text className="text-4xl font-bold mb-6 text-foreground">
                    verify email
                </Text>

                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <Card className="w-[90%] max-w-sm bg-background p-6">
                        <CardHeader className="items-center space-y-4 pb-6">
                            <CardTitle className="text-center text-2xl pb-6">
                                check your email
                            </CardTitle>
                            <Text className="text-center text-muted-foreground font-light">
                                we've sent a verification code to your email
                                address
                            </Text>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <View className="space-y-6">
                                <TextInput
                                    className="w-full rounded-xl border border-border bg-background p-4 font-light text-foreground"
                                    value={code}
                                    placeholder="Enter verification code"
                                    onChangeText={(code) => setCode(code)}
                                />
                            </View>
                            <Button
                                className="w-full rounded-xl mt-4"
                                onPress={onVerifyPress}
                            >
                                <Text className="text-center">
                                    Verify Email
                                </Text>
                            </Button>
                        </CardContent>
                    </Card>
                </TouchableWithoutFeedback>
            </View>
        );
    }

    return (
        <View className="flex-1 items-center bg-accent pt-16">
            <Text className="text-4xl font-bold mb-6 text-foreground">
                welcome!
            </Text>

            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <Card className="w-[90%] max-w-sm bg-background p-6">
                    <CardHeader className="items-center space-y-4 pb-6">
                        <CardTitle className="text-center text-2xl pb-6">
                            sign up to canopy
                        </CardTitle>
                        <Text className="text-center text-muted-foreground font-light">
                            create to your account to access your schedule and
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
                            onPress={onSignUpPress}
                        >
                            <Text>Continue</Text>
                        </Button>
                    </CardContent>
                    <CardFooter className="pt-6">
                        <Text className="text-center text-foreground font-light">
                            already have an account? click{" "}
                            <Link
                                className="text-foreground underline font-light"
                                href="/sign-in"
                            >
                                here
                            </Link>{" "}
                            to sign in.
                        </Text>
                    </CardFooter>
                </Card>
            </TouchableWithoutFeedback>
        </View>
    );
}
