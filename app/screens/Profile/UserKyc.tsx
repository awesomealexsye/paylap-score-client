import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { ScrollView, View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { useNavigation, useTheme } from '@react-navigation/native';
import LoginSheet from '../../components/BottomSheet/LoginSheet';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import Header from '../../layout/Header';
import Input from '../../components/Input/Input';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import Button from '../../components/Button/Button';
import { MessagesService } from '../../lib/MessagesService';
import AadhaarOtp from './AadhaarOtp';
import { COLORS, FONTS } from '../../constants/theme';
import { ApiService } from '../../lib/ApiService';
import CommonService from '../../lib/CommonService';
import StorageService from '../../lib/StorageService';
import ButtonIcon from '../../components/Button/ButtonIcon';
type Props = {
    height?: string,
}


const UserKyc = forwardRef((props, ref) => {

    const theme = useTheme();
    const { colors }: { colors: any } = theme;
    const navigation = useNavigation<any>();
    const [buttonText, setButtonText] = useState("Send OTP");
    const [otp, setOtp] = useState("");
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [aadharDetail, setAadharDetail] = useState({ client_id: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [aadhar, setAadhar] = useState("");
    useEffect(() => {
        CommonService.currentUserDetail().then((res) => {
            if (res !== null) {
                if (res.aadhar_card !== "") {
                    navigation.navigate("Profile");
                    MessagesService.commonMessage("Aadhar is already up to date.");
                }
            }
        });
    }, []);

    const logOut = async () => {
        const is_logout = await StorageService.logOut();
        if (is_logout) {
            navigation.navigate("MobileSignIn");
        }
    }
    const sendOtp = async () => {
        if (buttonText === "Send OTP") {
            if (aadhar?.length != 12) {
                MessagesService.commonMessage("Invalid Aadhar Number");
                return;
            }
            setIsLoading(true);
            const res = await ApiService.postWithToken("api/kyc/aadhaar-otp-generate", { "aadhaar_number": aadhar });
            if (res !== null && res.status === true) {
                if (res?.data?.otp_sent) {
                    setAadharDetail(res.data);
                    setIsOtpSent(true);
                    setIsLoading(false);
                    setButtonText("Verify OTP");
                } else {
                    MessagesService.commonMessage(res?.message);
                }
            } else {
                setIsLoading(false);
            }
        } else if (buttonText === "Verify OTP") {
            setIsLoading(true);
            const res = await ApiService.postWithToken("api/kyc/aadhaar-otp-verify", { "client_id": aadharDetail?.client_id, "otp": otp });
            if (res !== null) {
                console.log("Verify", res)
                if (res?.status === true) {
                    setIsLoading(false);
                    setIsOtpSent(false);
                    MessagesService.commonMessage(res.message);
                    navigation.navigate("Profile");
                }
                else {
                    setIsLoading(false);
                }
            }
        }
    }

    return (
        <>

            <View style={{ flex: 1, backgroundColor: colors.background }}>
                <View style={{}}>
                    <Header
                        title={'Aadhar Kyc'}
                        leftIcon={'back'}
                        titleRight
                    />
                    <ScrollView>
                        <View style={styles.container}>
                            <ButtonIcon
                                title={"Logout"}
                                iconDirection="left"
                                text={COLORS.background}
                                color={COLORS.danger}
                                icon={<FontAwesome name='lock' size={22} color={COLORS.background} />}
                                // border={COLORS.card}
                                onPress={logOut}
                            />
                        </View>
                        <View style={[GlobalStyleSheet.container, { padding: 0, paddingTop: 10 }]}>
                            <View style={{ marginTop: 20, }}>
                                <View style={[GlobalStyleSheet.cardHeader, { borderBottomColor: COLORS.inputborder }]}>
                                    <Text style={{ ...FONTS.fontMedium, fontSize: 14, color: colors.title, textAlign: 'center' }}>Your Aadhaar Card</Text>
                                </View>
                                <View style={{ marginTop: 20 }}>
                                    <View style={{ marginBottom: 10 }}>
                                        <Input
                                            inputRounded
                                            icon={<FontAwesome style={{ opacity: .6 }} name={'address-card'} size={20} color={colors.text} />}
                                            placeholder="Your Aadhaar Card Number"
                                            onChangeText={(value) => setAadhar(value)}
                                        />
                                    </View>

                                    {isOtpSent &&
                                        <View style={{ marginBottom: 10 }}>
                                            <Input
                                                keyboardType="numeric"
                                                inputRounded
                                                icon={<FontAwesome style={{ opacity: .6 }} name={'address-card'} size={20} color={colors.text} />}
                                                placeholder="Your Aadhaar OTP"
                                                onChangeText={(value) => setOtp(value)}
                                            />
                                        </View>
                                    }

                                    <View style={GlobalStyleSheet.cardBody}>
                                        {isLoading === true ? <ActivityIndicator size={70} color={COLORS.primary} />
                                            : <Button title={buttonText} onPress={() => { sendOtp() }} />
                                        }
                                    </View>

                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </>
    );
});

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        // paddingTop: 20, // Padding to ensure it's not too close to the top of the screen
    },
    topLeftButton: {
        alignSelf: 'flex-end', // Aligns the button to the left
        padding: 20
    },
});



export default UserKyc;