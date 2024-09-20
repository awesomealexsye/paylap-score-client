import axios from 'axios';
import CONFIG from "../constants/config";
import { MessagesService } from './MessagesService';
import StorageService from './StorageService';
import { ApiService } from './ApiService';



const CommonService = {
    getAppThemeApi() {
        ApiService.postWithToken("api/fetch-settings", { setting_key: ["APP_NAME", "APP_THEME_CUSTOMIZATION"] }).then((res) => {
            console.log("APP theme API calling..");
            let app_theme = res?.data;
            let APP_THEME_CUSTOMIZATION = app_theme.APP_THEME_CUSTOMIZATION;
            StorageService.setStorage("APP_THEME_CUSTOMIZATION", APP_THEME_CUSTOMIZATION);
        })
    },
    async handleAppTheme(keyItem: string) {
        const APP_THEME_CUSTOMIZATION: any = await StorageService.getStorage("APP_THEME_CUSTOMIZATION");
        const APP_THEME_CUSTOMIZATION_obj = JSON.parse(APP_THEME_CUSTOMIZATION);
        return APP_THEME_CUSTOMIZATION_obj[keyItem];

    },
    async storageUserDetail() {
        const res = await ApiService.postWithToken("api/user/info", {});
        if (res.data) {
            await StorageService.setStorage(CONFIG.HARDCODE_VALUES.USER_DETAIL, JSON.stringify(res.data));
        } else {
            MessagesService.commonMessage("Failed to get data from User Api");
        }
    },
    async currentUserDetail() {
        let storageData: any = await StorageService.getStorage(CONFIG.HARDCODE_VALUES.USER_DETAIL);
        if (storageData != null) {
            return JSON.parse(storageData);
        } else {
            const res = await ApiService.postWithToken("api/user/info", {});
            if (res.data) {
                await StorageService.setStorage(CONFIG.HARDCODE_VALUES.USER_DETAIL, JSON.stringify(res.data));
                return res.data;
            } else {
                MessagesService.commonMessage("Failed to get data from User Api");
            }
        }
        return {};
    }
}

export default CommonService;