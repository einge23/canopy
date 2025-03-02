import {
    View,
    TextInput,
    TouchableOpacity,
    useColorScheme,
} from "react-native";
import ActionSheet, {
    SheetManager,
    SheetProps,
} from "react-native-actions-sheet";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";

export default function AddEventSheet(props: SheetProps) {
    // Get current color scheme to use proper background color
    const colorScheme = useColorScheme();
    const bgColor = colorScheme === "dark" ? "#212121" : "#e8f4ea";

    const handleCloseSheet = () => {
        SheetManager.hide("add-event-sheet");
    };

    return (
        <ActionSheet
            id={props.sheetId}
            gestureEnabled={true}
            containerStyle={{
                backgroundColor: bgColor,
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15,
            }}
            indicatorStyle={{
                width: 60,
                height: 5,
                backgroundColor: "#DDDDDD",
                borderRadius: 5,
                marginTop: 8,
                alignSelf: "center",
            }}
            keyboardHandlerEnabled={true}
        >
            <View
                style={{
                    backgroundColor: bgColor,
                    padding: 24,
                    borderTopLeftRadius: 15,
                    borderTopRightRadius: 15,
                }}
            >
                <Text className="text-xl font-semibold mb-4">Add Event</Text>

                <View className="mb-4">
                    <Text className="mb-2 text-base font-semibold">
                        Event Name
                    </Text>
                    <TextInput
                        placeholder="Enter event name"
                        className="border border-input p-3 rounded font-light"
                    />
                </View>

                <View className="mb-4">
                    <Text className="mb-2 text-base font-semibold">
                        Event Description
                    </Text>
                    <TextInput
                        placeholder="Enter description"
                        multiline
                        numberOfLines={4}
                        className="border border-input p-3 rounded min-h-[100px] font-light"
                    />
                </View>

                <View className="flex-row justify-end gap-2 mt-4">
                    <Button
                        onPress={handleCloseSheet}
                        className="bg-neutral-400 px-5 py-2.5"
                    >
                        <Text>Cancel</Text>
                    </Button>
                    <Button
                        onPress={handleCloseSheet}
                        className="bg-primary px-5 py-2.5"
                    >
                        <Text>Save</Text>
                    </Button>
                </View>
            </View>
        </ActionSheet>
    );
}
