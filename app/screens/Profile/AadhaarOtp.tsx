import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import { COLORS, FONTS } from '../../constants/theme';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import { MessagesService } from '../../lib/MessagesService';
import { ApiService } from '../../lib/ApiService';

type Props = {
    sheetRef: any;
    client_id?: string;
    customer_id?: string;
}

const AadhaarOtp = ({ sheetRef, client_id, customer_id }: Props) => {

    const theme = useTheme();
    const { colors }: { colors: any } = theme;
    const [otp, setOtp] = useState("");

    const [addharVarificationDetail, setAddharVarificationDetail] = useState<any>({});

    const verifyOtp = () => {
        if (otp.length == 6) {
            ApiService.postWithToken("api/shopkeeper/verify-otp-customer", { "client_id": client_id, "customer_id": customer_id, "otp": otp }).then((res: any) => {
                setAddharVarificationDetail(res);
                console.log("verify otp", res)
            });
        } else {
            MessagesService.commonMessage("Invalid OTP");
        }
    }

    return (
        <View style={[GlobalStyleSheet.container, { padding: 0 }]}>
            <View style={[GlobalStyleSheet.container, { backgroundColor: theme.dark ? colors.background : colors.card }]}>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingBottom: 15,
                        marginBottom: 20,
                        borderBottomWidth: 1,
                        borderBottomColor: colors.border,
                    }}
                >
                    <Text style={{ flex: 1, ...FONTS.h6, color: colors.title }}>Verify OTP</Text>
                    <TouchableOpacity
                        onPress={() => sheetRef.current.close()}
                        style={{
                            height: 32,
                            width: 32,
                            borderRadius: 32,
                            backgroundColor: colors.background,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {/* <FeatherIcon size={20} color={colors.title} name="x"/> */}
                        <Feather size={20} color={colors.title} name="x" />
                    </TouchableOpacity>
                </View>
                <View style={{ marginBottom: 15 }}>
                    <Text style={{ ...FONTS.font, color: colors.title, marginBottom: 4 }}>Your OTP</Text>
                    <Input
                        //value={''}    
                        placeholder={'Enter OTP'}
                        onChangeText={(value) => setOtp(value)}
                    />
                </View>
                <Button
                    onPress={verifyOtp}
                    title={'Verify OTP'}
                    textColor={theme.dark ? COLORS.title : COLORS.card}
                    color={colors.title}
                />
            </View>
        </View>
    );
};



export default AadhaarOtp;