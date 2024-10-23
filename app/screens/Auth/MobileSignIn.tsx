import { View, Text, SafeAreaView, TouchableOpacity, Image, ScrollView, StyleSheet, ActivityIndicator, TextInput } from 'react-native'
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
import Header from '../../layout/Header';
import { LinearGradient } from 'expo-linear-gradient';


type SingInScreenProps = StackScreenProps<RootStackParamList, 'MobileSignIn'>;

const MobileSignIn = ({ navigation }: SingInScreenProps) => {

    //redirect to home if already login
    StorageService.isLoggedIn().then((is_login) => {
        // console.log("is_logged_in MobileSignIn page", is_login);
        if (is_login) {
            navigation.replace("DrawerNavigation", { screen: 'Home' });
        }
    })

    const theme = useTheme();
    const { colors }: { colors: any } = theme;

    const [isLoading, setIsLoading] = useState(false);
    const [isFocused, setisFocused] = useState(false);


    const [mobile, setMobile] = useState("");

    const sentOtp = async () => {
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

    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.card, }}>

            {/* <Header
                leftIcon='back'
            /> */}

            <View style={{ flexDirection: "column", height: "100%" }}>
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
                        flex: 1.5,
                        backgroundColor: COLORS.primary,
                        borderBottomLeftRadius: -150,
                        borderBottomRightRadius: 70,
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: "100%"
                    }}>
                        <Image
                            source={IMAGES.appnamedark}
                            style={{
                                height: 140,
                                width: 190,
                                objectFit: "contain",
                            }}
                        />
                        <Text style={{
                            ...FONTS.fontBold,
                            fontSize: 24,
                            color: COLORS.background,
                            marginTop: 10,
                        }}>Welcome Back!</Text>
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
                        <View style={[GlobalStyleSheet.container, { padding: 0 }]}>
                            <Text style={{
                                color: colors.title, ...FONTS.fontMedium,
                                fontSize: 14,
                            }}>Mobile Number</Text>
                        </View>
                        <View style={{ marginVertical: 10, }}>
                            <Input
                                keyboardType="numeric"
                                onFocus={() => setisFocused(true)}
                                onBlur={() => setisFocused(false)}
                                onChangeText={(e) => setMobile(e)}
                                isFocused={isFocused}
                                // inputBorder
                                defaultValue=''
                                backround
                            />
                        </View>

                        {/* Login Button */}
                        <View style={{ marginTop: 30 }}>
                            {
                                isLoading === false ?
                                    <Button
                                        title={"Send OTP"}
                                        onPress={sentOtp}
                                        style={{ borderRadius: 52 }}
                                    /> : <ActivityIndicator color={COLORS.primary} size={70} />
                            }
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", margin: 40 }}>
                            <Text style={{ ...FONTS.fontMedium, color: colors.title }}>Don't have an account? </Text>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('SignUp')}
                            >
                                <Text style={{ ...FONTS.fontBold, color: COLORS.primary }}> SIGN UP </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </LinearGradient>
            </View>
        </SafeAreaView >
    )
}

export default MobileSignIn