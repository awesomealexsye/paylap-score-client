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
import { LedgerService } from '../../lib/LedgerService';

type LedgerAddCustomer = StackScreenProps<RootStackParamList, 'LedgerAddCustomer'>;

export const LedgerAddCustomer = ({ navigation }: LedgerAddCustomer) => {

    const theme = useTheme();
    const { colors }: { colors: any } = theme;
    const [isLoading, setIsLoading] = useState(false);
    const [customerDetail, setCustomerDetail] = useState<any>({});


    const addCustomer = async () => {
        if (customerDetail.name == '') {
            MessagesService.commonMessage("Name is required");
        } else if (customerDetail.mobile == '') {
            MessagesService.commonMessage("Mobile is required");
        } else {
            let addCustomerObj = LedgerService.addCustomer(customerDetail.name, customerDetail.mobile)

        }
        console.log("customerDetail", customerDetail);
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

                                    </View>

                                    <View style={GlobalStyleSheet.cardBody}>
                                        {isLoading === true ? <ActivityIndicator size={70} color={COLORS.primary} />
                                            : <Button title={"Add Customer"} onPress={() => { addCustomer() }} />}
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