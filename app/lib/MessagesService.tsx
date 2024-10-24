import Toast from 'react-native-toast-message';
import { StyleSheet } from 'react-native';

type MessageType = "ERROR" | "SUCCESS";

const MessagesService = {
    commonMessage(message: string, messageType: MessageType = "ERROR", duration = 2000) {
        const toastStyle = messageType === "ERROR" ? styles.error : styles.success;

        Toast.show({
            text1: messageType === "ERROR" ? 'Error' : 'Success', // Title
            text2: message, // Message
            type: messageType.toLowerCase(), // Type of toast
            position: 'top', // Position set to 'top'
            visibilityTime: duration, // Duration in milliseconds
        });
    },
};

const styles = StyleSheet.create({
    success: {
        backgroundColor: 'green',
        marginTop: 50, // Set margin top for the toast
        padding: 15, // Optional: adjust padding
        borderRadius: 5, // Optional: round corners
    },
    error: {
        backgroundColor: 'red',
        marginTop: 50, // Set margin top for the toast
        padding: 15, // Optional: adjust padding
        borderRadius: 5, // Optional: round corners
    },
});

export { MessagesService };
