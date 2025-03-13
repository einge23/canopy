import React, { useEffect } from "react";
import { Animated, View, useColorScheme, StyleSheet } from "react-native";
import { Card, CardContent } from "~/components/ui/card";
import type { DimensionValue } from "react-native";

// Define props interface for SkeletonItem with correct type
interface SkeletonItemProps {
    width: DimensionValue;
    height: number;
    marginTop?: number;
    marginLeft?: number;
}

export default function EventCardSkeleton() {
    const colorScheme = useColorScheme();
    const shimmerValue = new Animated.Value(0);

    // Colors based on theme
    const backgroundColor = colorScheme === "dark" ? "#3d3d3d" : "#c8e1cc";
    const shimmerColor =
        colorScheme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)";
    const highlightColor =
        colorScheme === "dark"
            ? "rgba(255,255,255,0.1)"
            : "rgba(255,255,255,0.5)";

    useEffect(() => {
        const startShimmerAnimation = () => {
            Animated.loop(
                Animated.timing(shimmerValue, {
                    toValue: 1,
                    duration: 1500,
                    useNativeDriver: true,
                })
            ).start();
        };

        startShimmerAnimation();

        return () => {
            shimmerValue.setValue(0);
        };
    }, []);

    const getAnimatedStyle = () => {
        const translateX = shimmerValue.interpolate({
            inputRange: [0, 1],
            outputRange: [-300, 300],
        });

        return {
            transform: [{ translateX }],
            backgroundColor: highlightColor,
        };
    };

    // Fixed type issues by using StyleSheet.create
    const SkeletonItem = ({
        width,
        height,
        marginTop = 0,
        marginLeft = 0,
    }: SkeletonItemProps) => (
        <View
            style={{
                width,
                height,
                backgroundColor,
                borderRadius: 4,
                overflow: "hidden",
                marginTop,
                marginLeft,
            }}
        >
            <Animated.View
                style={{
                    width: "100%",
                    height: "100%",
                    ...getAnimatedStyle(),
                }}
            />
        </View>
    );

    return (
        <Card className="h-full overflow-hidden  bg-muted/20">
            <CardContent className="p-1 flex-row items-center">
                <View className="flex-1">
                    <View className="flex-row items-center">
                        <SkeletonItem width="50%" height={10} />

                        <View className="flex-row items-center ml-4">
                            <SkeletonItem width={8} height={8} />
                            <SkeletonItem
                                width={60}
                                height={8}
                                marginLeft={4}
                            />
                        </View>
                    </View>

                    <View>
                        <SkeletonItem width="100%" height={8} marginTop={8} />
                        <SkeletonItem width="75%" height={8} marginTop={4} />
                    </View>
                </View>
            </CardContent>
        </Card>
    );
}
