import React, { useState } from 'react';
import { Text, TouchableOpacity, View, Modal, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme, useNavigation } from '@react-navigation/native';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import Button from '../Button/Button';
import Input from '../Input/Input';
import { ApiService } from '../../lib/ApiService';
import { MessagesService } from '../../lib/MessagesService';
import StorageService from '../../lib/StorageService';

type Props = {
    close: any;
    modalVisible: boolean
}

const AccountDeleteModal = ({ close, modalVisible }: Props) => {

    const theme = useTheme();
    const { colors }: { colors: any } = theme;

    const [isOTPSent, setIsOTPSent] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [otp, setOTP] = useState('')
    const navigation = useNavigation<any>();

    const ResetStateValue = () => {
        setIsOTPSent(false);
        setOTP('');
    }
    const SendOTP = () => {
        setIsLoading(true);
        ApiService.postWithToken("api/user/sent-otp", {}).then((res: any) => {
            MessagesService.commonMessage(res?.message);
            if (res?.status == true) {
                setIsOTPSent(true);
            }
            setIsLoading(false);
        });
    }
    const ConfirmOTP = async () => {
        setIsLoading(true);
        ApiService.postWithToken("api/user/delete", { otp }).then((res: any) => {
            MessagesService.commonMessage(res?.message);
            if (res?.status == true) {
                console.log('Account deleted success');

                StorageService.logOut().then((is_logout) => {
                    if (is_logout) {
                        console.log('Account logout success');

                        navigation.navigate("MobileSignIn");
                    }
                })
            }
            setIsLoading(false);
        });
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
        >
            <View
                style={{
                    width: '100%',
                    borderRadius: SIZES.radius,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 1
                }}
            >
                <View
                    style={{
                        backgroundColor: theme.dark ? colors.background : colors.card,
                        maxWidth: 330,
                        width: '100%',
                        paddingHorizontal: 20,
                        paddingVertical: 20,
                        borderRadius: SIZES.radius,
                        borderColor: 'black',
                        borderWidth: 1,
                    }}
                >
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
                        <Text style={{ flex: 1, ...FONTS.h6, color: colors.title }}>Delete Account</Text>
                        <TouchableOpacity
                            onPress={() => { close(false); ResetStateValue(); }}
                            style={{
                                height: 32,
                                width: 32,
                                borderRadius: 32,
                                backgroundColor: colors.background,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Feather size={20} color={colors.title} name="x" />
                        </TouchableOpacity>
                    </View>
                    {isOTPSent &&
                        <View style={{ marginBottom: 25 }}>
                            <Text style={{ ...FONTS.font, color: colors.title, marginBottom: 4 }}>Password</Text>
                            <Input
                                type="Text"
                                placeholder={'Enter OTP'}
                                value={otp}
                                onChangeText={(value) => setOTP(value)}
                            />
                        </View>
                    }
                    {
                        isLoading ? <ActivityIndicator size={'large'} /> :
                            <Button
                                onPress={!isOTPSent ? SendOTP : ConfirmOTP}
                                title={!isOTPSent ? 'Send OTP' : 'Confirm OTP To Delete'}
                                textColor={theme.dark ? COLORS.title : COLORS.card}
                                color={colors.title}
                            />
                    }
                </View>
            </View>
        </Modal>
    );
};



export default AccountDeleteModal;