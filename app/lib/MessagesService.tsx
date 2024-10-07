import { ToastAndroid } from "react-native";



const MessagesService = {
    commonMessage(message: string, messageType: string = "ERROR", duration = ToastAndroid.SHORT) {
        // console.log(message)
        ToastAndroid.show(message, duration)
    },
}




export { MessagesService };
