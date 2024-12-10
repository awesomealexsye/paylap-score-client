import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization'; // expo-localization

import en from './locales/en.json';
import pa from './locales/pa.json';
import ta from './locales/ta.json';
import hi from './locales/hi.json';

const resources = {
    en: { translation: en },
    hi: { translation: hi },
    pa: { translation: pa },
    ta: { translation: ta },
};

const languageDetector: any = {
    type: 'languageDetector',
    async: true,
    detect: (callback: (language: string) => void) => {
        const bestLanguage = Localization.locale; // Use the current locale from Expo
        // const bestLanguage = "hi";
        callback(bestLanguage || 'en'); // Fallback to 'en' if no locale found
    },
    init: () => { },
    cacheUserLanguage: () => { },
};

i18n
    .use(languageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'en',
        resources,
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
