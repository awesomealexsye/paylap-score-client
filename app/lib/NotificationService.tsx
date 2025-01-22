
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { MessagesService } from './MessagesService';
import { ApiService } from './ApiService';


const NotificationService = {
    updateDeviceTokenToServer: async () => {
        const token = await NotificationService.registerForPushNotificationsAsync();
        if (token) {
            const res = await ApiService.postWithToken('api/app-core/update-device-notification-token', { device_token: token })
            // console.log("tokenss", token, "::API CALLED RES:: ", res);
            if (!res.status) {
                MessagesService.commonMessage(res.message, 'ERROR');
            }
        }

    },
    registerForPushNotificationsAsync: async () => {
        let token;

        if (Device.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== 'granted') {
                MessagesService.commonMessage('Failed to get push token for push notification!');
                return;
            }

            token = (await Notifications.getExpoPushTokenAsync()).data;
            // console.log('Expo Push Token:', token);
        } else {
            MessagesService.commonMessage('Must use a physical device for Push Notifications');
        }

        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        return token;
    },
    setNotificationHandler: () => {
        // Configure notifications
        return Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowAlert: true,
                shouldPlaySound: false,
                shouldSetBadge: false,
            }),
        });
    },
    addNotificationListner: () => {
        Notifications.addNotificationReceivedListener(notification => {
            console.log('Notification Received:', notification);
            return notification;
        });

    },
    responseRecievedListner: () => {
        return Notifications.addNotificationResponseReceivedListener(response => {
            console.log('Notification Interaction:', response);
            return response;
        });
    }
}
export default NotificationService