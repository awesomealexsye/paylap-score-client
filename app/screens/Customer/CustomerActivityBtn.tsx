import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { COLORS, FONTS } from '../../constants/theme';
import { useTheme } from '@react-navigation/native';

type Props = {
    color?: string;
    textcolor?: string;
    border?: string;
    rounded?: any;
    icon?: any;
    text?: string;
    onpress?: any;
    gap?: any;
    isDisabled?: boolean
}

const CustomerActivityBtn = ({ color, rounded, icon, text, onpress, gap, textcolor, border, isDisabled }: Props) => {

    const { colors }: { colors: any } = useTheme();
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            disabled={isDisabled}
            style={[{
                borderRadius: 16,
                backgroundColor: isDisabled ? COLORS.borderColor : color,
                paddingVertical: 18,
                overflow: 'hidden',
                // paddingHorizontal: gap ? 25 : 30,
                height: 80,
                width: 80,
                alignItems: 'center',
                flexDirection: 'column',
                gap: gap ? 5 : 10,
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: border ? border : COLORS.borderColor
            }, rounded && {
                borderRadius: 50,
            }]}
            onPress={onpress}
        >
            <View
                style={[{
                    // width: 44,
                    alignItems: 'center',
                    justifyContent: 'center',
                }, rounded && {
                    borderRadius: 50,
                }]}
            >
                {icon}
            </View>
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <Text style={{ ...FONTS.fontSemiBold, color: textcolor ? textcolor : colors.title, fontSize: 12, textAlign: 'center' }}>{text}</Text>
            </View>
        </TouchableOpacity>
    );
};



export default CustomerActivityBtn;