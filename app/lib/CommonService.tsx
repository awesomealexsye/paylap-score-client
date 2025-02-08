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
    },
    async timeTravelers(date: any) {
        // If date is not a Date instance, attempt to parse it.
        if (!(date instanceof Date)) {
            date = new Date(date);
        }

        const now: any = new Date();
        // Assume the date is in the past. Calculate the difference in milliseconds.
        const diffMs = now - date;

        // Convert difference to minutes, hours, and days.
        const diffInMinutes = Math.floor(diffMs / (1000 * 60));
        const diffInHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) {
            if (diffInHours === 0) {
                if (diffInMinutes < 2) {
                    return 'just now';
                } else if (diffInMinutes === 2) {
                    return '2 minutes ago';
                } else {
                    return diffInMinutes + ' minutes ago';
                }
            } else if (diffInHours === 1) {
                return 'an hour ago';
            } else {
                return diffInHours + ' hours ago';
            }
        } else if (diffInDays === 1) {
            return 'yesterday';
        } else if (diffInDays === 2) {
            return '2 days before';
        } else if (diffInDays <= 14) {
            return diffInDays + ' days before';
        } else if (diffInDays <= 21) {
            return '2 weeks before';
        } else {
            // For dates older than 21 days, return the date formatted as "YYYY-MM-DD"
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        }
    }
}

export default CommonService;