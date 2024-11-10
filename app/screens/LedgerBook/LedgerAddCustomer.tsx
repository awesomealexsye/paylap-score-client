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
import { LedgerService } from '../../lib/LedgerService';
import { IMAGES } from '../../constants/Images';

type LedgerAddCustomer = StackScreenProps<RootStackParamList, 'LedgerAddCustomer'>;
let aadharDetail: any = {};
export const LedgerAddCustomer = ({ navigation }: LedgerAddCustomer) => {

    const theme = useTheme();
    const { colors }: { colors: any } = theme;

    const [isLoading, setIsLoading] = useState(false);

    const [name, setName] = useState("Send OTP");
    const [mobileNumber, setMobileNumber] = useState<any>({});


    const addCustomerInLedgerBook = async () => {

        setIsLoading(true);

        if (mobileNumber.length != 10) {
            MessagesService.commonMessage("Invalid Mobile Number");
            return;
        }

        const res = await ApiService.postWithToken("api/ledger-book/customer/add",
            { "mobile": mobileNumber, "name": name });

        if (res?.status === true) {
            console.log(res);
            MessagesService.commonMessage("Customer Added Successfully", "SUCCESS");
            navigation.navigate("LedgerMain");
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
                        <View style={[GlobalStyleSheet.container, { flex: 1, paddingTop: 10 }]}>
                            <View style={{ marginTop: 20, }}>
                                <View style={{ marginTop: 20 }}>
                                    <View style={{ marginBottom: 10, padding: 12 }}>
                                        <View style={{ marginBottom: 10 }}>
                                            <Input
                                                inputRounded
                                                icon={<FontAwesome style={{ opacity: .6 }} name={'user'} size={30} color={colors.text} />}
                                                placeholder="Enter Customer Name"
                                                onChangeText={(name) => setName(name)}
                                            />
                                        </View>
                                        <View>
                                            <Input
                                                inputRounded
                                                keyboardType={'number-pad'}
                                                icon={<FontAwesome style={{ opacity: .6 }} name={'mobile-phone'} size={35} color={colors.text} />}
                                                placeholder="Enter Customer Mobile number"
                                                onChangeText={(mobile) => setMobileNumber(mobile)}
                                            />
                                        </View>
                                    </View>
                                    <View style={GlobalStyleSheet.cardBody}>
                                        {isLoading === true ? <ActivityIndicator size={70} color={COLORS.primary} />
                                            : <Button
                                                color={colors.primary} title={"Add Customer"} onPress={addCustomerInLedgerBook} />}
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

export default LedgerAddCustomer;
