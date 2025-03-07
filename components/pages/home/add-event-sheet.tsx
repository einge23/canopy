import {
    View,
    TextInput,
    useColorScheme,
    Pressable,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Keyboard,
    ActivityIndicator,
} from "react-native";
import ActionSheet, {
    SheetManager,
    SheetProps,
} from "react-native-actions-sheet";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { useMemo, useState } from "react";
import { CreateEventRequest, createEvent } from "~/api/events";
import { useUser } from "@clerk/clerk-expo";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner-native";

interface AddEventSheetProps extends SheetProps<"add-event-sheet"> {
    onClose?: () => void;
}

export default function AddEventSheet(props: AddEventSheetProps) {
    const colorScheme = useColorScheme();
    const bgColor = colorScheme === "dark" ? "#212121" : "#e8f4ea";

    const { user } = useUser();
    if(!user) {
        return null;
    }
    const userId = user.id;
    const { isPending, mutate: saveEvent } = useMutation({
        mutationFn: async () => await createEvent(createEventRequest),
        onSuccess: () => {
            toast.success("Event saved successfully");
            SheetManager.hide("add-event-sheet");
        },
        onError: (error) => {
            toast.error("Failed to save event");
            console.error("Failed to save event:", error);
        },
    });

    // Initialize with payload data if available
    const initialStart = useMemo(() => {
        if (props.payload) {
            const { selectedDate, startHour } = props.payload;
            const start = new Date(selectedDate);
            start.setHours(startHour, 0, 0, 0);
            return start;
        }
        return new Date();
    }, [props.payload]);

    const initialEnd = useMemo(() => {
        if (props.payload) {
            const { selectedDate, startHour } = props.payload;
            const end = new Date(selectedDate);
            end.setHours(startHour + 1, 0, 0, 0);
            return end;
        }
        return new Date();
    }, [props.payload]);

    // Use default color from colorOptions
    const defaultColor = "#55CBCD";

    const [createEventRequest, setCreateEventRequest] =
        useState<CreateEventRequest>({
            name: "",
            start: initialStart,
            end: initialEnd,
            location: "",
            description: "",
            user_id: userId,
            color: defaultColor,
            recurrence_rule: undefined,
        });

    // UI state for recurrence selection
    const [recurrence, setRecurrence] = useState<string>("Never");

    const recurrenceOptions = ["Never", "Daily", "Weekly", "Monthly", "Yearly"];
    const colorOptions = [
        "#55CBCD",
        "#97C2A9",
        "#FF968A",
        "#FFCBA2",
        "#CBAACB",
        "#FEE1E8",
    ];

    const formattedDateTime = useMemo(() => {
        if (props.payload) {
            const { selectedDate, startHour } = props.payload;
            const dateString = selectedDate.toDateString();
            const startHour12 = startHour % 12 || 12;
            const startAmPm = startHour < 12 ? "AM" : "PM";
            const endHour = startHour + 1;
            const endHour12 = endHour % 12 || 12;
            const endAmPm = endHour < 12 ? "AM" : "PM";
            return `${dateString}, ${startHour12}:00 ${startAmPm} - ${endHour12}:00 ${endAmPm}`;
        }
        return null;
    }, [props.payload]);

    // Combined handler for recurrence changes
    const handleRecurrenceChange = (option: string) => {
        setRecurrence(option);

        // Update recurrence_rule in createEventRequest
        let recurrenceRule = undefined;
        if (option !== "Never") {
            recurrenceRule = `FREQ=${option.toUpperCase()};`;
        }

        setCreateEventRequest((prev) => ({
            ...prev,
            recurrence_rule: recurrenceRule,
        }));
    };

    // Handler for color selection
    const handleColorSelect = (color: string) => {
        setCreateEventRequest((prev) => ({
            ...prev,
            color,
        }));
    };

    const handleLocationChange = (location: string) => {
        setCreateEventRequest((prev) => ({
            ...prev,
            location,
        }));
    };

    // Handlers for other form fields
    const handleNameChange = (name: string) => {
        setCreateEventRequest((prev) => ({
            ...prev,
            name,
        }));
    };

    const handleDescriptionChange = (description: string) => {
        setCreateEventRequest((prev) => ({
            ...prev,
            description,
        }));
    };

    const handleCloseSheet = () => {
        if (props.onClose) {
            props.onClose();
        }
        SheetManager.hide("add-event-sheet");
    };

    const handleSaveEvent = async () => {
        try {
            saveEvent();
        } catch (error) {
            console.error("Failed to save event:", error);
            // Add error handling here
        }
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
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View
                    style={{
                        backgroundColor: bgColor,
                        padding: 24,
                        borderTopLeftRadius: 15,
                        borderTopRightRadius: 15,
                    }}
                >
                    {formattedDateTime && (
                        <View className="mb-4">
                            <Text className="text-xl font-semibold">
                                {formattedDateTime}
                            </Text>
                        </View>
                    )}

                    <View className="mb-4">
                        <TextInput
                            placeholder="event name"
                            value={createEventRequest.name}
                            onChangeText={handleNameChange}
                            className="p-3 font-light text-white rounded border border-input"
                        />
                    </View>

                    <View className="mb-4">
                        <Text className="mb-2 text-base font-semibold">
                            recurrence
                        </Text>
                        <View className="flex-row justify-between items-center p-3 rounded border border-input">
                            {recurrenceOptions.map((option) => (
                                <Pressable
                                    key={option}
                                    onPress={() =>
                                        handleRecurrenceChange(option)
                                    }
                                >
                                    <Text
                                        className={`${
                                            recurrence === option
                                                ? "text-primary font-semibold"
                                                : "text-input font-semibold"
                                        }`}
                                    >
                                        {option}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>

                    <View className="mb-4">
                        <Text className="mb-2 text-base font-semibold">
                            event color
                        </Text>
                        <View className="flex-row justify-between items-center">
                            {colorOptions.map((color) => (
                                <TouchableOpacity
                                    key={color}
                                    onPress={() => handleColorSelect(color)}
                                    style={{
                                        width: 24,
                                        height: 24,
                                        backgroundColor: color,
                                        borderRadius: 4,
                                        borderColor:
                                            createEventRequest.color === color
                                                ? "white"
                                                : "transparent",
                                        borderWidth: 2,
                                    }}
                                />
                            ))}
                        </View>
                    </View>

                    <View className="mb-4">
                        <Text className="mb-2 text-base font-semibold">
                            event description
                        </Text>
                        <TextInput
                            placeholder="Enter description"
                            value={createEventRequest.description}
                            onChangeText={handleDescriptionChange}
                            multiline
                            numberOfLines={3}
                            className="border border-input p-3 rounded min-h-[65px] font-light text-white"
                        />
                    </View>
                    
                    <Text className="mb-4 text-base font-medium">
                        location
                    </Text>

                    <View className="mb-4">
                        <TextInput
                            placeholder="location"
                            value={createEventRequest.location}
                            onChangeText={handleLocationChange}
                            className="p-3 font-light text-white rounded border border-input"
                        />
                    </View>

                    <View className="flex-row gap-2 justify-end mt-4">
                        <Button
                            onPress={handleCloseSheet}
                            className="bg-neutral-400 px-5 py-2.5"
                        >
                            <Text>Cancel</Text>
                        </Button>
                        <Button
                            onPress={handleSaveEvent}
                            className={`px-5 py-2.5 ${
                                isPending ? "bg-primary/70" : "bg-primary"
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
            </TouchableWithoutFeedback>
        </ActionSheet>
    );
}
