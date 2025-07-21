import { LinearGradient } from 'expo-linear-gradient'; // 수정된 부분
import React from 'react';
import { Dimensions, Image, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <LinearGradient
      colors={['#52fd03ce', '#a929c9ff', '#aa0606ff']} // 검은색 그라데이션
      style={styles.container}
    >
      <Image source={require('@/assets/images/diamond.png')} style={styles.image} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: Dimensions.get('window').width * 1,
    height: Dimensions.get('window').width * 1,
    resizeMode: 'contain',
  },
});