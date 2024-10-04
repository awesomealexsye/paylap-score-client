import { View, Text, SafeAreaView, TouchableOpacity, Image, ScrollView, StyleSheet, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { COLORS, FONTS } from '../../constants/theme'
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

    const sentOtp = async () => {
        if (name == '' || name.length < 2) {
            MessagesService.commonMessage("Invalid Name")
        } else if (email == '' || email.length < 2 || email) {
            MessagesService.commonMessage("Invalid Email")
        }
        else if (mobile.length != 10) {
            MessagesService.commonMessage("Invalid Mobile Number")
        }
        else {
            setIsLoading(true);
            const res: any = await ApiService.postWithoutToken("api/auth/register", { name, email, mobile })
            if (res != null) {
                if (res.status) {
                    navigation.navigate("OtpVerify", { mobile: mobile })
                }
                MessagesService.commonMessage(res.message)
            }
            setIsLoading(false);
        }


    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.card, }}>
            <View style={[GlobalStyleSheet.container, GlobalStyleSheet.flexcenter, { paddingVertical: 15 }]}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.5}
                    style={[styles.imagebackground, {
                        backgroundColor: '#F6F6F6',
                        zIndex: 99
                    }]}
                >
                    <Feather name='arrow-left' size={24} color={COLORS.title} />
                </TouchableOpacity>
                <View style={{ flex: 1, alignItems: 'center', marginLeft: -40 }}>
                    <Image
                        style={{ height: 130, width: 150, resizeMode: 'contain' }}
                        source={theme.dark ? IMAGES.appnamedark : IMAGES.appname}
                    />
                </View>
            </View>
            <ScrollView style={{ flexGrow: 1, }} showsVerticalScrollIndicator={false}>
                <View style={[GlobalStyleSheet.container, { flexGrow: 1, paddingBottom: 0, paddingHorizontal: 30, paddingTop: 0 }]}>
                    <View style={{}}>
                        <View style={{ marginBottom: 30 }}>
                            <Text style={[styles.title1, { color: colors.title }]}>Create an account</Text>
                            <Text style={[styles.title2, { color: colors.title }]}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor</Text>
                        </View>
                        <View style={[GlobalStyleSheet.container, { padding: 0 }]}>
                            <Text style={[styles.title3, { color: '#8A8A8A' }]}>Your Name / Business Name
                            </Text>
                        </View>
                        <View style={{ marginBottom: 10, marginTop: 10 }}>
                            <Input
                                onFocus={() => setisFocused(true)}
                                onBlur={() => setisFocused(false)}
                                onChangeText={(value) => setName(value)}
                                isFocused={isFocused}
                                inputBorder
                                defaultValue=''
                            />
                        </View>
                        <View style={[GlobalStyleSheet.container, { padding: 0 }]}>
                            <Text style={[styles.title3, { color: '#8A8A8A' }]}>Your Email</Text>
                        </View>
                        <View style={{ marginBottom: 20, marginTop: 10 }}>
                            <Input
                                onFocus={() => setisFocused2(true)}
                                onBlur={() => setisFocused2(false)}
                                backround={colors.card}
                                onChangeText={(value) => setEmail(value)}
                                isFocused={isFocused2}
                                inputBorder
                                defaultValue=''
                            />
                        </View>
                        <View style={[GlobalStyleSheet.container, { padding: 0 }]}>
                            <Text style={[styles.title3, { color: '#8A8A8A' }]}>Phone Number</Text>
                        </View>
                        <View style={{ marginBottom: 10, marginTop: 10 }}>
                            <Input
                                keyboardType="numeric"
                                onFocus={() => setisFocused3(true)}
                                onBlur={() => setisFocused3(false)}
                                backround={colors.card}
                                onChangeText={(value) => setMobile(value)}
                                isFocused={isFocused3}
                                inputBorder
                                defaultValue=''
                            />
                        </View>
                        <View style={[GlobalStyleSheet.container, { padding: 0 }]}>
                            <Text style={[styles.title3, { color: '#8A8A8A' }]}>Referral Code (Optional)</Text>
                        </View>
                        <View style={{ marginBottom: 10, marginTop: 10 }}>
                            <Input
                                // keyboardType="numeric"
                                onFocus={() => setisFocused4(true)}
                                onBlur={() => setisFocused4(false)}
                                backround={colors.card}
                                onChangeText={(value) => setReferralCode(value)}
                                isFocused={isFocused4}
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
                                    color={'#606060'}
                                    onPress={sentOtp}
                                    style={{ borderRadius: 52 }}
                                /> : <ActivityIndicator size={70} color={COLORS.primary} />

                        }
                        <View style={{ marginTop: 10 }}>
                            <Text style={[styles.title2, { color: theme.dark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)', textAlign: 'center' }]}>By tapping “Sign Up” you accept our <Text style={[styles.title1, { fontSize: 14, color: COLORS.primary }]}>terms</Text> and <Text style={[styles.title1, { fontSize: 14, color: COLORS.primary }]}>condition</Text></Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
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
    },
    imagebackground: {
        height: 46,
        width: 46,
        borderRadius: 50,
        backgroundColor: '#F6F6F6',
        alignItems: 'center',
        justifyContent: 'center',
    }
})

export default SignUp