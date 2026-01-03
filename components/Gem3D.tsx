import React, { useRef, useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';
import { Asset } from 'expo-asset';
import * as SplashScreen from 'expo-splash-screen';
import { Image } from 'expo-image';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from 'react-native-reanimated';

interface Gem3DProps {
    modelAsset: any;
    scale?: number;
    placeholderImage?: any;
    isFirstTab?: boolean; // Only true for Diamond
}

function Model({ uri, scale = 1, onLoad }: { uri: string, scale?: number, onLoad?: () => void }) {
    const { scene } = useGLTF(uri);
    const meshRef = useRef<any>(null);

    useEffect(() => {
        if (onLoad) onLoad();
    }, [onLoad]);

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.1;
        }
    });

    return <primitive ref={meshRef} object={scene} scale={scale} />;
}

export default function Gem3D({ modelAsset, scale = 1, placeholderImage, isFirstTab = false }: Gem3DProps) {
    const asset = Asset.fromModule(modelAsset);
    const [isLoaded, setIsLoaded] = useState(false);
    const [startRendering, setStartRendering] = useState(false);

    useEffect(() => {
        // Safety net: Hide splash after 3 seconds if image fails to load
        if (isFirstTab) {
            const safetyTimer = setTimeout(async () => {
                await SplashScreen.hideAsync();
            }, 3000);
            return () => clearTimeout(safetyTimer);
        }
    }, [isFirstTab]);

    const handleImageLoad = async () => {
        // 1. Image is ready (onLoad fired)
        // 2. Hide Splash Screen (Reveal Image)
        if (isFirstTab) {
            await SplashScreen.hideAsync();
        }

        // 3. Start 3D Rendering (after a frame to ensure paint)
        requestAnimationFrame(() => {
            setStartRendering(true);
        });
    };

    // Fallback: If no placeholder image, trigger start immediately
    useEffect(() => {
        if (!placeholderImage) {
            if (isFirstTab) SplashScreen.hideAsync();
            setStartRendering(true);
        }
    }, [placeholderImage, isFirstTab]);

    return (
        <View style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center' }}>
            {startRendering && (
                <Canvas camera={{ position: [0, 0, 4], fov: 45 }} style={{ width: '100%', height: '100%' }}>
                    <ambientLight intensity={1.5} />
                    <directionalLight position={[5, 10, 5]} intensity={2} />
                    <directionalLight position={[-5, -10, -5]} intensity={1} />

                    <React.Suspense fallback={null}>
                        <Model
                            uri={asset.uri || ''}
                            scale={scale}
                            onLoad={() => setIsLoaded(true)}
                        />
                    </React.Suspense>

                    <OrbitControls
                        minDistance={2}
                        maxDistance={10}
                        enablePan={false}
                    />
                </Canvas>
            )}

            {!isLoaded && (
                <View style={styles.loadingOverlay}>
                    {placeholderImage && (
                        <Image
                            source={placeholderImage}
                            style={[
                                styles.placeholderImage,
                                isFirstTab && { opacity: 1, width: '100%', height: '100%' } // Full screen for splash
                            ]}
                            contentFit={isFirstTab ? 'cover' : 'contain'}
                            onLoad={handleImageLoad}
                        />
                    )}
                    {!isFirstTab && (
                        <ActivityIndicator size="large" color="#ffffff" style={styles.spinner} />
                    )}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black', // Match background
    },
    placeholderImage: {
        width: 200,
        height: 200,
        opacity: 0.5,
    },
    spinner: {
        position: 'absolute',
    },
});
