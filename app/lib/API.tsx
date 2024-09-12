import axios from 'axios';
import CONFIG from "../constants/config";
import { CommonMessage } from './Messages';

const postWithoutToken = async (uri: string, data: object) => {

    let api_url = `${CONFIG.APP_URL}/${uri}`;
    try {
        const res = await axios.post(api_url, data); // Sending POST request
        if(res.status == 200){
            if(res.data.status == false){
                CommonMessage(res.data.message);
            }else{
                return res.data;
            }
        }else{
            CommonMessage("Something went Wrong");
        }
    } catch (error) {
        CommonMessage("Error sending data");
    }

    return null;
}


export { postWithoutToken };