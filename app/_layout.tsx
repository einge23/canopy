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

export const unstable_settings = {
    initialRouteName: "sign-in",
};

export { ErrorBoundary } from "expo-router";

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
        colorScheme === "dark"
            ? "#212121" /* dark: formerly background (#2a3e34) */
            : "#e8f4ea"; /* light: formerly background */

    return (
        <View
            className="flex-1 bg-background"
            style={{ backgroundColor: nativeBackgroundColor }}
        >
            <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
            <Stack>
                <Stack.Screen
                    name="sign-in"
                    options={{
                        title: "",
                        headerStyle: {
                            backgroundColor:
                                colorScheme === "dark" ? "#2e2e2e" : "#b8d8be",
                        },
                        headerShadowVisible: false,
                        headerRight: () => <ThemeToggle />,
                    }}
                />
                <Stack.Screen
                    name="home"
                    options={{
                        title: today,
                        headerRight: () => <ThemeToggle />,
                    }}
                />
            </Stack>
            <PortalHost />
        </View>
    );
}

const useIsomorphicLayoutEffect =
    Platform.OS === "web" && typeof window === "undefined"
        ? React.useEffect
        : React.useLayoutEffect;
