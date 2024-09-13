import { View, Text, SafeAreaView, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native'
import React, { useState } from 'react';
import { COLORS, FONTS } from '../../constants/theme'
import { GlobalStyleSheet } from '../../constants/StyleSheet'
import { useTheme } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import { RootStackParamList } from '../../navigation/RootStackParamList'
import Input from '../../components/Input/Input'
import { IMAGES } from '../../constants/Images'
import Button from '../../components/Button/Button'
import { ApiService } from '../../lib/ApiService';
import { MessagesService } from '../../lib/MessagesService';
import StorageService from '../../lib/StorageService';
import CONFIG from '../../constants/config';



type SingInScreenProps = StackScreenProps<RootStackParamList, 'OtpVerify'>;

const OtpVerify = ({ navigation, route }: SingInScreenProps) => {
    const { mobile } = route.params;
    console.log("mobile", mobile);

    const theme = useTheme();
    const { colors }: { colors: any } = theme;

    const [isFocused, setisFocused] = useState(false);
    const [isFocused2, setisFocused2] = useState(false);
    const [otp, setOtp] = useState("");

    const verifyOtp = async () => {

        if (otp.length == 4) {
            const res: any = await ApiService.postWithoutToken("api/auth/otp-verify", { mobile, otp })
            if (res != null) {
                if (res.status) {
                    let api_data: any = res.data;
                    await StorageService.setStorage(CONFIG.HARDCODE_VALUES.USER_ID, String(api_data.id))
                    await StorageService.setStorage(CONFIG.HARDCODE_VALUES.AUTH_KEY, api_data.auth_key)
                    await StorageService.setStorage(CONFIG.HARDCODE_VALUES.JWT_TOKEN, res.jwt_token)
                    const is_login = await StorageService.isLoggedIn();
                    if (is_login) {
                        navigation.navigate('DrawerNavigation', { screen: 'Home' });
                    }
                } else {
                    MessagesService.commonMessage(res.message)
                }
            }
        } else {
            MessagesService.commonMessage("OTP Lenth Must be 4 Digit")
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.card, }}>
            <View style={[GlobalStyleSheet.container, { justifyContent: 'center', alignItems: 'center', paddingVertical: 50 }]}>
                <Image
                    style={{ resizeMode: 'contain', height: 36, width: 120 }}
                    source={theme.dark ? IMAGES.appnamedark : IMAGES.appname}
                />
            </View>
            <ScrollView style={{ flexGrow: 1, }} showsVerticalScrollIndicator={false}>
                <View style={[GlobalStyleSheet.container, { flexGrow: 1, paddingBottom: 0, paddingHorizontal: 30, paddingTop: 0 }]}>
                    <View style={{}}>
                        <View style={{ marginBottom: 30 }}>
                            <Text style={[styles.title1, { color: colors.title }]}>Verify OTP</Text>
                            <Text style={[styles.title2, { color: colors.title }]}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor</Text>
                        </View>
                        <View style={[GlobalStyleSheet.container, { padding: 0 }]}>
                            <Text style={[styles.title3, { color: '#8A8A8A' }]}>Enter OTP</Text>
                        </View>
                        <View style={{ marginBottom: 20, marginTop: 10 }}>
                            <Input
                                keyboardType="numeric"
                                onFocus={() => setisFocused(true)}
                                onBlur={() => setisFocused(false)}
                                onChangeText={(value) => setOtp(value)}
                                isFocused={isFocused}
                                inputBorder
                                defaultValue=''
                            />
                        </View>
                    </View>

                    <View style={{ marginTop: 30 }}>
                        <Button
                            title={"Verify"}
                            onPress={verifyOtp}
                            style={{ borderRadius: 52 }}
                        />

                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    text: {
        ...FONTS.fontRegular,
        fontSize: 14,
        color: COLORS.title,
    },
    title1: {
        ...FONTS.fontSemiBold,
        fontSize: 24,
        color: COLORS.title,
        marginBottom: 5
    },
    title2: {
        ...FONTS.fontRegular,
        fontSize: 14,
        color: COLORS.title,
    },
    title3: {
        ...FONTS.fontMedium,
        fontSize: 14,
        color: '#8A8A8A'
    }
})

export default OtpVerify