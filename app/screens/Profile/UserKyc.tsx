import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState, useCallback } from 'react';
import { ScrollView, View, Text, ActivityIndicator } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { useNavigation, useTheme, useFocusEffect } from '@react-navigation/native';
import LoginSheet from '../../components/BottomSheet/LoginSheet';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import Header from '../../layout/Header';
import Input from '../../components/Input/Input';
import { FontAwesome } from '@expo/vector-icons';
import Button from '../../components/Button/Button';
import { MessagesService } from '../../lib/MessagesService';
import AadhaarOtp from './AadhaarOtp';
import { COLORS, FONTS } from '../../constants/theme';
import { ApiService } from '../../lib/ApiService';
import CommonService from '../../lib/CommonService';
import useImagePicker from '../../customHooks/ImagePickerHook';
type Props = {
    height?: string,
}


const UserKyc = forwardRef((props, ref) => {
    const { image, pickImage, takePhoto }: any = useImagePicker();
    const theme = useTheme();
    const { colors }: { colors: any } = theme;
    const navigation = useNavigation<any>();
    const [buttonText, setButtonText] = useState("Send OTP");
    const [otp, setOtp] = useState("");
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [aadharDetail, setAadharDetail] = useState({ client_id: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [isAadharVerified, setIsAadharVerified] = useState(false);
    const [aadhar, setAadhar] = useState("");

    useFocusEffect(
        useCallback(() => {
            CommonService.currentUserDetail().then((res) => {
                if (res !== null) {
                    if (res.aadhar_card !== "") {
                        setIsAadharVerified(true);
                    }
                }
            });
        }, [])
    );
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
            }
        } else if (buttonText === "Verify OTP") {
            console.log("Otp", otp);
            const res = await ApiService.postWithToken("api/kyc/aadhaar-otp-verify", { "client_id": aadharDetail?.client_id, "otp": otp });
            if (res !== null) {
                console.log("Verify", res)
                if (res?.status === true) {
                    setIsLoading(false);
                    setIsOtpSent(false);
                    setIsAadharVerified(true);
                    MessagesService.commonMessage(res.message);
                    //MessagesService.commonMessage("Your Aadhar has been verified successfully.");
                }
                else {
                    setIsLoading(false);
                }
            }
        } else if (buttonText === "Update Details") {

        }
    }

    return (
        <>

            <View style={{ flex: 1, backgroundColor: colors.background }}>
                <View style={{}}>
                    <Header
                        title={'User Kyc'}
                        leftIcon={'back'}
                        titleRight
                    />
                    <ScrollView>
                        <View style={[GlobalStyleSheet.container, { padding: 0, paddingTop: 10 }]}>
                            {
                                isAadharVerified == false ?
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
                                    :
                                    <View style={{ marginTop: 20, }}>
                                        <View style={[GlobalStyleSheet.cardHeader, { borderBottomColor: COLORS.inputborder }]}>
                                            <Text style={{ ...FONTS.fontMedium, fontSize: 14, color: colors.title, textAlign: 'center' }}>Update your payment detail to reacieve payment</Text>
                                        </View>
                                        <View style={{ marginTop: 20 }}>
                                            <View style={{ marginBottom: 10 }}>
                                                <Input
                                                    inputRounded
                                                    icon={<FontAwesome style={{ opacity: .6 }} name={'address-card'} size={20} color={colors.text} />}
                                                    placeholder="Add UPI ID"
                                                    onChangeText={(value) => setAadhar(value)}
                                                />
                                            </View>
                                            {isOtpSent &&
                                                <View style={{ marginBottom: 10 }}>
                                                    <Input
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
                            }
                        </View>
                    </ScrollView>
                </View>
            </View>
        </>
    );
});

export default UserKyc;