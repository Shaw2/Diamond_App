import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    interpolate,
    Extrapolation,
} from 'react-native-reanimated';
import { Image, ImageSource } from 'expo-image';

interface GemViewerProps {
    imageSource: ImageSource | number;
}

const { width } = Dimensions.get('window');
const IMAGE_SIZE = width * 0.8;

export default function GemViewer({ imageSource }: GemViewerProps) {
    const rotationX = useSharedValue(0);
    const rotationY = useSharedValue(0);

    // Save initial values for continuous rotation
    const savedRotationX = useSharedValue(0);
    const savedRotationY = useSharedValue(0);

    const pan = Gesture.Pan()
        .onUpdate((e) => {
            // Sensitivity factor
            const factor = 0.5;
            rotationX.value = savedRotationX.value - e.translationY * factor;
            rotationY.value = savedRotationY.value + e.translationX * factor;
        })
        .onEnd(() => {
            savedRotationX.value = rotationX.value;
            savedRotationY.value = rotationY.value;
            // Optional: Spring back to front
            // rotationX.value = withSpring(0);
            // rotationY.value = withSpring(0);
        });

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { perspective: 1000 },
                { rotateX: `${rotationX.value}deg` },
                { rotateY: `${rotationY.value}deg` },
            ],
        };
    });

    return (
        <GestureDetector gesture={pan}>
            <Animated.View style={[styles.container, animatedStyle]}>
                <Image
                    source={imageSource}
                    style={styles.image}
                    contentFit="contain"
                    cachePolicy="memory-disk"
                    // @ts-ignore
                    draggable={false}
                />
            </Animated.View>
        </GestureDetector>
    );
}

const styles = StyleSheet.create({
    container: {
        width: IMAGE_SIZE,
        height: IMAGE_SIZE,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
    },
});
