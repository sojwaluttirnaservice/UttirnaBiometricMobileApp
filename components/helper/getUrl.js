import AsyncStorage from '@react-native-async-storage/async-storage';

const getUrl = async () => {
    // if(localStorage.getImte)

    try {
        const jsonValue = await AsyncStorage.getItem('processUrl');
        let baseUrl = jsonValue != null ? JSON.parse(jsonValue) : null;

        return baseUrl;
    } catch (err) {
        // read error
        console.error(`Error while retrieving the process url: ${err}`);
    }
};

export default getUrl;
