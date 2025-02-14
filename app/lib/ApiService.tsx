import axios from 'axios';
import CONFIG from "../constants/config";
import { MessagesService } from './MessagesService';
import StorageService from './StorageService';
import CommonService from './CommonService';



const ApiService = {

    async postWithoutToken(uri: string, data: object) {
        let api_url = `${CONFIG.APP_URL}/${uri}`;
        // console.log(api_url, data);
        try {
            const res: any = await axios.post(api_url, data); // Sending POST request
            // console.log(res.json(), "ress");
            if (res?.logout_user === true) {
                const is_logout = await StorageService.logOut();
                if (is_logout) {
                    return;
                }
            }
            if (res.status == 200) {
                if (res.data.status == false) {
                    MessagesService.commonMessage(res.data.message);
                } else {
                    return res.data;
                }
            } else {
                MessagesService.commonMessage(`Something went Wrong, Status:${res.status}`);
            }
        } catch (error) {
            MessagesService.commonMessage("Internal Server Error");
        }
        return null;
    },
    async postWithToken(uri: string, data: object, headers: object = {}) {
        let api_url = `${CONFIG.APP_URL}/${uri}`;
        let user_id = await StorageService.getStorage(CONFIG.HARDCODE_VALUES.USER_ID);
        // let user_id = "1";
        let auth_key = await StorageService.getStorage(CONFIG.HARDCODE_VALUES.AUTH_KEY)
        let jwt_token = await StorageService.getStorage(CONFIG.HARDCODE_VALUES.JWT_TOKEN)
        let common_payload = { user_id: Number(user_id), auth_key: auth_key };
        let authHeader = { Authorization: `Bearer ${jwt_token}` };
        data = { ...common_payload, ...data }
        headers = { ...authHeader, ...headers }
        console.log("Log ", api_url, headers, data);
        try {
            const res: any = await axios.post(api_url, data, { headers: headers });
            if (res.data.logout_user === true) {
                const is_logout = await StorageService.logOut();
                if (is_logout) {
                    return;
                }
            }
            console.log(res.data)
            if (res.status == 200) {
                if (res.data.status == false) {
                    if (res.data.message && typeof res.data.message === 'object') {
                        let errorMessage = '';
                        for (const key in res.data.message) {
                            errorMessage += `${key} ${res.data.message[key].join(', ')}. `;
                        }
                        MessagesService.commonMessage(errorMessage);
                    } else {
                        MessagesService.commonMessage(res.data.message);
                    }
                } else {
                    return res.data;
                }
            } else {
                MessagesService.commonMessage(`Something went Wrong, Status:${res.status}`);
            }
        } catch (error) {
            console.log("Request body ", error);

            MessagesService.commonMessage("Internal Server Error");
        }
        return { status: false, message: "Somthing went Wrong", "app_message": true };
    }
}



export { ApiService };