import React from 'react';
import { useTheme } from '@react-navigation/native';
import { Image, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { COLORS } from '../constants/theme';
import { IMAGES } from '../constants/Images';
import { ThemeContext } from '../constants/ThemeContext';
import StorageService from '../lib/StorageService';
import CONFIG from '../constants/config';

const ThemeBtn = () => {

    const theme = useTheme();
    const { colors }: { colors: any } = theme;

    const { setDarkTheme, setLightTheme } = React.useContext<any>(ThemeContext);

    const offset = useSharedValue(0);
    const opacityDark = useSharedValue(0);
    const opacityLight = useSharedValue(0);

    const animatedStyles = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: offset.value }],
        };
    });

    // console.log(theme.dark, "Darktheme", getThemeMode())
    if (theme.dark) {
        offset.value = withSpring(34);
        opacityDark.value = withTiming(1);
        opacityLight.value = withTiming(0);
    } else {
        offset.value = withSpring(0);
        opacityLight.value = withTiming(1);
        opacityDark.value = withTiming(0);
    }

    //handle theme by akhan 
    const handleThemeMode = async () => {
        let update_theme_mode;
        if (theme.dark) {
            update_theme_mode = CONFIG.HARDCODE_VALUES.THEME_MODE.LIGHT;
            setLightTheme();
        } else {
            setDarkTheme()
            update_theme_mode = CONFIG.HARDCODE_VALUES.THEME_MODE.DARK;
        }
        await StorageService.setStorage(CONFIG.HARDCODE_VALUES.THEME_MODE.THEME_MODE, update_theme_mode)
    }


    //get theme by akhan 
    const getThemeMode = async () => {
        const get_theme_mode = await StorageService.getStorage(CONFIG.HARDCODE_VALUES.THEME_MODE.THEME_MODE);
        if (get_theme_mode != null) {
            if (get_theme_mode == CONFIG.HARDCODE_VALUES.THEME_MODE.LIGHT) {
                setLightTheme()
            } else {
                setDarkTheme()
            }
        }
    }

    getThemeMode();
    return (
        <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
                handleThemeMode()
            }
            }
            style={{
                height: 40,
                width: 72,
                borderRadius: 50,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: theme.dark ? COLORS.title : COLORS.card,
                shadowColor: "rgba(4,118,78,.6)",
                shadowOffset: {
                    width: 2,
                    height: 2,
                },
                shadowOpacity: 0.34,
                shadowRadius: 10.27,
                elevation: 5,
            }}
        >

            <Animated.View
                style={[animatedStyles, {
                    height: 28,
                    width: 28,
                    borderRadius: 14,
                    backgroundColor: theme.dark ? COLORS.primary : COLORS.primary,
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'absolute',
                    top: 6,
                    left: 5,
                }]}
            ></Animated.View>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Image
                    source={IMAGES.sun}
                    style={{
                        height: 18,
                        width: 18,
                        tintColor: COLORS.white,
                    }}
                />
            </View>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Image
                    source={IMAGES.darkMode}
                    style={{
                        height: 16,
                        width: 16,
                        tintColor: theme.dark ? COLORS.white : COLORS.primary,
                    }}
                />
            </View>
        </TouchableOpacity>
    );
};


export default ThemeBtn;