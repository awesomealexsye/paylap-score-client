import AsyncStorage from "@react-native-async-storage/async-storage";
import CONFIG from "../constants/config";

const StorageService = {
  async setStorage(key: string, value: string) {
    await AsyncStorage.setItem(key, value);
  },

  async getStorage(key: string) {
    return await AsyncStorage.getItem(key);
  },

  async removeAllStorageValue(keys: string[]) {
    await AsyncStorage.multiRemove(keys);
  },

  async isLoggedIn() {
    const user_id = await this.getStorage(CONFIG.HARDCODE_VALUES.USER_ID);
    if (user_id != null && user_id != '') {
      return true;
    } else {
      return false;
    }
  },

  async logOut() {
    await this.removeAllStorageValue([CONFIG.HARDCODE_VALUES.USER_ID, CONFIG.HARDCODE_VALUES.AUTH_KEY, CONFIG.HARDCODE_VALUES.JWT_TOKEN, CONFIG.HARDCODE_VALUES.USER_DETAIL, CONFIG.HARDCODE_VALUES.SET_LANGUAGE])
    const is_login = await this.isLoggedIn();
    if (!is_login) {
      return true;
    } else {
      return false;
    }
  },
  async isLanguageSet() {
    return await this.getStorage(CONFIG.HARDCODE_VALUES.SET_LANGUAGE);
  }
};


export default StorageService;
