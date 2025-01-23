import { Stack } from 'expo-router';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';

const RootLayout = () => {
    return (
        <>
            <SafeAreaProvider>
                <SafeAreaView style={styles.safeAreaContainer}>
                    {/* Configuring the StatusBar */}
                    {/* <StatusBar barStyle="dark-content" translucent={false} /> */}
                    <StatusBar barStyle="dark" translucent={false} />

                    <Stack>
                        <Stack.Screen name="index" options={{ headerShown: false }} />
                        <Stack.Screen name="qr/scan" options={{ headerShown: false }} />
                        <Stack.Screen name="candidate/info" options={{ headerShown: false }} />
                    </Stack>
                </SafeAreaView>
            </SafeAreaProvider>

            <Toast />
        </>
    );
};

const styles = StyleSheet.create({
    safeAreaContainer: {
        flex: 1,
    },
});

export default RootLayout;
