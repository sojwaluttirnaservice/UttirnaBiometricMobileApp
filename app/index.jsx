import { Text, View, TextInput, StyleSheet, TouchableOpacity, ToastAndroid } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import RNPickerSelect from 'react-native-picker-select';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

import { errorToast, successToast } from '../components/helper/toasts/Toasts';

export const uttirnaUrl = `https://uttirna.in`;

const HomePage = () => {
    const [processList, setProcessList] = useState([
        {
            process_name: 'Loading...',
            process_url: '',
        },
    ]);

    useEffect(() => {
        (async function () {
            const { data } = await axios.get(`${uttirnaUrl}/api/get-process-list`);

            const _processList = JSON.parse(data.data);

            console.log(_processList);
            setProcessList(_processList);
        })();
    }, []);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            username: 'test', // Set the dummy username
            password: 'test', // Set the dummy password
            processUrl: '',
        },
    });

    const onSubmit = async (userData) => {
        try {
            const { processUrl, username, password } = userData;

            const userDataWithRole = { ...userData, role: 2 };
            let url = `${processUrl}/api/login`;
            const { data } = await axios.post(url, userDataWithRole);

            const { success } = data;

            if (success) {
                router.push('/qr/scan');
                successToast({ title: 'Login', message: 'Logged in successfully' });
                await AsyncStorage.setItem('processUrl', JSON.stringify(processUrl));
            } else {
                // TODO:
                errorToast({ title: 'Error', message: 'Something went wrong' });
            }
        } catch (err) {
            console.log(err);
            if (err.response) {
                const message = err.response.data.errMsg || 'Something went wrong';
                errorToast({ title: 'Error', message });
            } else {
                const message = 'Something went wrong';
                errorToast({ title: 'Error', message });
            }
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Welcome...</Text>
            <Text style={styles.subHeader}>Login Form</Text>
            <Controller
                control={control}
                name="processUrl"
                rules={{ required: 'Process selection is required' }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <View style={styles.inputContainer}>
                        <RNPickerSelect
                            style={{
                                inputAndroid: {
                                    borderColor: '#ccc', // Set border color to match the input fields
                                    borderWidth: 1, // Set border width to match
                                    borderRadius: 6, // Same border radius as inputs
                                    height: 50, // Same height as TextInput
                                    paddingLeft: 12, // Same padding as TextInput
                                    fontSize: 16, // Same font size as TextInput
                                    backgroundColor: '#fff', // Ensure background is white
                                },
                                inputIOS: {
                                    borderColor: '#ccc', // Set border color to match the input fields
                                    borderWidth: 1, // Set border width to match
                                    borderRadius: 6, // Same border radius as inputs
                                    height: 50, // Same height as TextInput
                                    paddingLeft: 12, // Same padding as TextInput
                                    fontSize: 16, // Same font size as TextInput
                                    backgroundColor: '#fff', // Ensure background is white
                                },
                            }}
                            onBlur={onBlur}
                            onValueChange={(value) => onChange(value)} // handle change
                            value={value}
                            placeholder={{
                                label: 'Select Process',
                                value: null,
                            }}
                            items={processList.map((process) => ({
                                label: process.process_name, // Process name as label
                                value: process.process_url, // Process URL as value
                            }))}
                        />
                        {errors.processUrl && (
                            <Text style={styles.error}>{errors.processUrl.message}</Text>
                        )}
                    </View>
                )}
            />

            <Controller
                control={control}
                name="username"
                rules={{ required: 'Username is required' }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Username"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                        {errors.username && (
                            <Text style={styles.error}>{errors.username.message}</Text>
                        )}
                    </View>
                )}
            />

            <Controller
                control={control}
                name="password"
                rules={{ required: 'Password is required' }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            secureTextEntry
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                        {errors.password && (
                            <Text style={styles.error}>{errors.password.message}</Text>
                        )}
                    </View>
                )}
            />

            <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
        </View>
    );
};

export default HomePage;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
        textAlign: 'center',
    },
    subHeader: {
        fontSize: 18,
        fontWeight: '400',
        color: '#555',
        marginBottom: 24,
        textAlign: 'center',
    },
    inputContainer: {
        width: '100%',
        marginBottom: 16,
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        paddingLeft: 12,
        borderRadius: 6,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    error: {
        color: '#ff4d4d',
        fontSize: 12,
        marginTop: 4,
    },
    button: {
        width: '100%',
        backgroundColor: '#3b82f6',
        paddingVertical: 14,
        borderRadius: 6,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
});
