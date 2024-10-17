const CONFIG = {
    APP_URL: "https://paynest.co.in",

    HARDCODE_VALUES: {
        USER_ID: 'user_id',
        JWT_TOKEN: 'jwt_token',
        AUTH_KEY: 'auth_key',
        USER_DETAIL: 'user_detail',
        THEME_MODE: {
            THEME_MODE: 'THEME_MODE',
            LIGHT: 'LIGHT',
            DARK: 'DARK'
        },
    },
    CREDIT_SCORE_RANGE: {
        MIN: 0,
        MAX: 100
    },
    APP_BUILD: {
        ANDROID: {
            APP_VERSION: 17,
            APP_VERSION_NAME: '1.0.17',
            APP_URL: "https://play.google.com/store/apps/details?id=com.paylap.paylapscore"
        },
        IOS: {
            APP_VERSION: 17,
            APP_VERSION_NAME: '1.0.17',
            APP_URL: "https://play.google.com/store/apps/details?id=com.paylap.paylapscore"

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