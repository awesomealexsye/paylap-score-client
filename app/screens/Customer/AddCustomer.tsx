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
import { COLORS, FONTS } from '../../constants/theme';
import AadhaarOtp from '../Profile/AadhaarOtp';

type Props = {
    height?: string,
}


const AddCustomer = forwardRef((props, ref) => {

    const theme = useTheme();
    const { colors }: { colors: any } = theme;

    const refRBSheet = useRef<any>(null);

    const [isSheet, setIsSheet] = useState(false);
    const [aadhaar, setAadhaar] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
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
        if (mobileNumber.length != 10) {
            MessagesService.commonMessage("Invalid Mobile Number")
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
                {<AadhaarOtp value={aadhaar} mobileNumber={mobileNumber} sheetRef={refRBSheet} />}

            </RBSheet>

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
                                                onChangeText={(value) => setAadhaar(value)}
                                            />
                                        </View>
                                        <Input
                                            inputRounded
                                            icon={<FontAwesome style={{ opacity: .6 }} name={'mobile-phone'} size={35} color={colors.text} />}
                                            placeholder="Enter Customer Mobile number"
                                            onChangeText={(value) => setMobileNumber(value)}
                                        />
                                    </View>

                                    <View style={GlobalStyleSheet.cardBody}>
                                        <Button title={'Add Customer'} onPress={() => { sendOtp() }} />

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

export default AddCustomer;