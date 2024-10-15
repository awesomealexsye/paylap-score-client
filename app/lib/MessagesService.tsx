import { ToastAndroid } from "react-native";
import { Toast } from 'toastify-react-native'



const MessagesService = {
    commonMessage(message: string, messageType: string = "ERROR", duration = ToastAndroid.SHORT) {
        // console.log(message)
        if (messageType === "ERROR") {
            Toast.error(message);
        } else {
            Toast.success(message);
        }
    },
}




export { MessagesService };
