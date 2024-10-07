import axios from 'axios';
import CONFIG from "../constants/config";
import { MessagesService } from './MessagesService';
import StorageService from './StorageService';
import { ApiService } from './ApiService';



const CommonService = {
    async getAppSettings(keyList: string[]) {
        return await ApiService.postWithoutToken("api/fetch-settings", { setting_key: keyList });
    },
    // async storageUserDetail() {
    //     const res = await ApiService.postWithToken("api/user/info", {});
    //     if (res.data) {
    //         await StorageService.setStorage(CONFIG.HARDCODE_VALUES.USER_DETAIL, JSON.stringify(res.data));
    //     } else {
    //         MessagesService.commonMessage("Failed to get data from User Api");
    //     }
    // },
    // async currentUserDetail() {
    //     let storageData: any = await StorageService.getStorage(CONFIG.HARDCODE_VALUES.USER_DETAIL);
    //     if (storageData != null) {
    //         return JSON.parse(storageData);
    //     } else {
    //         const res = await ApiService.postWithToken("api/user/info", {});
    //         if (res.data) {
    //             await StorageService.setStorage(CONFIG.HARDCODE_VALUES.USER_DETAIL, JSON.stringify(res.data));
    //             return res.data;
    //         } else {
    //             MessagesService.commonMessage("Failed to get data from User Api");
    //         }
    //     }
    //     return {};
    // }
    async currentUserDetail() {

        const res = await ApiService.postWithToken("api/user/info", {});
        if (res.data) {
            // await StorageService.setStorage(CONFIG.HARDCODE_VALUES.USER_DETAIL, JSON.stringify(res.data));
            return res.data;
        } else {
            MessagesService.commonMessage("Failed to get data from User Api");
        }

        return {};
    }
}

export default CommonService;