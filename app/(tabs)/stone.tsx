import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet } from 'react-native';
import Gem3D from '@/components/Gem3D';

export default function StoneScreen() {
    return (
        <LinearGradient
            colors={['#000000', '#1a1a1a', '#000000']}
            style={styles.container}
        >
            <Gem3D
                modelAsset={require('@/assets/models/Meshy_AI_Stone.glb')}
                scale={0.5}
                placeholderImage={require('@/assets/images/stone.png')}
            />
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
