import axios from 'axios';
import CONFIG from "../constants/config";
import { MessagesService } from './MessagesService';



const ApiService = {
    async postWithoutToken  (uri: string, data: object){
        let api_url = `${CONFIG.APP_URL}/${uri}`;
        try {
            const res = await axios.post(api_url, data); // Sending POST request
    
            if(res.status == 200){
                if(res.data.status == false){
                    MessagesService.commonMessage(res.data.message);
                }else{
                    return res.data;
                }
            }else{
                MessagesService.commonMessage(`Something went Wrong, Status:${res.status}`);
            }
        } catch (error) {
            MessagesService.commonMessage("Internal Server Error");
        }
        return null;
    }
}



export { ApiService };