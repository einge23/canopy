import { useUser, useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { User, LogOut } from "lucide-react-native";
import { Pressable, View, useColorScheme } from "react-native";
import { Text } from "~/components/ui/text";
import Animated, { FadeIn } from "react-native-reanimated";
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import * as Haptics from "expo-haptics";

export default function UserButton() {
    const { user } = useUser();
    const { signOut } = useAuth();
    const router = useRouter();
    const colorScheme = useColorScheme();

    const handleSignOut = async () => {
        try {
            await signOut();
            router.replace("/(auth)/sign-in");
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    const iconColor = colorScheme === "dark" ? "white" : "black";
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Pressable onPress={() => Haptics.selectionAsync()}>
                    <Avatar alt="User avatar" className="w-8 h-8">
                        <AvatarImage
                            source={{ uri: user?.imageUrl }}
                            className="w-8 h-8 rounded-full"
                        />
                        <AvatarFallback>
                            {user?.firstName?.[0]}
                            {user?.lastName?.[0]}
                        </AvatarFallback>
                    </Avatar>
                </Pressable>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 mt-2">
                <Animated.View entering={FadeIn.duration(200)}>
                    <DropdownMenuLabel>
                        <View className="flex-row items-center space-x-2">
                            <Avatar alt="User avatar" className="w-8 h-8 mr-2">
                                <AvatarImage
                                    source={{ uri: user?.imageUrl }}
                                    className="w-8 h-8 rounded-full"
                                />
                                <AvatarFallback>
                                    {user?.firstName?.[0]}
                                    {user?.lastName?.[0]}
                                </AvatarFallback>
                            </Avatar>
                            <View>
                                <Text className="font-medium">
                                    {user?.username}
                                </Text>
                                <Text className="text-muted-foreground text-xs">
                                    {user?.emailAddresses[0].emailAddress}
                                </Text>
                            </View>
                        </View>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" color={iconColor} />
                        <Text className="text-foreground font-semibold">
                            profile
                        </Text>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onPress={handleSignOut}>
                        <LogOut
                            className="mr-2 h-4 w-4 text-foreground"
                            color={iconColor}
                        />
                        <Text className="text-foreground font-semibold">
                            sign out
                        </Text>
                    </DropdownMenuItem>
                </Animated.View>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

function signOut() {
    throw new Error("Function not implemented.");
}
