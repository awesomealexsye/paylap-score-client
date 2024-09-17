import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { ScrollView, View, Text } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { useTheme } from '@react-navigation/native';
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
type Props = {
    height?: string,
}


const UserKyc = forwardRef((props, ref) => {

    const theme = useTheme();
    const { colors }: { colors: any } = theme;

    const refRBSheet = useRef<any>(null);
    const [isSheet, setIsSheet] = useState(false);
    const [aadhaar, setAadhaar] = useState("");
    const CallAadharApi = async () => {
        ApiService.postWithToken("api/kyc/aadhaar-otp-generate", { "aadhaar_number": aadhaar }).then((res: any) => {
            //setProfile(res);
        });
    };
    useImperativeHandle(ref, () => ({

        openSheet: async (value: string) => {
            await refRBSheet.current.open();
        },
        closeSheet() {
            refRBSheet.current.close();
        }

    }));

    const handleSheet = async () => {
        await refRBSheet.current.open();
    }
    const sendOtp = () => {
        console.log(aadhaar)
        if (aadhaar.length != 12) {
            MessagesService.commonMessage("Invalid Aadhaar Number")
        } else {
            handleSheet();
        }

    }

    return (
        <>
            <RBSheet
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
                {<AadhaarOtp value={aadhaar} sheetRef={refRBSheet} />}

            </RBSheet>

            <View style={{ flex: 1, backgroundColor: colors.background }}>
                <View style={{}}>
                    <Header
                        title={'User Kyc'}
                        leftIcon={'back'}
                        titleRight
                    />
                    <ScrollView>
                        <View style={[GlobalStyleSheet.container, { padding: 0, paddingTop: 10 }]}>
                            <View style={{ marginTop: 20, }}>
                                <View style={[GlobalStyleSheet.cardHeader, { borderBottomColor: COLORS.inputborder }]}>
                                    <Text style={{ ...FONTS.fontMedium, fontSize: 14, color: colors.title, textAlign: 'center' }}>Your Aadhaar Card Number</Text>
                                </View>
                                <View style={{ marginTop: 20 }}>
                                    <View style={{ marginBottom: 10 }}>
                                        <Input
                                            inputRounded
                                            icon={<FontAwesome style={{ opacity: .6 }} name={'address-card'} size={20} color={colors.text} />}
                                            placeholder="Your Aadhaar Card Number"
                                            onChangeText={(value) => setAadhaar(value)}
                                        />
                                    </View>

                                    <View style={GlobalStyleSheet.cardBody}>
                                        <Button title={'Sent OTP'} onPress={() => { sendOtp() }} />

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

export default UserKyc;