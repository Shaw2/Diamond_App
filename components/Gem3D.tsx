import React, { useRef, useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { Asset } from 'expo-asset';
import * as SplashScreen from 'expo-splash-screen';
import { Image } from 'expo-image';


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
    const [modelUri, setModelUri] = useState<string | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [startRendering, setStartRendering] = useState(false);

    // 1. Preload the Asset (Critical for Production)
    useEffect(() => {
        let isMounted = true;

        async function loadAsset() {
            try {
                const asset = Asset.fromModule(modelAsset);
                await asset.downloadAsync();

                if (isMounted && (asset.localUri || asset.uri)) {
                    // Prefer localUri (file://) for native loaders in production
                    setModelUri(asset.localUri || asset.uri);
                }
            } catch (error) {
                console.error("Failed to load 3D model asset:", error);
                // Even if 3D fails, we should let the image display (handled by !startRendering fallback)
            }
        }

        loadAsset();
        return () => { isMounted = false; };
    }, [modelAsset]);

    // 2. Splash Screen Safety Timer
    useEffect(() => {
        if (isFirstTab) {
            const safetyTimer = setTimeout(async () => {
                await SplashScreen.hideAsync();
            }, 3000);
            return () => clearTimeout(safetyTimer);
        }
    }, [isFirstTab]);

    const handleImageLoad = async () => {
        // Image is ready, hide splash
        if (isFirstTab) {
            await SplashScreen.hideAsync();
        }

        // Start 3D Rendering ONLY if model URI is ready
        // Delay ensures heavy GL context doesn't fight with Splash transition
        setTimeout(() => {
            requestAnimationFrame(() => {
                setStartRendering(true);
            });
        }, 500);
    };

    // Fallback: If no placeholder image, trigger start safely
    useEffect(() => {
        if (!placeholderImage) {
            if (isFirstTab) SplashScreen.hideAsync();
            setTimeout(() => {
                setStartRendering(true);
            }, 500);
        }
    }, [placeholderImage, isFirstTab]);

    return (
        <View style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center' }}>
            {startRendering && modelUri && (
                <Canvas camera={{ position: [0, 0, 4], fov: 45 }} style={{ width: '100%', height: '100%' }}>
                    <ambientLight intensity={1.5} />
                    <directionalLight position={[5, 10, 5]} intensity={2} />
                    <directionalLight position={[-5, -10, -5]} intensity={1} />

                    <React.Suspense fallback={null}>
                        <Model
                            uri={modelUri}
                            scale={scale}
                            onLoad={() => setIsLoaded(true)}
                        />
                    </React.Suspense>

                    <OrbitControls minDistance={2} maxDistance={10} enablePan={false} />
                </Canvas>
            )}

            {!isLoaded && (
                <View style={styles.loadingOverlay}>
                    {placeholderImage && (
                        <Image
                            source={placeholderImage}
                            style={[
                                styles.placeholderImage,
                                isFirstTab && { opacity: 1, width: '100%', height: '100%' }
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
