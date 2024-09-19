import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SIZES, FONTS } from '../../constants/theme';

type Props = {
    title: string,
    onPress?: (e: any) => void,
    color?: any,
    style?: object,
    size?: any,
    text?: any,
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
    icon,
    iconDirection = "right"
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
                iconDirection === "right" && { flexDirection: 'row-reverse' }, style && { ...style }]}
            >
                {icon &&
                    <View
                        style={[{
                            height: '100%',
                            // marginRight: 12,
                            alignItems: 'center',
                            justifyContent: 'center',

                        }]}
                    >
                        {icon}
                    </View>
                }
                <Text style={[styles.buttnTitle, size === 'sm' && {
                    fontSize: 14,
                }, size === 'lg' && {
                    fontSize: 18,
                }, color && { color: COLORS.white }, text && { color: (text) }]}>{title}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: COLORS.primary,
        height: 60,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

        // paddingHorizontal:20,
    },
    buttnTitle: {
        ...FONTS.fontSemiBold,
        fontSize: 16,
        color: '#fff',
        lineHeight: 24,
        textTransform: 'uppercase'
    }
});

export default ButtonIcon;