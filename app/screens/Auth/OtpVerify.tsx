import { View, Text, SafeAreaView, TouchableOpacity, Image, ScrollView, StyleSheet, ActivityIndicator } from 'react-native'
import React, { useEffect, useRef, useState } from 'react';
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
import Header from '../../layout/Header';



type SingInScreenProps = StackScreenProps<RootStackParamList, 'OtpVerify'>;

const OtpVerify = ({ navigation, route }: SingInScreenProps) => {
    const { mobile } = route.params;

    const theme = useTheme();
    const { colors }: { colors: any } = theme;

    const [isFocused, setisFocused] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [isDisabled, setIsDisabled] = useState(true);
    const [isBtnDisabled, setIsBtnDisabled] = useState(true);

    const [otp, setOtp] = useState("");

    const verifyOtp = async () => {

        if (otp.length == 4) {
            setIsLoading(true);
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
        setIsLoading(false);
    }
    const INITIAL_TIME = 60;
    const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);

    useEffect(() => {
        if (timeLeft === 0) {
            setIsDisabled(false);
            return;
        };

        const timerId = setInterval(() => {
            setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);

        return () => clearInterval(timerId);
    }, [timeLeft]);

    const handleResend = async () => {
        setIsDisabled(true);
        setTimeLeft(INITIAL_TIME);
        if (mobile.length == 10) {
            setIsLoading(true);
            const res: any = await ApiService.postWithoutToken("api/auth/login", { mobile: mobile })
            if (res != null) {
                if (res.status) {
                    navigation.navigate("OtpVerify", { mobile: mobile })
                }
                MessagesService.commonMessage(res.message)
            }
        } else {
            MessagesService.commonMessage("Invalid Mobile Number")


        }
        setIsLoading(false);
        // if (onResend) onResend();
    };

    const formatTime = (seconds: any) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.card, }}>
            <Header
                leftIcon='back'
            />
            <View style={[GlobalStyleSheet.container, { justifyContent: 'center', alignItems: 'center', paddingVertical: 15 }]}>
                <Image
                    style={{ resizeMode: 'contain', height: 120, width: 150 }}
                    source={theme.dark ? IMAGES.appnamedark : IMAGES.appname}
                />
            </View>
            <ScrollView style={{ flexGrow: 1, }} showsVerticalScrollIndicator={false}>
                <View style={[GlobalStyleSheet.container, { flexGrow: 1, paddingBottom: 0, paddingHorizontal: 30, paddingTop: 0 }]}>
                    <View style={{}}>
                        <View style={{ marginBottom: 30 }}>
                            <Text style={[styles.title1, { color: colors.title }]}>Verify OTP</Text>
                            <Text style={[styles.title2, { color: colors.title }]}>Log In With Mobile Number {mobile}</Text>
                        </View>
                        <View style={[GlobalStyleSheet.container, { padding: 0 }]}>
                            <Text style={[styles.title3, { color: '#8A8A8A' }]}>Enter OTP</Text>
                        </View>
                        <View style={{ marginBottom: 20, marginTop: 10 }}>
                            <Input
                                keyboardType="numeric"
                                onFocus={() => setisFocused(true)}
                                onBlur={() => setisFocused(false)}
                                onChangeText={(value) => {
                                    if (value !== "") { setIsBtnDisabled(false); }
                                    else { setIsBtnDisabled(true); }
                                    setOtp(value);
                                }
                                }
                                isFocused={isFocused}
                                inputBorder
                                defaultValue=''
                            />
                        </View>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        < Text style={{ textAlign: "right", color: isDisabled ? COLORS.warning : COLORS.primary, }}>
                            {isDisabled ? `Time remaining : ${formatTime(timeLeft)}` : "Now You Can Resend OTP ->"}
                        </Text>
                        <TouchableOpacity onPress={handleResend} disabled={isDisabled}>
                            <View style={{ backgroundColor: isDisabled ? "grey" : COLORS.primary, borderRadius: 50, padding: 8 }} >
                                < Text style={{ ...FONTS.fontSm, textAlign: "right", color: COLORS.backgroundColor, }}>
                                    Resend OTP
                                </Text>

                            </View>

                        </TouchableOpacity>
                    </View>


                    <View style={{ marginTop: 30 }}>
                        {
                            isLoading === false ?
                                <Button
                                    disabled={isBtnDisabled}
                                    title={"Verify"}
                                    onPress={verifyOtp}
                                    style={{ borderRadius: 52 }}
                                    color={isBtnDisabled ? "grey" : COLORS.primary}
                                /> : <ActivityIndicator color={COLORS.primary} size={70} />
                        }

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