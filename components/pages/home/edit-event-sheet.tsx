import { useForm } from "@tanstack/react-form";
import { View, Text, useColorScheme } from "react-native";
import ActionSheet, { SheetProps } from "react-native-actions-sheet";
import { TextInput } from "react-native-gesture-handler";

interface EditEventSheetProps extends SheetProps<"edit-event-sheet"> {
    onClose?: () => void;
}

export default function EditEventSheet(props: EditEventSheetProps) {
    const colorScheme = useColorScheme();
    const bgColor = colorScheme === "dark" ? "#212121" : "#e8f4ea";
    const event = props.payload?.event ? props.payload.event : null;

    const editEventForm = useForm({
        defaultValues: {
            name: event?.name,
            description: event?.description,
            location: event?.location,
            color: event?.color, // Default color
            recurrence_rule: "Never",
            start: event?.start,
            end: event?.end,
            user_id: event?.user_id,
        },
    });

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
            onClose={props.onClose}
        >
            <View className="mb-4">
                {editEventForm.Field({
                    name: "name",
                    children: (field) => (
                        <TextInput
                            placeholder="event name"
                            value={field.state.value}
                            onChangeText={field.handleChange}
                            className="p-3 font-light text-white rounded border border-input"
                        />
                    ),
                })}
            </View>
            <View className="mb-4">
                {editEventForm.Field({
                    name: "description",
                    children: (field) => (
                        <TextInput
                            placeholder="event description"
                            value={field.state.value}
                            onChangeText={field.handleChange}
                            className="p-3 font-light text-white rounded border border-input"
                        />
                    ),
                })}
            </View>
            <View className="mb-4">
                {editEventForm.Field({
                    name: "location",
                    children: (field) => (
                        <TextInput
                            placeholder="event location"
                            value={field.state.value}
                            onChangeText={field.handleChange}
                            className="p-3 font-light text-white rounded border border-input"
                        />
                    ),
                })}
            </View>
        </ActionSheet>
    );
}
