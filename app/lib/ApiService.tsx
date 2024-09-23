import axios from 'axios';
import CONFIG from "../constants/config";
import { MessagesService } from './MessagesService';
import StorageService from './StorageService';



const ApiService = {
    async postWithoutToken(uri: string, data: object) {
        let api_url = `${CONFIG.APP_URL}/${uri}`;
        // console.log(api_url, data);
        try {
            const res = await axios.post(api_url, data); // Sending POST request
            // console.log(api_url, data, res, "ress");

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
        let auth_key = await StorageService.getStorage(CONFIG.HARDCODE_VALUES.AUTH_KEY)
        let jwt_token = await StorageService.getStorage(CONFIG.HARDCODE_VALUES.JWT_TOKEN)
        let common_payload = { user_id: Number(user_id), auth_key: auth_key };
        let authHeader = { Authorization: `Bearer ${jwt_token}` };
        data = { ...common_payload, ...data }
        headers = { ...authHeader, ...headers }
        // console.log("consoleloo", api_url, data, headers);
        try {
            const res = await axios.post(api_url, data, { headers: headers });
            //console.log(res, "resresres")
            // console.log("api pay and res", api_url, data, headers, res.data, res.status);

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
            MessagesService.commonMessage("Internal Server Error");
        }
        return null;
    }
}



export { ApiService };