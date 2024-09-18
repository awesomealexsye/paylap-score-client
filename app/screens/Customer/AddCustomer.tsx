import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { ScrollView, View, Text, ActivityIndicator } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { useTheme } from '@react-navigation/native';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import Header from '../../layout/Header';
import Input from '../../components/Input/Input';
import { FontAwesome } from '@expo/vector-icons';
import Button from '../../components/Button/Button';
import { MessagesService } from '../../lib/MessagesService';
import { COLORS, FONTS } from '../../constants/theme';
import AadhaarOtp from '../Profile/AadhaarOtp';
import { ApiService } from '../../lib/ApiService';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import { StackScreenProps } from '@react-navigation/stack';

type AddCustomerScreenProps = StackScreenProps<RootStackParamList, 'AddCustomer'>;

export const AddCustomer = ({ navigation }: AddCustomerScreenProps) => {

    const theme = useTheme();
    const { colors }: { colors: any } = theme;

    // const refRBSheet = useRef<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isOtpSent, setOtpSent] = useState(false);
    const [buttonText, setButtonText] = useState("Send OTP");
    const [customerDetail, setCustomerDetail] = useState<any>({ mobile: "9625442725", "aadhar": "123456789012", "name": "arbaz khan" });
    const [aadharDetail, setAadharDetail] = useState({});


    // useImperativeHandle(ref, () => ({

    //     openSheet: async (value: string) => {
    //         await refRBSheet.current.open();
    //     },
    //     closeSheet() {
    //         refRBSheet.current.close();
    //     }

    // }));

    // const handleSheet = async () => {
    //     await refRBSheet.current.open();
    // }
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
            // console.log("Customer Detail", customerDetail);
            setIsLoading(true);
            const res = await ApiService.postWithToken("api/shopkeeper/add-customer", { "aadhaar_number": customerDetail?.aadhar, "mobile": customerDetail?.mobile, "name": customerDetail?.name });
            if (res === null) {
                setIsLoading(false);
                return;
            }
            console.log("Aadhar 222", typeof (res), "status:", res.status);

            setAadharDetail(res);

            console.log("Aadhar response", res, "Aadhar Detail", aadharDetail);
            // if (aadharDetail.status === true) {
            //     if (aadharDetail?.data?.otp_sent) {
            //         setOtpSent(true);
            //         setButtonText("Verify Add Customer");
            //     } else {
            //         MessagesService.commonMessage(aadharDetail?.message);
            //     }
            // } else {
            //     MessagesService.commonMessage(aadharDetail?.message);
            // }
            // console.log("Aadhar Verification", res);
            setIsLoading(false);
            setOtpSent(false);
        } else if (buttonText === "Verify Add Customer") {
            // const res = await ApiService.postWithToken("api/shopkeeper/verify-otp-customer", { "client_id": aadharDetail?.client_id, "customer_id": aadharDetail?.customer_id, "otp": customerDetail?.otp });
            // if (res !== null) {
            //     if (res?.status === true) {
            //         navigation.navigate("Home");
            //     }
            // }
        }
    }

    return (
        <>
            {/* <RBSheet
                ref={refRBSheet}
                closeOnDragDown={true}
                height={300}
                openDuration={100}
                customStyles={{
                    container: {
                        backgroundColor: theme.dark ? colors.background : colors.cardBg,
                    },
                    draggableIcon: {
                        marginTop: 10,
                        marginBottom: 5,
                        height: 5,
                        width: 80,
                        backgroundColor: colors.border,
                    }
                }}
            >
                <AadhaarOtp client_id={aadharDetail?.data?.client_id} customer_id={aadharDetail?.data?.customer_id} sheetRef={refRBSheet} />
            </RBSheet> */}

            <View style={{ flex: 1, backgroundColor: colors.background }}>
                <View style={{}}>
                    <Header
                        title={'Add Customer'}
                        leftIcon={'back'}
                        titleRight
                    />
                    <ScrollView>
                        <View style={[GlobalStyleSheet.container, { padding: 0, paddingTop: 10 }]}>
                            <View style={{ marginTop: 20, }}>
                                {/* <View style={[GlobalStyleSheet.cardHeader, { borderBottomColor: COLORS.inputborder }]}>
                                    <Text style={{ ...FONTS.fontMedium, fontSize: 14, color: colors.title, textAlign: 'center' }}>Your Aadhaar Card Number</Text>
                                </View> */}
                                <View style={{ marginTop: 20 }}>
                                    <View style={{ marginBottom: 10, padding: 12 }}>
                                        <View style={{ marginBottom: 10 }}>
                                            <Input
                                                inputRounded
                                                icon={<FontAwesome style={{ opacity: .6 }} name={'user'} size={30} color={colors.text} />}
                                                placeholder="Enter Customer Name"
                                                defaultValue='ajay sharm'
                                                onChangeText={(name) => setCustomerDetail({ ...customerDetail, name: name })}
                                            />
                                        </View>

                                        <View>
                                            <Input
                                                inputRounded
                                                icon={<FontAwesome style={{ opacity: .6 }} name={'mobile-phone'} size={35} color={colors.text} />}
                                                placeholder="Enter Customer Mobile number"
                                                value='9625442725'
                                                onChangeText={(mobile) => setCustomerDetail({ ...customerDetail, mobile: mobile })}
                                            />
                                        </View>

                                        <View style={{ marginTop: 10 }}>
                                            <Input
                                                inputRounded
                                                icon={<FontAwesome style={{ opacity: .6 }} name={'user'} size={30} color={colors.text} />}
                                                placeholder="Enter Aadhaar Number"
                                                defaultValue='123412341234'
                                                onChangeText={(aadhar) => setCustomerDetail({ ...customerDetail, aadhar: aadhar })}
                                            />
                                        </View>

                                        {isOtpSent &&
                                            <View style={{ marginTop: 10 }}>
                                                <Input
                                                    inputRounded
                                                    icon={<FontAwesome style={{ opacity: .6 }} name={'user-secret'} size={30} color={colors.text} />}
                                                    placeholder="Enter OTP"
                                                    onChangeText={(otp) => setCustomerDetail({ ...otp })}
                                                />
                                            </View>
                                        }

                                    </View>

                                    <View style={GlobalStyleSheet.cardBody}>
                                        {isLoading && <ActivityIndicator size="large" color={COLORS.primary} />}
                                        <Button title={buttonText} onPress={() => { sendOtp() }} />
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