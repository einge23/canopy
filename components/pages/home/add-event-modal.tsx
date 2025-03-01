import { TextInput, View } from "react-native";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";

interface AddEventModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function AddEventModal({
    open,
    onOpenChange,
}: AddEventModalProps) {
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);

    interface DateChangeEvent {
        type: string;
        nativeEvent: {
            timestamp: number;
        };
    }

    const onChange = (
        event: DateChangeEvent | undefined,
        selectedDate: Date | undefined
    ) => {
        const currentDate = selectedDate;
        setShow(false);
        setDate(currentDate || date);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[350px] p-6">
                <DialogHeader>
                    <DialogTitle>Add Event</DialogTitle>
                </DialogHeader>

                <View className="mb-6">
                    <Text className="mb-2 text-base">Event Name</Text>
                    <TextInput
                        placeholder="Event Name"
                        className="border border-input p-3 rounded"
                    />
                </View>

                <View className="mb-6">
                    <Text className="mb-2 text-base">Event Description</Text>
                    <TextInput
                        placeholder="Event Description"
                        multiline
                        numberOfLines={4}
                        className="border border-input p-3 rounded min-h-[100px]"
                    />
                </View>

                <View className="mb-6">
                    <Text className="mb-2 text-base">Event Date</Text>
                    <TextInput
                        placeholder="Event Date"
                        className="border border-input p-3 rounded"
                    />
                </View>

                <View className="mb-6">
                    <Text className="mb-2 text-base">Event Time</Text>
                    <Button className="bg-primary px-5 py-2.5">
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={date}
                            mode="datetime"
                            onChange={onChange}
                        />
                    </Button>
                </View>

                <DialogFooter className="mt-4">
                    <Button
                        onPress={() => onOpenChange(false)}
                        className="bg-neutral-400 px-5 py-2.5 ml-3 w-124"
                    >
                        <Text>Cancel</Text>
                    </Button>
                    <Button
                        onPress={() => onOpenChange(false)}
                        className="bg-primary px-5 py-2.5 ml-3 w-124"
                    >
                        <Text>Save</Text>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
