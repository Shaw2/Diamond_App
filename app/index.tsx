import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
    const router = useRouter();

    useEffect(() => {
        // Navigate to the diamond tab immediately
        // Using setImmediate or setTimeout ensures navigation happens after mount
        const timer = setTimeout(() => {
            router.replace('/diamond');
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}>
            <ActivityIndicator size="large" color="#ffffff" />
        </View>
    );
}
