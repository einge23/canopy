import { useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

export function SignOutButton() {
    const { signOut } = useAuth();
    const router = useRouter();

    const handleSignOut = async () => {
        try {
            await signOut();
            router.replace("/(auth)/sign-in");
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    return (
        <Button onPress={handleSignOut} variant="destructive">
            <Text className="text-white">Sign Out</Text>
        </Button>
    );
}
