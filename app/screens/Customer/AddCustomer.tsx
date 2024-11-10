import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { ScrollView, View, Text, ActivityIndicator, Image } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import Header from '../../layout/Header';
import Input from '../../components/Input/Input';
import { FontAwesome } from '@expo/vector-icons';
import Button from '../../components/Button/Button';
import { MessagesService } from '../../lib/MessagesService';
import { COLORS, FONTS } from '../../constants/theme';
import { ApiService } from '../../lib/ApiService';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import { StackScreenProps } from '@react-navigation/stack';
import { IMAGES } from '../../constants/Images';

type AddCustomerScreenProps = StackScreenProps<RootStackParamList, 'AddCustomer'>;
let aadharDetail: any = {};

export const AddCustomer = ({ navigation }: AddCustomerScreenProps) => {

    const theme = useTheme();
    const { colors }: { colors: any } = theme;
    const [isLoading, setIsLoading] = useState(false);
    const [isOtpSent, setOtpSent] = useState(false);
    const [isUserExist, setUserExist] = useState(false);
    const [isShowOtherFields, setShowOtherFields] = useState(false);
    const [customerId, setCustomerId] = useState(0);
    const [customerDetail, setCustomerDetail] = useState<any>({});

    const checkIsUserExist = async () => {
        const res = await ApiService.postWithToken("api/shopkeeper/search-user-mobile", { "mobile": customerDetail?.mobile });
        if (res.status) {
            setCustomerId(res?.data?.id);
            setUserExist(res.status);
        }
        return res.status;
    };
    const handleSendAadharOtp = () => {
        if (!isShowOtherFields) return;
        sendAadharOtp();
    };
    const sendAadharOtp = async () => {
        if (customerDetail.aadhar?.length !== 12) {  // Validate Aadhaar only when sending Aadhaar OTP
            MessagesService.commonMessage("Invalid Aadhaar Number");
            return;
        }
        setIsLoading(true);

        const res = await ApiService.postWithToken("api/shopkeeper/add-customer", {
            aadhaar_number: customerDetail.aadhar,
            mobile: customerDetail.mobile,
            name: customerDetail.name
        });

        setIsLoading(false);
        if (res?.status) {
            aadharDetail = res;
            setOtpSent(!!aadharDetail?.data?.otp_sent);
            if (!aadharDetail?.data?.otp_sent) MessagesService.commonMessage(aadharDetail.message);
        } else {
            MessagesService.commonMessage(aadharDetail.message);
        }
    };
    const handleSendOtp = () => {
        if (customerDetail?.mobile?.length != 10) {
            MessagesService.commonMessage("Invalid Mobile Number.");
            return;
        }
        setIsLoading(true);
        ApiService.postWithToken("api/shopkeeper/search-user-mobile", { "mobile": customerDetail?.mobile }).then((res) => {
            setIsLoading(false);
            if (!res?.app_message) {

                MessagesService.commonMessage(res.message, res.status ? "SUCCESS" : 'ERROR');
            }
            if (res.mode_type == "MOBILE_OTP") {
                setCustomerId(res?.data?.id);
                setUserExist(res.status);
                setOtpSent(true);
                // MessagesService.commonMessage("OTP has been sent to customer.", "SUCCESS");
            } else if (res.mode_type == "AADHAAR_OTP") {
                setShowOtherFields(true); // Shows fields only if the user does not exist
            } else {
                // MessagesService.commonMessage(res.message, "ERROR");

            }
        })

    }
    const handleVerifyOtp = async () => {
        if (customerDetail?.otp?.length != (isShowOtherFields ? 6 : 4)) {
            MessagesService.commonMessage("Please enter valid OTP.");
            return;
        }

        setIsLoading(true);
        const apiEndpoint = isUserExist ? "api/shopkeeper/verify-otp-mobile-customer" : "api/shopkeeper/verify-otp-customer";
        const data = isUserExist ?
            { customer_id: customerId, otp: customerDetail.otp } :
            { client_id: aadharDetail?.data.client_id, customer_id: aadharDetail?.customer_id, otp: customerDetail.otp };

        const res = await ApiService.postWithToken(apiEndpoint, data);
        if (res !== null) {
            if (res?.status) {
                setOtpSent(false);
                MessagesService.commonMessage("Customer Added Successfully", "SUCCESS");
                navigation.navigate("Home");
            } else {
                MessagesService.commonMessage(res?.message);
            }
        }
        setIsLoading(false);
    }

    return (
        <>
            <View style={{ flex: 1, backgroundColor: colors.background }}>
                <View style={{}}>
                    <Header
                        title={'Add Customer'}
                        leftIcon={'back'}
                        titleRight
                    />
                    <ScrollView>
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

                        <View style={[GlobalStyleSheet.container]}>
                            <View>
                                <View>
                                    <View style={{ marginBottom: 10, padding: 12 }}>
                                        <View style={{ marginBottom: 10 }}>
                                            <Input
                                                inputRounded
                                                keyboardType={'number-pad'}
                                                icon={<FontAwesome style={{ opacity: .6 }} name={'mobile-phone'} size={35} color={colors.text} />}
                                                placeholder="Mobile number"
                                                onChangeText={(mobile) => setCustomerDetail({ ...customerDetail, "mobile": mobile })}
                                            />
                                        </View>
                                        {isShowOtherFields &&
                                            <>
                                                <View style={{ marginBottom: 10 }}>
                                                    <Input
                                                        inputRounded
                                                        icon={<FontAwesome style={{ opacity: .6 }} name={'user'} size={30} color={colors.text} />}
                                                        placeholder="Name"
                                                        onChangeText={(name) => setCustomerDetail({ ...customerDetail, "name": name })}
                                                    />
                                                </View>
                                                <View style={{ marginBottom: 10 }}>
                                                    <Input
                                                        inputRounded
                                                        keyboardType={'number-pad'}
                                                        icon={<FontAwesome style={{ opacity: .6 }} name={'address-card'} size={30} color={colors.text} />}
                                                        placeholder="Aadhaar Number"
                                                        onChangeText={(aadhar) => setCustomerDetail({ ...customerDetail, "aadhar": aadhar })}
                                                    />
                                                </View>
                                            </>
                                        }
                                        {isOtpSent &&
                                            <View style={{ marginBottom: 10 }}>
                                                <Input
                                                    inputRounded
                                                    icon={<FontAwesome style={{ opacity: .6 }} name={'user-secret'} size={30} color={colors.text} />}
                                                    placeholder="Enter OTP"
                                                    onChangeText={(otp) => setCustomerDetail({ ...customerDetail, "otp": otp })}
                                                />
                                            </View>
                                        }
                                    </View>

                                    <View style={GlobalStyleSheet.cardBody}>
                                        {isLoading ? (
                                            <ActivityIndicator size="large" color={COLORS.primary} />
                                        ) : (
                                            <>
                                                {/* Button for Sending Mobile OTP */}
                                                {!isOtpSent && !isShowOtherFields && (
                                                    <Button
                                                        title="Send OTP"
                                                        onPress={handleSendOtp}
                                                    />
                                                )}

                                                {/* Button for Sending Aadhaar OTP - Shown if user does not exist */}
                                                {isShowOtherFields && !isOtpSent && (
                                                    <Button
                                                        title="Send Aadhaar OTP"
                                                        onPress={handleSendAadharOtp}
                                                    />
                                                )}

                                                {/* Button for Verifying OTP */}
                                                {isOtpSent && (
                                                    <Button
                                                        title="Verify OTP"
                                                        onPress={handleVerifyOtp}
                                                    />
                                                )}
                                            </>
                                        )}
                                    </View>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </>
    );
}

export default AddCustomer;