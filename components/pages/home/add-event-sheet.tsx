import {
  View,
  TextInput,
  useColorScheme,
  Pressable,
  TouchableOpacity,
  Keyboard,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import ActionSheet, {
  SheetManager,
  SheetProps,
} from "react-native-actions-sheet";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { useMemo, useRef } from "react";
import { CreateEventRequest, createEvent } from "~/api/events";
import { useUser } from "@clerk/clerk-expo";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner-native";
import { useForm } from "@tanstack/react-form";
import React from "react";

interface AddEventSheetProps extends SheetProps<"add-event-sheet"> {
  onClose?: () => void;
}

export default function AddEventSheet(props: AddEventSheetProps) {
  const colorScheme = useColorScheme();
  const bgColor = colorScheme === "dark" ? "#212121" : "#e8f4ea";

  const nameInputRef = useRef<TextInput>(null);
  const descriptionInputRef = useRef<TextInput>(null);
  const locationInputRef = useRef<TextInput>(null);

  const { user } = useUser();
  if (!user) {
    return null;
  }
  const userId = user.id;

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

  const addEventForm = useForm({
    defaultValues: {
      name: "",
      description: "",
      location: "",
      color: "#55CBCD", // Default color
      recurrence_rule: "Never",
      start: initialStart,
      end: initialEnd,
      user_id: userId,
    } as CreateEventRequest,
  });

  const { isPending, mutate: saveEvent } = useMutation({
    mutationFn: async () => {
      const token = await props.payload?.getToken();
      if (!token || token === undefined) {
        throw new Error("Unable to get token.");
      }
      await createEvent(addEventForm.state.values, token);
    },

    onSuccess: () => {
      toast.success("Event saved successfully");
      handleCloseSheet();
      if (props.payload?.refetchEvents) {
        props.payload.refetchEvents();
      }
    },
    onError: (error) => {
      toast.error("Failed to save event");
      console.error("Failed to save event:", error);
    },
  });

  const handleCloseSheet = () => {
    if (props.onClose) {
      props.onClose();
    }
    SheetManager.hide("add-event-sheet");
  };

  const handleSaveEvent = () => {
    saveEvent();
  };

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
            {formattedDateTime && (
              <View className="mb-2">
                <Text className="text-xl font-semibold">
                  {formattedDateTime}
                </Text>
              </View>
            )}

            <View className="mb-4">
              {addEventForm.Field({
                name: "name",
                children: (field) => (
                  <TextInput
                    placeholder="event name"
                    value={field.state.value}
                    onChangeText={field.handleChange}
                    className="p-3 font-light text-white border rounded border-input"
                    ref={nameInputRef}
                  />
                ),
              })}
            </View>

            <View className="mb-4">
              <Text className="mb-2 text-base font-semibold">recurrence</Text>
              <View className="flex-row items-center justify-between p-3 border rounded border-input">
                {addEventForm.Field({
                  name: "recurrence_rule",
                  children: (field) => (
                    <>
                      {recurrenceOptions.map((option) => (
                        <Pressable
                          key={option}
                          onPress={() => field.handleChange(option)}
                        >
                          <Text
                            className={`${
                              field.state.value === option
                                ? "text-primary font-semibold"
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
              <Text className="mb-2 text-base font-semibold">event color</Text>
              <View className="flex-row items-center justify-between">
                {addEventForm.Field({
                  name: "color",
                  children: (field) => (
                    <>
                      {colorOptions.map((color) => (
                        <TouchableOpacity
                          key={color}
                          onPress={() => field.handleChange(color)}
                          style={{
                            width: 24,
                            height: 24,
                            backgroundColor: color,
                            borderRadius: 4,
                            borderColor:
                              field.state.value === color
                                ? "white"
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

            <View className="mb-4">
              <Text className="mb-2 text-base font-semibold">
                event description
              </Text>
              {addEventForm.Field({
                name: "description",
                children: (field) => (
                  <TextInput
                    placeholder="Enter description"
                    value={field.state.value}
                    onChangeText={field.handleChange}
                    multiline
                    numberOfLines={3}
                    className="border border-input p-3 rounded min-h-[65px] font-light text-white"
                    ref={descriptionInputRef}
                  />
                ),
              })}
            </View>

            <Text className="mb-4 text-base font-medium">location</Text>
            <View className="mb-4">
              {addEventForm.Field({
                name: "location",
                children: (field) => (
                  <TextInput
                    placeholder="location"
                    value={field.state.value}
                    onChangeText={field.handleChange}
                    className="p-3 font-light text-white border rounded border-input"
                    ref={locationInputRef}
                  />
                ),
              })}
            </View>

            <View className="flex-row justify-end gap-2 mt-4 mb-6">
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
                    <ActivityIndicator size="small" color="white" />
                    <Text className="ml-2 text-white">Saving...</Text>
                  </View>
                ) : (
                  <Text>Save</Text>
                )}
              </Button>
            </View>
          </ScrollView>
        </Pressable>
      </KeyboardAvoidingView>
    </ActionSheet>
  );
}
