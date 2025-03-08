import "~/global.css";
import {
    Comfortaa_300Light,
    Comfortaa_400Regular,
    Comfortaa_500Medium,
    Comfortaa_600SemiBold,
    Comfortaa_700Bold,
} from "@expo-google-fonts/comfortaa";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { Platform, View } from "react-native";
import { useColorScheme } from "~/lib/useColorScheme";
import { PortalHost } from "@rn-primitives/portal";
import { ThemeToggle } from "~/components/ThemeToggle";
import { setAndroidNavigationBar } from "~/lib/android-navigation-bar";
import { tokenCache } from "~/cache";
import { ClerkLoaded, ClerkProvider } from "@clerk/clerk-expo";
import { SheetProvider } from "react-native-actions-sheet";
import "~/components/ui/sheets";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export { ErrorBoundary } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
export default function RootLayout() {
    const hasMounted = React.useRef(false);
    const { colorScheme } = useColorScheme();
    const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);
    const [fontsLoaded] = useFonts({
        Comfortaa_300Light,
        Comfortaa_400Regular,
        Comfortaa_500Medium,
        Comfortaa_600SemiBold,
        Comfortaa_700Bold,
    });

    useIsomorphicLayoutEffect(() => {
        if (hasMounted.current) return;

        if (Platform.OS === "web") {
            // Toggle dark mode on web via the "dark" class on the <html> element.
            if (colorScheme === "dark") {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
        }

        setAndroidNavigationBar(colorScheme);
        setIsColorSchemeLoaded(true);
        hasMounted.current = true;
    }, [colorScheme]);

    if (!fontsLoaded || !isColorSchemeLoaded) {
        return null;
    }

    const today = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
    });

    // For native devices, fallback to explicit background colors.
    const nativeBackgroundColor =
        colorScheme === "dark" ? "#212121" : "#e8f4ea";

    const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

    if (!publishableKey) {
        throw new Error(
            "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env"
        );
    }

    const queryClient = new QueryClient();

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <ClerkProvider
                tokenCache={tokenCache}
                publishableKey={publishableKey}
            >
                <QueryClientProvider client={queryClient}>
                    <SheetProvider context="global">
                        <ClerkLoaded>
                            <View
                                className="flex-1 bg-background"
                                style={{
                                    backgroundColor: nativeBackgroundColor,
                                }}
                            >
                                <StatusBar
                                    style={
                                        colorScheme === "dark"
                                            ? "light"
                                            : "dark"
                                    }
                                />
                                <Stack
                                    screenOptions={{
                                        headerShown: false,
                                    }}
                                >
                                    <Stack.Screen name="home" />
                                </Stack>
                                <PortalHost />
                            </View>
                        </ClerkLoaded>
                    </SheetProvider>
                </QueryClientProvider>
            </ClerkProvider>
        </GestureHandlerRootView>
    );
}

const useIsomorphicLayoutEffect =
    Platform.OS === "web" && typeof window === "undefined"
        ? React.useEffect
        : React.useLayoutEffect;
