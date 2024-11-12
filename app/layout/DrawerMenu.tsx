import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Modal, StyleSheet, Linking, Platform, Alert } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import { IMAGES } from '../constants/Images';
import { COLORS, FONTS } from '../constants/theme';
import { Feather } from '@expo/vector-icons';
import ThemeBtn from '../components/ThemeBtn';
import { useDispatch } from 'react-redux';
import { closeDrawer } from '../redux/actions/drawerAction';
import { GlobalStyleSheet } from '../constants/StyleSheet';
import StorageService from '../lib/StorageService';
import CommonService from '../lib/CommonService';
import ButtonIcon from '../components/Button/ButtonIcon';
import Constants from 'expo-constants';
import CONFIG from '../constants/config';

const MenuItems = [
    {
        id: "1",
        icon: IMAGES.home,
        name: "Home",
        navigate: "Home",
    },

    {
        id: "2",
        icon: IMAGES.folder,
        name: "Ledger book",
        navigate: 'LedgerMain',
    },
    {
        id: "3",
        icon: IMAGES.help,
        name: "Support",
        navigate: 'CustomerSupport',
    },
    {
        id: "4",
        icon: IMAGES.termandCondition,
        name: "Our Policy",
        navigate: 'TermsAndConditionsScreen',
    },

    {
        id: "5",
        icon: IMAGES.share,
        name: "Share",
        navigate: "ShareApp",
    },
    {
        id: "6",
        icon: IMAGES.logout,
        name: "Logout",
        navigate: 'MobileSignIn',
    },
];

const { OS } = Platform;
type AppConfig = {
    ANDROID: {
        IS_MANDATORY: boolean;
        VERSION_CODE: number;
        VERSION_NAME: string;
        VERSION_MESSAGE: string
    },
    IOS: {
        IS_MANDATORY: boolean;
        VERSION_CODE: number;
        VERSION_NAME: string;
        VERSION_MESSAGE: string
    }
};

