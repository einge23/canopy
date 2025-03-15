import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import {
    View,
    useColorScheme,
    TouchableOpacity,
    Pressable,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Keyboard,
    ActivityIndicator,
} from "react-native";
import ActionSheet, {
    SheetProps,
    SheetManager,
} from "react-native-actions-sheet";
import { TextInput } from "react-native-gesture-handler";
import { toast } from "sonner-native";
import { deleteEvent, editEvent, EventDTO } from "~/api/events";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
interface EditEventSheetProps extends SheetProps<"edit-event-sheet"> {
    onClose?: () => void;
}

export default function EditEventSheet(props: EditEventSheetProps) {
    const colorScheme = useColorScheme();
    const bgColor = colorScheme === "dark" ? "#212121" : "#e8f4ea";
    const event = props.payload?.event ? props.payload.event : null;

    const editEventForm = useForm({
        defaultValues: {
            id: event?.id,
            name: event?.name,
            description: event?.description,
            location: event?.location,
            color: event?.color, // Default color
            recurrence_rule: "Never",
            start: event?.start,
            end: event?.end,
            user_id: event?.user_id,
        } as EventDTO,
    });

    const { isPending, mutate: saveEditEvent } = useMutation({
        mutationFn: async () => {
            const token = await props.payload?.getToken();
            if (!token || token === undefined) {
                throw new Error("Unable to get token.");
            }
            await editEvent(editEventForm.state.values, token);
        },

        onSuccess: () => {
            toast.success("Event edited successfully");
            handleCloseSheet();
            if (props.payload?.refetchEvents) {
                props.payload.refetchEvents();
            }
        },
        onError: (error) => {
            toast.error("Failed to edit event");
            console.error("Failed to edit event:", error);
        },
    });

    const { isPending: pendingDelete, mutate: saveDeleteEvent } = useMutation({
        mutationFn: async () => {
            const token = await props.payload?.getToken();
            if (!token || token === undefined) {
                throw new Error("Unable to get token.");
            }
            await deleteEvent(editEventForm.state.values.id, token);
        },

        onSuccess: () => {
            toast.success("Event deleted successfully");
            handleCloseSheet();
            if (props.payload?.refetchEvents) {
                props.payload.refetchEvents();
            }
        },
        onError: (error) => {
            toast.error("Failed to delete event");
            console.error("Failed to delete event:", error);
        },
    });

    const recurrenceOptions = ["Never", "Daily", "Weekly", "Monthly", "Yearly"];
    const colorOptions = [
        "#55CBCD",
        "#97C2A9",
        "#FF968A",
        "#FFCBA2",
        "#CBAACB",
        "#FEE1E8",
    ];

    const handleCloseSheet = () => {
        if (props.onClose) {
            editEventForm.reset();
            props.onClose();
        }

        SheetManager.hide("edit-event-sheet");
    };

    return (
        <ActionSheet
            id={props.sheetId}
            gestureEnabled
            containerStyle={{
                backgroundColor: bgColor,
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15,
                minHeight: "85%",
            }}
            indicatorStyle={{
                width: 60,
                height: 5,
                backgroundColor: "#DDDDDD",
                borderRadius: 5,
                marginTop: 8,
                alignSelf: "center",
            }}
            onClose={handleCloseSheet}
            closeOnPressBack={false}
            closeOnTouchBackdrop={false}
            useBottomSafeAreaPadding
            snapPoints={[90]}
            initialSnapIndex={0}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <Pressable onPress={() => Keyboard.dismiss()}>
                    <ScrollView
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle={{ padding: 24 }}
                    >
                        <View className="mb-2">
                            <Text className="text-xl font-semibold">
                                Edit Event
                            </Text>
                        </View>

                        <View className="mb-4">
                            {editEventForm.Field({
                                name: "name",
                                children: (field) => (
                                    <TextInput
                                        placeholder="event name"
                                        value={field.state.value}
                                        onChangeText={field.handleChange}
                                        className="p-3 font-light border rounded border-input"
                                        style={{
                                            color:
                                                colorScheme === "dark"
                                                    ? "white"
                                                    : "black",
                                        }}
                                    />
                                ),
                            })}
                        </View>

                        <Text className="mb-2 text-base font-semibold">
                            event description
                        </Text>

                        <View className="mb-4">
                            {editEventForm.Field({
                                name: "description",
                                children: (field) => (
                                    <TextInput
                                        placeholder="event description"
                                        placeholderClassName="text-input"
                                        value={field.state.value}
                                        onChangeText={field.handleChange}
                                        numberOfLines={3}
                                        multiline
                                        className="border border-input p-3 rounded min-h-[65px] font-light"
                                        style={{
                                            color:
                                                colorScheme === "dark"
                                                    ? "white"
                                                    : "black",
                                        }}
                                    />
                                ),
                            })}
                        </View>

                        <Text className="mb-2 text-base font-semibold">
                            location
                        </Text>

                        <View className="mb-4">
                            {editEventForm.Field({
                                name: "location",
                                children: (field) => (
                                    <TextInput
                                        placeholder="event location"
                                        value={field.state.value}
                                        onChangeText={field.handleChange}
                                        className="p-3 font-light border rounded border-input"
                                        style={{
                                            color:
                                                colorScheme === "dark"
                                                    ? "white"
                                                    : "black",
                                        }}
                                    />
                                ),
                            })}
                        </View>

                        <View className="mb-4">
                            <Text className="mb-2 text-base font-semibold">
                                recurrence
                            </Text>
                            <View className="flex-row items-center justify-between p-3 border rounded border-input">
                                {editEventForm.Field({
                                    name: "recurrence_rule",
                                    children: (field) => (
                                        <>
                                            {recurrenceOptions.map((option) => (
                                                <Pressable
                                                    key={option}
                                                    onPress={() =>
                                                        field.handleChange(
                                                            option
                                                        )
                                                    }
                                                >
                                                    <Text
                                                        className={`${
                                                            field.state
                                                                .value ===
                                                            option
                                                                ? colorScheme ===
                                                                  "dark"
                                                                    ? "text-primary font-semibold"
                                                                    : "text-black font-semibold"
                                                                : "text-input font-semibold"
                                                        }`}
                                                    >
                                                        {option}
                                                    </Text>
                                                </Pressable>
                                            ))}
                                        </>
                                    ),
                                })}
                            </View>
                        </View>

                        <View className="mb-4">
                            <Text className="mb-2 text-base font-semibold">
                                event color
                            </Text>
                            <View className="flex-row items-center justify-between">
                                {editEventForm.Field({
                                    name: "color",
                                    children: (field) => (
                                        <>
                                            {colorOptions.map((color) => (
                                                <TouchableOpacity
                                                    key={color}
                                                    onPress={() =>
                                                        field.handleChange(
                                                            color
                                                        )
                                                    }
                                                    style={{
                                                        width: 24,
                                                        height: 24,
                                                        backgroundColor: color,
                                                        borderRadius: 4,
                                                        borderColor:
                                                            field.state
                                                                .value === color
                                                                ? colorScheme ===
                                                                  "dark"
                                                                    ? "white"
                                                                    : "black"
                                                                : "transparent",
                                                        borderWidth: 2,
                                                    }}
                                                />
                                            ))}
                                        </>
                                    ),
                                })}
                            </View>
                        </View>

                        <View className="flex-row justify-between items-center mt-4 mb-6">
                            {/* Delete button on the left */}
                            <Button
                                onPress={() => saveDeleteEvent()}
                                className={`px-5 py-2.5 bg-red-500 ${
                                    pendingDelete ? "opacity-70" : ""
                                }`}
                                disabled={pendingDelete}
                            >
                                {pendingDelete ? (
                                    <View className="flex-row items-center">
                                        <ActivityIndicator
                                            size="small"
                                            color="white"
                                        />
                                        <Text className="ml-2 text-white">
                                            Deleting...
                                        </Text>
                                    </View>
                                ) : (
                                    <Text>Delete</Text>
                                )}
                            </Button>

                            {/* Cancel and Save buttons on the right */}
                            <View className="flex-row gap-2">
                                <Button
                                    onPress={handleCloseSheet}
                                    className="bg-neutral-400 px-5 py-2.5"
                                >
                                    <Text>Cancel</Text>
                                </Button>
                                <Button
                                    onPress={() => saveEditEvent()}
                                    className={`px-5 py-2.5 ${
                                        isPending
                                            ? "bg-primary/70"
                                            : "bg-primary"
                                    }`}
                                    disabled={isPending}
                                >
                                    {isPending ? (
                                        <View className="flex-row items-center">
                                            <ActivityIndicator
                                                size="small"
                                                color="white"
                                            />
                                            <Text className="ml-2 text-white">
                                                Saving...
                                            </Text>
                                        </View>
                                    ) : (
                                        <Text>Save</Text>
                                    )}
                                </Button>
                            </View>
                        </View>
                    </ScrollView>
                </Pressable>
            </KeyboardAvoidingView>
        </ActionSheet>
    );
}
