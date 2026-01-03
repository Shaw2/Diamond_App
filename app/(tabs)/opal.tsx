import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet } from 'react-native';
import Gem3D from '@/components/Gem3D';

export default function OpalScreen() {
    return (
        <LinearGradient
            colors={['#000000ff', '#000000ff', '#000000ff', '#000000ff', '#ffffffff']}
            style={styles.container}
        >
            <Gem3D
                modelAsset={require('@/assets/models/Meshy_AI_opal.glb')}
                scale={0.5}
                placeholderImage={require('@/assets/images/opal.png')}
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
