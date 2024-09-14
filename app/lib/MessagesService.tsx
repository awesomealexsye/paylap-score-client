import { ToastAndroid } from "react-native";



const MessagesService = {
    commonMessage(message: string, messageType: string = "ERROR", duration = ToastAndroid.SHORT) {
        ToastAndroid.show(message, duration)
    },
}




export { MessagesService };
