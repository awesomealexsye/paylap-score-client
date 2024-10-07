import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import { IMAGES } from '../constants/Images';
import { COLORS, FONTS } from '../constants/theme';
import { Feather } from '@expo/vector-icons';
import ThemeBtn from '../components/ThemeBtn';
import { useDispatch } from 'react-redux';
import { closeDrawer } from '../redux/actions/drawerAction';
import { GlobalStyleSheet } from '../constants/StyleSheet';
import StorageService from '../lib/StorageService';

const MenuItems = [
    {
        id: "1",
        icon: IMAGES.home,
        name: "Home",
        navigate: "Home",
    },

    // {
    //     id: "2",
    //     icon: IMAGES.components,
    //     name: "Components",
    //     navigate: "Components",
    // },

    // {
    //     id: "2",
    //     icon: IMAGES.chat,
    //     name: "User Kyc",
    //     navigate: 'UserKyc',
    // },
    {
        id: "2",
        icon: IMAGES.search,
        name: "Find User",
        navigate: 'FindUser',
    },
    {
        id: "3",
        icon: IMAGES.user3,
        name: "Profile",
        navigate: "Profile",
    }, {
        id: "4",
        icon: IMAGES.share,
        name: "Share",
        navigate: 'ShareApp',
    },
    {
        id: "5",
        icon: IMAGES.logout,
        name: "Logout",
        navigate: 'MobileSignIn',
    },

]

const DrawerMenu = () => {
    const handleLogout = async () => {
        const is_logout = await StorageService.logOut();
        if (is_logout) {
            navigation.navigate("MobileSignIn");
        }
    }


    const theme = useTheme();
    const dispatch = useDispatch();



    const { colors }: { colors: any } = theme;

    const [active, setactive] = useState(MenuItems[0]);

    const navigation = useNavigation<any>();

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View
                style={{
                    flex: 1,
                    backgroundColor: colors.background,
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
                        style={{ height: 35, width: 114 }}
                        source={theme.dark ? IMAGES.appnamedark : IMAGES.appname}
                    />
                </View>
                <View
                    style={[GlobalStyleSheet.flex, {
                        paddingHorizontal: 15,
                        paddingBottom: 20
                    }]}
                >
                    <Text style={{ ...FONTS.fontSemiBold, fontSize: 20, color: colors.title }}>Main Menus</Text>
                    <TouchableOpacity
                        onPress={() => dispatch(closeDrawer())}
                        activeOpacity={0.5}
                    >
                        <Feather size={24} color={colors.title} name='x' />
                    </TouchableOpacity>
                </View>
                <View style={{ paddingBottom: 10 }}>
                    {MenuItems.map((data: any, index: any) => {
                        return (
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => {
                                    data.navigate === "DrawerNavigation" ? dispatch(closeDrawer()) : dispatch(closeDrawer());
                                    if (data.name == "Logout") {
                                        handleLogout();
                                    } else {
                                        navigation.navigate(data.navigate)
                                    }
                                }
                                }
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
                                                tintColor: data.id == '9' ? '#FF8484' : data.id === '0' ? COLORS.primary : '#BDBDBD',
                                                //marginRight:14,
                                                resizeMode: 'contain'
                                            }}
                                        />
                                    </View>
                                    <Text style={[FONTS.fontRegular, { color: colors.title, fontSize: 16, opacity: .6 }, data.id === '0' && { ...FONTS.fontSemiBold, fontSize: 16, color: COLORS.primary }]}>{data.name}</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    })}
                </View>
                <View style={{ paddingHorizontal: 10 }}>
                    <ThemeBtn />
                </View>
                <View style={{ paddingVertical: 15, paddingHorizontal: 10 }}>
                    <Text style={{ ...FONTS.fontMedium, fontSize: 16, color: '#868686' }}>Paylap Score</Text>
                    <Text style={{ ...FONTS.fontMedium, fontSize: 12, color: '#B1B1C3' }}>App Version 1.0.0</Text>
                </View>
            </View>
        </ScrollView>
    )
}

export default DrawerMenu