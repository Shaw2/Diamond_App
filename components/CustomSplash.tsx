import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSequence,
    withTiming,
    runOnJS,
    FadeIn,
    FadeOut,
} from 'react-native-reanimated';
import { Image } from 'expo-image';

interface CustomSplashProps {
    onFinish: () => void;
}

export default function CustomSplash({ onFinish }: CustomSplashProps) {
    const opacity = useSharedValue(0);

    useEffect(() => {
        opacity.value = withSequence(
            withTiming(1, { duration: 1000 }), // Fade In 1s
            withTiming(1, { duration: 1000 }), // Hold 1s
            withTiming(0, { duration: 1000 }, (finished) => {
                if (finished) {
                    runOnJS(onFinish)();
                }
            })
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
        };
    });

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.imageContainer, animatedStyle]}>
                <Image
                    source={require('../assets/images/pear-shaped-diamond.png')}
                    style={styles.image}
                    contentFit="contain"
                />
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#000000',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999, // Ensure it's on top
    },
    imageContainer: {
        width: 200,
        height: 200,
    },
    image: {
        width: '100%',
        height: '100%',
    },
});
