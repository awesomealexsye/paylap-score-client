import { ToastAndroid } from "react-native";


const CommonMessage = (message:string,messageType:string="ERROR",duration=ToastAndroid.SHORT)=>{
    ToastAndroid.show(message,duration)
}


export {CommonMessage};
