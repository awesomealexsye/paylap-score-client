import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { ScrollView, View, Text, ActivityIndicator } from 'react-native';
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

type AddCustomerScreenProps = StackScreenProps<RootStackParamList, 'AddCustomer'>;
let aadharDetail: any = {};

export const AddCustomer = ({ navigation }: AddCustomerScreenProps) => {

    const theme = useTheme();
    const { colors }: { colors: any } = theme;
    const [isLoading, setIsLoading] = useState(false);
    const [isOtpSent, setOtpSent] = useState(false);
    const [buttonText, setButtonText] = useState("Send OTP");
    const [customerDetail, setCustomerDetail] = useState<any>({});


    const sendOtp = async () => {
        if (buttonText === "Send OTP") {
            if (customerDetail?.mobile?.length != 10) {
                MessagesService.commonMessage("Invalid Mobile Number");
                return;
            }
            if (customerDetail?.aadhar?.length != 12) {
                MessagesService.commonMessage("Invalid Aadhar Number");
                return;
            }
            setIsLoading(true);
            const res = await ApiService.postWithToken("api/shopkeeper/add-customer", { "aadhaar_number": customerDetail?.aadhar, "mobile": customerDetail?.mobile, "name": customerDetail?.name });
            if (res === null) {
                setIsLoading(false);
                return;
            }
            aadharDetail = res;
            if (aadharDetail.status === true) {
                if (aadharDetail?.data?.otp_sent) {
                    setOtpSent(true);
                    setButtonText("Verify And Add Customer");
                } else {
                    MessagesService.commonMessage(aadharDetail?.message);
                }
            } else {
                MessagesService.commonMessage(aadharDetail?.message);
            }
            setIsLoading(false);
        } else if (buttonText === "Verify And Add Customer") {
            const res = await ApiService.postWithToken("api/shopkeeper/verify-otp-customer", { "client_id": aadharDetail?.data.client_id, "customer_id": aadharDetail?.customer_id, "otp": customerDetail?.otp });
            if (res !== null) {
                if (res?.status === true) {
                    setOtpSent(false);
                    MessagesService.commonMessage("Customer Added Successfully");
                    navigation.navigate("Home");
                }
            }
        }
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
                        <View style={[GlobalStyleSheet.container, { flex: 1, padding: 0, paddingTop: 10 }]}>
                            <View style={{ marginTop: 20, }}>
                                <View style={{ marginTop: 20 }}>
                                    <View style={{ marginBottom: 10, padding: 12 }}>
                                        <View style={{ marginBottom: 10 }}>
                                            <Input
                                                inputRounded
                                                icon={<FontAwesome style={{ opacity: .6 }} name={'user'} size={30} color={colors.text} />}
                                                placeholder="Enter Customer Name"
                                                onChangeText={(name) => setCustomerDetail({ ...customerDetail, "name": name })}
                                            />
                                        </View>

                                        <View>
                                            <Input
                                                inputRounded
                                                icon={<FontAwesome style={{ opacity: .6 }} name={'mobile-phone'} size={35} color={colors.text} />}
                                                placeholder="Enter Customer Mobile number"
                                                onChangeText={(mobile) => setCustomerDetail({ ...customerDetail, "mobile": mobile })}
                                            />
                                        </View>

                                        <View style={{ marginTop: 10 }}>
                                            <Input
                                                inputRounded
                                                icon={<FontAwesome style={{ opacity: .6 }} name={'user'} size={30} color={colors.text} />}
                                                placeholder="Enter Aadhaar Number"
                                                onChangeText={(aadhar) => setCustomerDetail({ ...customerDetail, "aadhar": aadhar })}
                                            />
                                        </View>

                                        {isOtpSent &&
                                            <View style={{ marginTop: 10 }}>
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
                                        {isLoading === true ? <ActivityIndicator size={70} color={COLORS.primary} />
                                            : <Button title={buttonText} onPress={() => { sendOtp() }} />}
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