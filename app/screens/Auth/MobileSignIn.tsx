import { View, Text, SafeAreaView, TouchableOpacity, Image, ScrollView, StyleSheet, ActivityIndicator } from 'react-native'
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

            <Header
                leftIcon='back'
            />

            <View style={[GlobalStyleSheet.container, { justifyContent: 'center', alignItems: 'center', paddingVertical: 15 }]}>
                <Image
                    style={{ resizeMode: 'contain', height: 130, width: 150 }}
                    source={theme.dark ? IMAGES.appnamedark : IMAGES.appname}
                />
            </View>
            <ScrollView style={{ flexGrow: 1, }} showsVerticalScrollIndicator={false}>
                <View style={[GlobalStyleSheet.container, { flexGrow: 1, paddingBottom: 0, paddingHorizontal: 30, paddingTop: 0 }]}>
                    <View style={{}}>
                        <View style={{ marginBottom: 30 }}>
                            <Text style={[styles.title1, { color: colors.title }]}>Sign In</Text>
                            <Text style={[styles.title2, { color: colors.title }]}>Welcome back! Enter your mobile number to receive an OTP for secure access</Text>
                        </View>
                        <View style={[GlobalStyleSheet.container, { padding: 0 }]}>
                            <Text style={[styles.title3, { color: '#8A8A8A' }]}>Mobile Number</Text>
                        </View>
                        <View style={{ marginBottom: 20, marginTop: 10 }}>
                            <Input
                                keyboardType="numeric"
                                onFocus={() => setisFocused(true)}
                                onBlur={() => setisFocused(false)}
                                onChangeText={(e) => setMobile(e)}
                                isFocused={isFocused}
                                inputBorder
                                defaultValue=''
                            />
                        </View>
                    </View>

                    <View style={{ marginTop: 30 }}>
                        {
                            isLoading === false ?
                                <Button
                                    title={"Send OTP"}
                                    onPress={sentOtp}
                                    style={{ borderRadius: 52 }}
                                /> : <ActivityIndicator color={COLORS.primary} size={70} />
                        }
                        <View style={{ marginBottom: 15, marginTop: 60 }}>
                            <Text style={[styles.title2, { color: colors.title, textAlign: 'center', opacity: .5 }]}>Don’t have an account?</Text>
                        </View>
                        <Button
                            title={"Create an account"}
                            onPress={() => navigation.navigate('SignUp')}
                            text={COLORS.title}
                            color={COLORS.secondary}
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

export default MobileSignIn