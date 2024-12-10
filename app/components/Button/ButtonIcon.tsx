import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SIZES, FONTS } from '../../constants/theme';

type Props = {
    title: String,
    onPress?: (e: any) => void,
    color?: any,
    style?: object,
    size?: any,
    text?: any,
    textColor?: any,
    icon?: any,
    iconDirection?: string
}

const ButtonIcon = ({
    title,
    onPress,
    color,
    style,
    size = "lg",
    text,
    textColor = COLORS.white,
    icon,
    iconDirection = "top"
}: Props) => {
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
        >
            <View
                style={[styles.button, color && {
                    backgroundColor: color,
                    // padding: 0
                }, size === 'sm' && {
                    height: 50,
                    padding: 16,
                    borderRadius: 4
                }, size === 'lg' && {
                    height: 55,
                    // paddingHorizontal: 30,
                }, iconDirection === "left" && { flexDirection: 'row' },
                iconDirection === "right" && { flexDirection: 'row-reverse' },
                iconDirection === "top" && { flexDirection: 'column' },
                iconDirection === "bottom" && { flexDirection: 'row-column  ' },
                style && { ...style }]}
            >
                {icon &&
                    <View
                    // style={[{
                    //     height: '100%',
                    //     alignItems: 'center',
                    //     justifyContent: 'center',

                    // }]}
                    >
                        {icon}
                    </View>
                }
                <Text style={[styles.buttnTitle, size === 'sm' && {
                    fontSize: 12,
                }, size === 'lg' && {
                    fontSize: 18,
                }, color && { color: textColor }, text && { color: text }]}>{title}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: COLORS.primary,
        height: 60,
        borderRadius: 12,
        gap: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttnTitle: {
        ...FONTS.fontSemiBold,
        fontSize: 12,
        color: '#fff',
        lineHeight: 24,
        // textTransform: 'uppercase'
    }
});

export default ButtonIcon;