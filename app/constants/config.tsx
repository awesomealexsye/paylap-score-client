const CONFIG = {
    APP_URL: "https://paynest.co.in",

    HARDCODE_VALUES: {
        USER_ID: 'user_id',
        JWT_TOKEN: 'jwt_token',
        AUTH_KEY: 'auth_key',
        USER_DETAIL: 'user_detail',
        INVOICE_COMPANY: {
            id: 'invoice_company_id',
            name: 'invoice_company_name'
        },
        INVOICE_GEN_SESSION: {
            ORGANIZATION_INFO: 'organization_info',
            CLIENT_INFO: 'client_info',
            ITEM_INFO: 'item_info',
        },

        THEME_MODE: {
            THEME_MODE: 'THEME_MODE',
            LIGHT: 'LIGHT',
            DARK: 'DARK'
        },
        SET_LANGUAGE: 'SET_LANGUAGE',
        REFFERAL_CODE: 'referralCode'
    },
    CREDIT_SCORE_RANGE: {
        MIN: 300,
        MAX: 900
    },
    APP_BUILD: {
        ANDROID: {
            APP_VERSION: 46,
            APP_VERSION_NAME: '1.0.46',
            APP_URL: "https://play.google.com/store/apps/details?id=com.paylap.paylapscore"
        },
        IOS: {
            APP_VERSION: 46,
            APP_VERSION_NAME: '1.0.46',
            APP_URL: "https://apps.apple.com/us/app/paylap-score/id6736965791"
        }
    },

    CREDIT_SCORE_LABEL: [
        {
            name: 'Very Poor',
            labelColor: '#ff2900',
            activeBarColor: '#ff2900',
        },
        {
            name: 'Poor',
            labelColor: '#ff5400',
            activeBarColor: '#ff5400',
        },
        {
            name: 'Good',
            labelColor: '#f4ab44',
            activeBarColor: '#f4ab44',
        },
        {
            name: 'Very Good',
            labelColor: '#f2cf1f',
            activeBarColor: '#f2cf1f',
        },
        {
            name: 'Excellent',
            labelColor: '#14eb6e',
            activeBarColor: '#14eb6e',
        },
    ]
}



export default CONFIG;