import { View, Text, SafeAreaView, TouchableOpacity, Image, ScrollView, StyleSheet, ActivityIndicator } from 'react-native'
import React, { useEffect, useRef, useState } from 'react';
import { COLORS, FONTS, SIZES } from '../../constants/theme'
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
import { LinearGradient } from 'expo-linear-gradient';



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
    };

    const formatTime = (seconds: any) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };


    return (

        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background, }}>
            <Header
                leftIcon='back'
                backgroundColor={COLORS.primary}
                transparent
            />
            <ScrollView style={{ flexDirection: "column", height: "100%" }}>
                <LinearGradient
                    colors={[COLORS.primary, colors.background]}
                    style={{
                        height: "100%",
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    locations={[0.2, 0.9]}
                >


                    <View style={{
                        flex: 2.5,
                        padding: 50,
                        backgroundColor: COLORS.primary,
                        // borderBottomLeftRadius: -150,
                        borderBottomRightRadius: 70,
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: "100%"
                    }}>

                        <View style={{
                            flex: 1.5,
                            alignItems: 'center',
                        }}>
                            <Image
                                source={theme.dark ? IMAGES.appnamedark : IMAGES.appname}
                                style={{
                                    height: 110,
                                    width: 150,
                                    objectFit: "contain",
                                }}
                            />
                        </View>

                    </View>

                    {/* Form Section */}
                    <View style={{
                        flex: 1,
                        paddingHorizontal: 30,
                        paddingTop: 40,
                        backgroundColor: colors.background,
                        borderTopLeftRadius: 70,
                        width: "100%"
                    }}>

                        <Text style={{
                            ...FONTS.fontMedium,
                            fontSize: SIZES.font,
                            color: colors.title,
                            marginVertical: 10,
                        }}>{`OTP sent to this Mobile Number ${mobile}`}</Text>

                        <View style={[GlobalStyleSheet.container, { padding: 0 }]}>
                            <Text style={{
                                color: colors.title,
                                ...FONTS.fontMedium,
                                fontSize: SIZES.fontSm,
                            }}>Enter OTP</Text>
                        </View>
                        <View style={{ marginVertical: 10, }}>
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
                                //inputBorder
                                defaultValue=''
                            />
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            < Text style={{ ...FONTS.fontSemiBold, textAlign: "right", color: isDisabled ? COLORS.warning : COLORS.primary, }}>
                                {isDisabled ? `Time remaining : ${formatTime(timeLeft)}` : "Now Resend OTP"}
                            </Text>
                            <TouchableOpacity onPress={handleResend} disabled={isDisabled}>
                                <View style={{ backgroundColor: isDisabled ? "grey" : COLORS.primary, borderRadius: 10, padding: 8 }} >
                                    < Text style={{ ...FONTS.fontSm, textAlign: "right", color: COLORS.backgroundColor, }}>
                                        Resend OTP
                                    </Text>

                                </View>

                            </TouchableOpacity>
                        </View>

                        {/* Login Button */}
                        <View style={{ marginVertical: 100 }}>
                            {
                                isLoading === false ?
                                    <Button
                                        disabled={isBtnDisabled}
                                        title={"Verify"}
                                        onPress={verifyOtp}
                                        style={{ borderRadius: 15 }}
                                        color={isBtnDisabled ? "grey" : COLORS.primary}
                                    /> : <ActivityIndicator color={COLORS.primary} size={70} />
                            }
                        </View>
                    </View>
                </LinearGradient>
            </ScrollView>
        </SafeAreaView >
    )
}

// const styles = StyleSheet.create({
//     // title1: {
//     //     ...FONTS.fontSemiBold,
//     //     fontSize: 24,
//     //     color: COLORS.title,
//     //     marginBottom: 5
//     // },
//     // title2: {
//     //     ...FONTS.fontRegular,
//     //     fontSize: 14,
//     //     color: COLORS.title,
//     // },
//     // title3: {
//     //     ...FONTS.fontMedium,
//     //     fontSize: 14,
//     //     color: '#8A8A8A'
//     // }
// })

export default OtpVerify