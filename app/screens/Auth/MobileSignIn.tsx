import { View, Text, SafeAreaView, TouchableOpacity, Image, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState } from 'react';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { useTheme } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import Input from '../../components/Input/Input';
import { IMAGES } from '../../constants/Images';
import Button from '../../components/Button/Button';
import { ApiService } from '../../lib/ApiService';
import { MessagesService } from '../../lib/MessagesService';
import StorageService from '../../lib/StorageService';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';

type SingInScreenProps = StackScreenProps<RootStackParamList, 'MobileSignIn'>;

const MobileSignIn = ({ navigation }: SingInScreenProps) => {

    // Redirect to home if already logged in
    StorageService.isLoggedIn().then((is_login) => {
        if (is_login) {
            navigation.replace("DrawerNavigation", { screen: 'Home' });
        }
    });

    const theme = useTheme();
    const { colors }: { colors: any } = theme;

    const { t } = useTranslation();

    const [isLoading, setIsLoading] = useState(false);
    const [isFocused, setisFocused] = useState(false);
    const [mobile, setMobile] = useState("");

    const sentOtp = async () => {
        if (mobile.length === 10) {
            setIsLoading(true);
            const res: any = await ApiService.postWithoutToken("api/auth/login", { mobile: mobile });
            if (res != null) {
                if (res.status) {
                    navigation.navigate("OtpVerify", { mobile: mobile });
                }
                MessagesService.commonMessage(res.message, "SUCCESS");
            }
        } else {
            MessagesService.commonMessage("Invalid Mobile Number");
        }
        setIsLoading(false);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.card }}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps='handled'
                >
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
                            <View style={{
                                flex: 1.5,
                                alignItems: 'center',
                                marginTop: 20
                            }}>
                                <Image
                                    source={IMAGES.appnamedark}
                                    style={{
                                        height: 110,
                                        width: 150,
                                        objectFit: "contain",
                                    }}
                                />
                                <Text style={{
                                    ...FONTS.fontBold,
                                    fontSize: SIZES.font,
                                    color: COLORS.background,
                                    marginTop: 10,
                                }}>{t('welcome')}!</Text>
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
                            <View style={[GlobalStyleSheet.container, { padding: 0 }]}>
                                <Text style={{
                                    color: colors.title, ...FONTS.fontMedium,
                                    fontSize: SIZES.font,
                                }}>{t('mobileNumber')}</Text>
                            </View>
                            <View style={{ marginVertical: 10 }}>
                                <Input
                                    maxlength={10}
                                    keyboardType="numeric"
                                    onFocus={() => setisFocused(true)}
                                    onBlur={() => setisFocused(false)}
                                    onChangeText={(e) => setMobile(e)}
                                    isFocused={isFocused}
                                    defaultValue=''
                                    backround
                                />
                            </View>

                            {/* Login Button */}
                            <View style={{ marginTop: 30 }}>
                                {
                                    !isLoading ?
                                        <Button
                                            title={t('sendOtp')}
                                            onPress={sentOtp}
                                            style={{ borderRadius: 15 }}
                                        /> : <ActivityIndicator color={COLORS.primary} size={70} />
                                }
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", margin: 40 }}>
                                <Text style={{ ...FONTS.fontMedium, color: colors.title }}>{t('registerDesc')}</Text>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('SignUp')}
                                >
                                    <Text style={{ ...FONTS.fontBold, color: COLORS.primary }}> {t('register')} </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </LinearGradient>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default MobileSignIn;
