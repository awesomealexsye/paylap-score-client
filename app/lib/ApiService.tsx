import axios from 'axios';
import CONFIG from "../constants/config";
import { MessagesService } from './MessagesService';
import StorageService from './StorageService';



const ApiService = {
    async postWithoutToken(uri: string, data: object) {
        let api_url = `${CONFIG.APP_URL}/${uri}`;
        console.log(api_url, data);
        try {
            const res = await axios.post(api_url, data); // Sending POST request

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
    async postWithToken(uri: string, data: object) {
        let api_url = `${CONFIG.APP_URL}/${uri}`;
        let user_id = await StorageService.getStorage(CONFIG.HARDCODE_VALUES.USER_ID);
        let auth_key = await StorageService.getStorage(CONFIG.HARDCODE_VALUES.AUTH_KEY)
        let jwt_token = await StorageService.getStorage(CONFIG.HARDCODE_VALUES.JWT_TOKEN)
        let common_payload = { user_id: Number(user_id), auth_key: auth_key };
        data = { ...common_payload, ...data }
        // console.log(api_url, data, jwt_token);
        try {
            const res = await axios.post(api_url, data, { headers: { Authorization: `Bearer ${jwt_token}` } });
            // console.log(res, "resresres")
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
    }
}



export { ApiService };