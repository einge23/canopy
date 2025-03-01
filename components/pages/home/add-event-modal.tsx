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

interface AddEventModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function AddEventModal({
    open,
    onOpenChange,
}: AddEventModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Event</DialogTitle>
                </DialogHeader>

                <View className="mb-4">
                    <Text className="mb-1">Event Name</Text>
                    <TextInput
                        placeholder="Event Name"
                        className="border border-input p-2 rounded"
                    />
                </View>

                <View className="mb-4">
                    <Text className="mb-1">Event Description</Text>
                    <TextInput
                        placeholder="Event Description"
                        multiline
                        numberOfLines={3}
                        className="border border-input p-2 rounded"
                    />
                </View>

                <View className="mb-4">
                    <Text className="mb-1">Event Date</Text>
                    <TextInput
                        placeholder="Event Date"
                        className="border border-input p-2 rounded"
                    />
                </View>

                <View className="mb-4">
                    <Text className="mb-1">Event Time</Text>
                    <TextInput
                        placeholder="Event Time"
                        className="border border-input p-2 rounded"
                    />
                </View>

                <DialogFooter>
                    <Button onPress={() => onOpenChange(false)}>
                        <Text>Cancel</Text>
                    </Button>
                    <Button
                        onPress={() => onOpenChange(false)}
                        className="bg-primary"
                    >
                        <Text>Save</Text>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