interface InstalledAppBuild {
    APP_VERSION: number;
    APP_VERSION_NAME: string;
}
const DrawerMenu = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const navigation = useNavigation<any>();

    const [active, setactive] = useState(MenuItems[0]);
    const [appInfo, setAppInfo] = useState<AppConfig>({
        ANDROID: {
            IS_MANDATORY: false,
            VERSION_CODE: 0,
            VERSION_NAME: '1.0.0',
            VERSION_MESSAGE: 'A Default Update Message'
        },
        IOS: {
            IS_MANDATORY: false,
            VERSION_CODE: 0,
            VERSION_NAME: '1.0.0',
            VERSION_MESSAGE: 'A Default Update Message'
        }
    });
    const APP_URL: string = OS == 'ios' ? CONFIG.APP_BUILD.IOS.APP_URL : CONFIG.APP_BUILD.ANDROID.APP_URL;
    const [modalVisible, setModalVisible] = useState(false);
    // const installedAndroidVersionCode: any = Constants?.expoConfig?.android?.versionCode; // Version code (e.g., "10")
    // const installedAndroidVersionName: any = Constants?.expoConfig?.android?.versionName; // Version code (e.g., "10")
    const [installedAppBuild, setInstalledAppBuild] = useState<InstalledAppBuild>({ APP_VERSION: 0, APP_VERSION_NAME: '' });
    useEffect(() => {
        getAppversion();
    }, []);

    // useEffect(() => {
    //     if (appInfo.ANDROID.VERSION_CODE > installedAndroidVersionCode) {
    //         setModalVisible(true);
    //     } else {
    //         setModalVisible(false);
    //     }
    // }, [appInfo]);

    const handleLogout = async () => {
        Alert.alert(
            "Confirmation",
            "Are you sure you want to log out of your account?",
            [
                {
                    text: "No",
                    style: "cancel",
                    onPress: () => console.log("Cancelled"),
                },
                {
                    text: "Yes",
                    onPress: async () => {
                        const is_logout = await StorageService.logOut();
                        if (is_logout) {
                            navigation.navigate("MobileSignIn");
                        }
                    },
                },
            ]
        );
    };

    const handleCibilFunc = async () => {
        let user_id = await StorageService.getStorage(CONFIG.HARDCODE_VALUES.USER_ID);
        navigation.navigate("CustomerScore", { customer: { id: user_id } });
    }

    const getAppversion = () => {
        CommonService.getAppUploadDetail().then((res) => {
            // console.log(res, typeof (res), res.ANDROID.VERSION_CODE)
            let app_build: InstalledAppBuild;
            if (OS === 'ios') {
                app_build = CONFIG.APP_BUILD.IOS;
            } else {
                app_build = CONFIG.APP_BUILD.ANDROID
            }

            if (OS == 'ios' && res.IOS.VERSION_CODE > app_build.APP_VERSION || OS == 'android' && res.ANDROID.VERSION_CODE > app_build.APP_VERSION) {
                setModalVisible(true);
            } else {
                setModalVisible(false);
            }
            setInstalledAppBuild(app_build);
            setAppInfo(res);
        });
    };
    const openAppUrl = () => {
        Linking.openURL(APP_URL).catch((err) => console.error("An error occurred", err));
    }

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View
                style={{
                    flex: 1,
                    backgroundColor: theme.colors.background,
                    paddingHorizontal: 15,
                    paddingVertical: 15,
                }}
            >
                <View
                    style={{
                        alignItems: 'center',
                        paddingVertical: 30,
                        paddingRight: 10
                    }}
                >
                    <Image
                        style={{ height: 50, width: 124 }}
                        source={theme.dark ? IMAGES.appnamedark : IMAGES.appname}
                    />
                </View>
                <View
                    style={[GlobalStyleSheet.flex, {
                        paddingHorizontal: 15,
                        paddingBottom: 20
                    }]}
                >
                    <Text style={{ ...FONTS.fontSemiBold, fontSize: 20, color: theme.colors.title }}>Main Menu</Text>
                    <TouchableOpacity
                        onPress={() => dispatch(closeDrawer())}
                        activeOpacity={0.5}
                    >
                        <Feather size={24} color={theme.colors.title} name='x' />
                    </TouchableOpacity>
                </View>
                <View style={{ paddingBottom: 10 }}>
                    {MenuItems.map((data: any, index: any) => {
                        return (
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => {
                                    data.navigate === "DrawerNavigation" ? dispatch(closeDrawer()) : dispatch(closeDrawer());
                                    if (data.name == "Logout") {
                                        handleLogout();
                                    }
                                    else if (data.name == "My Cibil") {
                                        handleCibilFunc();
                                    }
                                    else {
                                        navigation.navigate(data.navigate);
                                    }
                                }}
                                key={index}
                                style={[GlobalStyleSheet.flex, {
                                    paddingVertical: 5,
                                    marginBottom: 0,
                                }]}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
                                    <View style={{ height: 45, width: 45, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
                                        <Image
                                            source={data.icon}
                                            style={{
                                                height: 24,
                                                width: 24,
                                                tintColor: theme.colors.title,
                                                resizeMode: 'contain'
                                            }}
                                        />
                                    </View>
                                    <Text style={[FONTS.fontRegular, { color: theme.colors.title, fontSize: 16, },]}>{data.name}</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    })}
                </View>
                <View style={{ paddingHorizontal: 10 }}>
                    <ThemeBtn />
                </View>
                <View style={{ paddingVertical: 15, paddingHorizontal: 10 }}>
                    <Text style={{ ...FONTS.fontMedium, fontSize: 16, color: theme.colors.title }}>Paylap Score</Text>
                    <Text style={{ ...FONTS.fontMedium, fontSize: 12, color: theme.colors.title }}>App Version {installedAppBuild.APP_VERSION_NAME}</Text>
                </View>
            </View>

            {/* Modal Component */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{OS === 'ios' ? 'IOS' : 'Android'} Update Available!</Text>
                        <Text style={styles.modalMessage}>
                            {OS === 'ios' ? appInfo.IOS.VERSION_MESSAGE : appInfo.ANDROID.VERSION_MESSAGE}
                        </Text>

                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setModalVisible(false)}
                        >
                            {OS == 'android' && appInfo?.ANDROID.VERSION_CODE > installedAppBuild.APP_VERSION &&
                                <>
                                    {
                                        appInfo?.ANDROID?.IS_MANDATORY
                                            ?
                                            <ButtonIcon icon={<Feather name='upload' size={20} color={COLORS.background}
                                            />} size={'sm'} title={"Update"} onPress={() => { openAppUrl() }} ></ButtonIcon>
                                            :
                                            <Text style={styles.closeButtonText}>Close</Text>
                                    }
                                </>
                            }
                            {
                                OS == "ios" && appInfo?.IOS.VERSION_CODE > installedAppBuild.APP_VERSION &&
                                <>
                                    {
                                        appInfo?.IOS?.IS_MANDATORY
                                            ?
                                            <ButtonIcon icon={<Feather name='upload' size={20} color={COLORS.background}
                                            />} size={'sm'} title={"Update"} onPress={() => { openAppUrl() }} ></ButtonIcon>
                                            :
                                            <Text style={styles.closeButtonText}>Close</Text>
                                    }
                                </>
                            }

                        </TouchableOpacity>



                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent background
    },
    modalContent: {
        width: '80%',
        padding: 20,
        borderRadius: 10,
        backgroundColor: 'white',
        alignItems: 'center',
        elevation: 5, // Android shadow
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalMessage: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    closeButton: {
        backgroundColor: COLORS.primary, // Use existing color theme if needed
        padding: 10,
        borderRadius: 5,
    },
    closeButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default DrawerMenu;
