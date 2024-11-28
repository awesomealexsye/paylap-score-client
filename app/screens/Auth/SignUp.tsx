import { View, Text, SafeAreaView, TouchableOpacity, Image, ScrollView, StyleSheet, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { COLORS, FONTS, SIZES } from '../../constants/theme'
import { GlobalStyleSheet } from '../../constants/StyleSheet'
import { useTheme } from '@react-navigation/native'
import { Feather } from '@expo/vector-icons';
import { StackScreenProps } from '@react-navigation/stack'
import { RootStackParamList } from '../../navigation/RootStackParamList'
import Input from '../../components/Input/Input'
import { IMAGES } from '../../constants/Images'
import Button from '../../components/Button/Button'
import { ApiService } from '../../lib/ApiService'
import { MessagesService } from '../../lib/MessagesService'
import Header from '../../layout/Header'
import { LinearGradient } from 'expo-linear-gradient'
import { useTranslation } from 'react-i18next'
import StorageService from '../../lib/StorageService'
import CONFIG from '../../constants/config'


type SignUpScreenProps = StackScreenProps<RootStackParamList, 'SignUp'>;

const SignUp = ({ navigation }: SignUpScreenProps) => {

    const theme = useTheme();
    const { colors }: { colors: any } = theme;

    const [isFocused, setisFocused] = useState(false);
    const [isFocused2, setisFocused2] = useState(false);
    const [isFocused3, setisFocused3] = useState(false);
    const [isFocused4, setisFocused4] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [referralCode, setReferralCode] = useState("");

    // useEffect(() => {
    //     StorageService.getStorage(CONFIG.HARDCODE_VALUES.REFFERAL_CODE).then((res: any) => {
    //         // console.log("SEt Refferal", res)
    //         setReferralCode(res);
    //     })
    // }, [])

    const { t } = useTranslation();
    const sentOtp = async () => {
        if (name == '' || name.length < 2) {
            MessagesService.commonMessage("Invalid Name")
        }
        else if (mobile.length != 10) {
            MessagesService.commonMessage("Invalid Mobile Number")
        }
        else {
            setIsLoading(true);
            const res: any = await ApiService.postWithoutToken("api/auth/register", { name, email, mobile, refferal: referralCode })
            if (res != null) {
                if (res.status) {
                    navigation.navigate("OtpVerify", { mobile: mobile })
                    MessagesService.commonMessage(res.message, "SUCCESS")

                } else {
                    MessagesService.commonMessage(res.message)
                }
            }
            setIsLoading(false);
        }


    }

    return (

        <SafeAreaView style={{ flex: 1, backgroundColor: colors.card, }}>
            {/* <Header
                leftIcon='back'
                transparent
            /> */}
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
                        flex: 0.6,
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
                                source={IMAGES.appnamedark}
                                style={{
                                    height: 110,
                                    width: 150,
                                    objectFit: "contain",
                                }}
                            />
                        </View>
                        {/* <Text style={{
                            ...FONTS.fontSemiBold,
                            fontSize: 16,
                            color: COLORS.background,
                            paddingBottom: 20,
                        }}>{`Create an account`}</Text> */}
                    </View>

                    {/* Form Section */}
                    <View style={{
                        flex: 2,
                        paddingHorizontal: 30,
                        paddingTop: 20,
                        backgroundColor: colors.background,
                        borderTopLeftRadius: 70,
                        width: "100%"
                    }}>


                        <View style={[GlobalStyleSheet.container, { flexGrow: 1, paddingBottom: 0, paddingHorizontal: 10, paddingTop: 0 }]}>
                            <View style={{}}>
                                <View style={{ marginBottom: 30 }}>
                                    <Text style={[styles.title1, { color: colors.title }]}>{t('createNewAccount')}</Text>
                                    {/* <Text style={[styles.title2, { color: colors.title }]}>Join us! Enter your mobile number to get an OTP and create your account</Text> */}
                                </View>
                                <View style={[GlobalStyleSheet.container, { padding: 0 }]}>
                                    <Text style={[styles.title3, { color: colors.title }]}>{t('yourName')} (*)
                                    </Text>
                                </View>
                                <View style={{ marginVertical: 10, }}>
                                    <Input
                                        onFocus={() => setisFocused(true)}
                                        onBlur={() => setisFocused(false)}
                                        onChangeText={(value) => setName(value)}
                                        isFocused={isFocused}
                                        //inputBorder
                                        defaultValue=''
                                        maxlength={20}
                                    />
                                </View>
                                <View style={[GlobalStyleSheet.container, { padding: 0 }]}>
                                    <Text style={[styles.title3, { color: colors.title }]}>{t('mobileNumber')}(*)</Text>
                                </View>
                                <View style={{ marginVertical: 10, }}>
                                    <Input
                                        keyboardType="numeric"
                                        onFocus={() => setisFocused3(true)}
                                        onBlur={() => setisFocused3(false)}
                                        //backround={colors.background}
                                        onChangeText={(value) => setMobile(value)}
                                        isFocused={isFocused3}
                                        // inputBorder
                                        defaultValue=''
                                        maxlength={10}
                                    />
                                </View>
                                <View style={[GlobalStyleSheet.container, { padding: 0 }]}>
                                    <Text style={[styles.title3, { color: colors.title }]}>{t('email')} ({t('optional')})</Text>
                                </View>
                                <View style={{ marginVertical: 10 }}>
                                    <Input
                                        onFocus={() => setisFocused2(true)}
                                        onBlur={() => setisFocused2(false)}
                                        // backround={colors.background}
                                        onChangeText={(value) => setEmail(value)}
                                        isFocused={isFocused2}
                                        //inputBorder
                                        defaultValue=''
                                    />
                                </View>

                                <View style={[GlobalStyleSheet.container, { padding: 0 }]}>
                                    <Text style={[styles.title3, { color: colors.title }]}>{t('yourRefferalCode')} ({t('optional')})</Text>
                                </View>
                                <View style={{ marginBottom: 10, marginTop: 10 }}>
                                    <Input
                                        // keyboardType="numeric"
                                        onFocus={() => setisFocused4(true)}
                                        onBlur={() => setisFocused4(false)}
                                        //backround={colors.background}
                                        onChangeText={(value) => setReferralCode(value)}
                                        isFocused={isFocused4}
                                        //inputBorder
                                        defaultValue={''}
                                        maxlength={30}
                                    />
                                </View>
                            </View>
                            <View style={{ marginTop: 30 }}>
                                {
                                    isLoading === false ?
                                        <Button
                                            title={t('sendOtp')}
                                            onPress={sentOtp}
                                            style={{ borderRadius: 15 }}
                                        /> : <ActivityIndicator size={70} color={COLORS.primary} />

                                }
                                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", margin: 40 }}>
                                    <Text style={{ ...FONTS.fontMedium, color: colors.title }}>{t('alreadyAccount')}</Text>
                                    <TouchableOpacity
                                        onPress={() => navigation.navigate('MobileSignIn')}
                                    >
                                        <Text style={{ ...FONTS.fontBold, color: COLORS.primary }}> {t('login')} </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </LinearGradient>
            </ScrollView>
        </SafeAreaView >
    )
}

const styles = StyleSheet.create({
    title1: {
        ...FONTS.fontSemiBold,
        fontSize: SIZES.h4,
        // color: COLORS.title,
        marginBottom: 5
    },
    title2: {
        ...FONTS.fontRegular,
        fontSize: SIZES.font,
        // color: COLORS.title,
    },
    title3: {
        ...FONTS.fontMedium,
        fontSize: SIZES.font,
        // color: '#8A8A8A'
    },
    // imagebackground: {
    //     height: 46,
    //     width: 46,
    //     borderRadius: 50,
    //     backgroundColor: '#F6F6F6',
    //     alignItems: 'center',
    //     justifyContent: 'center',
    // }
})

export default SignUp