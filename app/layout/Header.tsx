import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Platform,
    Image
} from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { COLORS, FONTS } from '../constants/theme';
import { GlobalStyleSheet } from '../constants/StyleSheet';
import { FontAwesome } from '@expo/vector-icons';
import StorageService from '../lib/StorageService';


type Props = {
    title?: string,
    leftIcon?: string,
    leftAction?: any,
    transparent?: any,
    productId?: string,
    titleLeft?: any,
    titleLeft2?: any,
    titleRight?: any,
    rightIcon1?: any,
    rightIcon2?: any,
    rightIcon3?: string,
    rightIcon4?: any,
    rightIcon5?: any,
    rightIcon6?: any,
    rightIcon5Callback?: any,
}


const Header = ({ title, leftIcon, leftAction, transparent, productId, titleLeft, titleLeft2, titleRight, rightIcon1, rightIcon4, rightIcon2, rightIcon3, rightIcon5, rightIcon6, rightIcon5Callback }: Props) => {

    const theme = useTheme();
    const { colors }: { colors: any } = theme;

    const navigation = useNavigation<any>();


    const handleLogout = async () => {
        const is_logout = await StorageService.logOut();
        if (is_logout) {
            navigation.navigate("MobileSignIn");
        }
    }

    return (
        <View
            style={[{
                height: 65,
                backgroundColor: colors.card,
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 99
            }, transparent && {
                position: 'absolute',
                left: 0,
                right: 0,
                borderBottomWidth: 0,
            }, Platform.OS === 'ios' && {
                backgroundColor: colors.card
            }]}
        >
            <View style={[GlobalStyleSheet.container, {
                flexDirection: 'row',
                alignItems: 'center',
                paddingLeft: 15,
                justifyContent: 'space-between',
            }]}
            >
                {leftIcon === 'back' &&
                    <TouchableOpacity
                        onPress={() => leftAction ? leftAction() : navigation.goBack()}
                        style={[styles.actionBtn, { backgroundColor: colors.background }]}
                    >
                        <Feather size={24} color={colors.title} name={'arrow-left'} />
                    </TouchableOpacity>
                }
                <View style={{ flex: 1 }}>
                    {productId
                        ?
                        <Text style={{ ...FONTS.fontMedium, fontSize: 24, color: colors.title, textAlign: titleLeft ? 'left' : 'center', paddingLeft: titleLeft2 ? 10 : 10, paddingRight: titleRight ? 20 : 0 }}><Text style={{ color: COLORS.primary }}>e</Text>Bike</Text>
                        :
                        <Text style={{ ...FONTS.fontSemiBold, fontSize: 20, color: colors.title, textAlign: titleLeft ? 'left' : 'center', paddingLeft: titleLeft2 ? 10 : 10, paddingRight: titleRight ? 40 : 0 }}>{title}</Text>
                    }
                </View>
                {rightIcon1 == "search" &&
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => navigation.navigate('Search')}
                        style={[styles.actionBtn, {}]}
                    >
                        <Feather size={20} color={colors.title} name={'search'} />
                    </TouchableOpacity>
                }
                {rightIcon2 == "Edit" &&
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => navigation.navigate('EditProfile')}
                        style={[styles.actionBtn, {}]}
                    >
                        <FontAwesome size={22} color={colors.title} name={'pencil'} />
                    </TouchableOpacity>
                }
                {rightIcon3 == "cart" &&
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => navigation.navigate('MyCart')}
                        style={[styles.actionBtn, {}]}
                    >
                        <FontAwesome size={22} color={colors.title} name={'shopping-cart'} />
                    </TouchableOpacity>
                }
                {rightIcon4 == "home" &&
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => navigation.navigate('DrawerNavigation', { screen: 'Home' })}
                        style={[styles.actionBtn, {}]}
                    >
                        <FontAwesome size={22} color={colors.title} name={'home'} />
                    </TouchableOpacity>
                }
                {rightIcon5 == "close" &&
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={rightIcon5Callback}
                        style={[styles.actionBtn, {}]}
                    >
                        <FontAwesome size={22} color={colors.title} name={'close'} />
                    </TouchableOpacity>
                }
                {rightIcon6 == "logout" &&
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={handleLogout}
                        style={{ padding: 5 }}
                    ><View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center", }}>
                            <FontAwesome size={22} color={colors.title} name={'lock'} />
                            <Text style={{ ...FONTS.fontSm, color: colors.title }}>Logout</Text>
                        </View>

                    </TouchableOpacity>
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        height: 60,
        backgroundColor: COLORS.card,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        ...FONTS.fontMedium,
    },
    actionBtn: {
        height: 45,
        width: 45,
        borderRadius: 45,
        alignItems: 'center',
        justifyContent: 'center',
        //backgroundColor:COLORS.card
        // position:'absolute',
        // left:10,
        // top:10,
    }
})

export default Header;