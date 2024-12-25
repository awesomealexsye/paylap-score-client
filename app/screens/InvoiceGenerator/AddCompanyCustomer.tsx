import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl, ActivityIndicator } from 'react-native';
import { useFocusEffect, useTheme } from '@react-navigation/native';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { FontAwesome } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import { ApiService } from '../../lib/ApiService';
// import { MessagesService } from '../../lib/MessagesService';
import { useTranslation } from 'react-i18next';
import Header from '../../layout/Header';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import ButtonIcon from '../../components/Button/ButtonIcon';
import { MessagesService } from '../../lib/MessagesService';

type AddCompanyCustomerProps = StackScreenProps<RootStackParamList, 'AddCompanyCustomer'>

export const AddCompanyCustomer = ({ navigation, route }: AddCompanyCustomerProps) => {
    const { t } = useTranslation();
    const items = route.params.items;
    const company_id = route.params.data.company_id;

    const [isLoading, setIsLoading] = useState<any>(false);

    const [customerName, setCustomerName] = useState('');
    const [address, setAdress] = useState('');
    const [zipcode, setZipcode] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');




    const handleFormSubmission = () => {
        if (!customerName) {
            MessagesService.commonMessage("Customer Name is Required.", "ERROR")
        } else if (!phone) {
            MessagesService.commonMessage("Phone is required.", "ERROR")
        } else if (!address) {
            MessagesService.commonMessage("Address is required.", "ERROR")
        } else if (!zipcode) {
            MessagesService.commonMessage("Zipcode is required.", "ERROR")
        } else if (!city) {
            MessagesService.commonMessage("City is required.", "ERROR")
        } else if (!state) {
            MessagesService.commonMessage("State is required.", "ERROR")
        }
        else {
            const data = {
                name: customerName,
                phone: phone,
                address: address,
                zipcode: zipcode,
                city: city,
                state: state,
                email: email,
                company_id: company_id
            }
            // console.log(data)
            setIsLoading(true);
            ApiService.postWithToken("api/invoice-generator/customer/add", data).then((res) => {
                if (res.status) {
                    navigation.goBack();
                } else {
                    MessagesService.commonMessage(res.message, "ERROR");
                }

                setIsLoading(false);
            })
        }

    };


    const dispatch = useDispatch();

    const theme = useTheme();
    const { colors }: { colors: any; } = theme;


    return (
        <View style={{ backgroundColor: colors.card, flex: 1 }}>
            {/* AppBar Start */}
            <Header
                title={t('addCustomerDetail')}
                leftIcon={'back'}
                titleRight
            />
            {/* AppBar End */}


            < ScrollView showsVerticalScrollIndicator={false}
            >
                <View style={[GlobalStyleSheet.container]}>
                    <View style={{ marginTop: 10, gap: 10 }}>
                        <Input
                            inputRounded
                            placeholder={t('customerName')}
                            value={customerName}
                            onChangeText={setCustomerName}
                            maxlength={60}
                        />
                        <Input
                            inputRounded
                            placeholder={t('phone')}
                            value={phone}
                            onChangeText={setPhone}
                            maxlength={10}
                        />
                        <Input
                            inputRounded
                            placeholder={t('email')}
                            value={email}
                            onChangeText={setEmail}
                            maxlength={50}
                        />
                        <Input
                            inputRounded
                            placeholder={t('address')}
                            value={address}
                            onChangeText={setAdress}
                            maxlength={150}
                        />
                        {/* </View>
                    <View style={{ marginTop: 10 }}> */}
                        <Input
                            inputRounded
                            placeholder={t('zipcode')}
                            value={zipcode}
                            onChangeText={setZipcode}
                            maxlength={7}
                            keyboardType={'number-pad'}

                        />
                        {/* </View>
                    <View style={{ marginTop: 10 }}> */}
                        <Input
                            inputRounded
                            placeholder={t('city')}
                            value={city}
                            onChangeText={setCity}
                            maxlength={30}
                        />
                        {/* </View>
                    <View style={{ marginTop: 10 }}> */}
                        <Input
                            inputRounded
                            placeholder={t('state')}
                            value={state}
                            onChangeText={setState}
                            maxlength={30}
                        />
                    </View>




                    <View style={{ marginTop: 12 }}>

                        {
                            isLoading === false ?
                                <Button title={t('addCustomer')} onPress={handleFormSubmission} /> : <ActivityIndicator size={70} color={COLORS.primary} />
                        }
                    </View>

                </View>
            </ScrollView >
        </View >
    );
};

export default AddCompanyCustomer;

