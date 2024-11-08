import axios from 'axios';
import CONFIG from "../constants/config";
import { MessagesService } from './MessagesService';
import StorageService from './StorageService';
import { ApiService } from './ApiService';



const CommonService = {
    async getAppSettings(keyList: string[]) {
        return await ApiService.postWithoutToken("api/fetch-settings", { setting_key: keyList });
    },

    async getAppUploadDetail() {
        let res = await this.getAppSettings(["APP_RELEASE_INFO"]);
        if (res?.status) {
            let appInfo = res.data.value ? JSON.parse(res.data.value) : {};
            return appInfo;
        }


    },

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