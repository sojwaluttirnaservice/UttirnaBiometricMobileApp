import Toast from 'react-native-toast-message';

// Define font size variables globally
const FONT_SIZE_TITLE = 30;
const FONT_SIZE_MESSAGE = 20;

// Define each toast method separately
const successToast = ({ title = 'Success', message = 'Operation was successful!' }) => {
    Toast.show({
        type: 'success',
        text1: title,
        text2: message,
        visibilityTime: 3000, // Duration of the toast
        props: {
            titleFontSize: FONT_SIZE_TITLE,
            messageFontSize: FONT_SIZE_MESSAGE,
        },
    });
};

const errorToast = ({ title = 'Error', message = 'Something went wrong!' }) => {
    Toast.show({
        type: 'error',
        text1: title,
        text2: message,
        visibilityTime: 3000,
        props: {
            titleFontSize: FONT_SIZE_TITLE,
            messageFontSize: FONT_SIZE_MESSAGE,
        },
    });
};

const warningToast = ({ title = 'Warning', message = 'This is a warning!' }) => {
    Toast.show({
        type: 'warning',
        text1: title,
        text2: message,
        visibilityTime: 3000,
        props: {
            titleFontSize: FONT_SIZE_TITLE,
            messageFontSize: FONT_SIZE_MESSAGE,
        },
    });
};

// Export all methods
export { successToast, errorToast, warningToast };
