import { Stack } from 'expo-router';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar, StyleSheet, Platform } from 'react-native';
import Toast from 'react-native-toast-message';

const RootLayout = () => {
    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.safeAreaContainer}>
                <StatusBar 
                    barStyle={Platform.OS === 'ios' ? "dark-content" : "light-content"} 
                    backgroundColor="transparent"
                    translucent={true} 
                />

                <Stack
                    screenOptions={{
                        headerShown: false,
                        animation: 'slide_from_right',
                    }}
                >
                    <Stack.Screen name="index" />
                    <Stack.Screen name="qr/scan" />
                    <Stack.Screen name="candidate/info" />
                </Stack>
            </SafeAreaView>
            
            {/* Move Toast outside SafeAreaView but inside SafeAreaProvider */}
            {Platform.OS !== 'web' && <Toast />}
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    safeAreaContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF', // Add a background color
    },
});

export default RootLayout;
