import axios from 'axios';
import CONFIG from "../constants/config";
import { CommonMessage } from './Messages';

const postWithoutToken = async (uri: string, data: object) => {

    let api_url = `${CONFIG.APP_URL}/${uri}`;
    console.log('checking',api_url,data)
    try {
        const res = await axios.post(api_url, data); // Sending POST request
        console.log('ress',res)

        if(res.status == 200){
            if(res.data.status == false){
                CommonMessage(res.data.message);
            }else{
                return res.data;
            }
        }else{
            CommonMessage(`Something went Wrong, Status:${res.status}`);
        }
    } catch (error) {
        CommonMessage("Internal Server Error");
    }

    return null;
}


export { postWithoutToken };