import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, RefreshControl, ActivityIndicator } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { useDispatch, useSelector } from 'react-redux';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import { ApiService } from '../../lib/ApiService';
// import { MessagesService } from '../../lib/MessagesService';
import { useTranslation } from 'react-i18next';
import Header from '../../layout/Header';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import Divider from '../../components/Dividers/Divider';
import { MessagesService } from '../../lib/MessagesService';

interface Customer {
    id: string;
    customer_id: string;
    name: string;
    mobile: string;
    amount: string;
    joined_at: string;
    latest_updated_at: string;
    transaction_type: string;
    profile_image: any;
}



type AddCompanyProps = StackScreenProps<RootStackParamList, 'AddCompany'>

export const AddCompany = ({ navigation }: AddCompanyProps) => {
    const { t } = useTranslation();

    const [isLoading, setIsLoading] = useState<any>(false);
    const [isRefreshing, setIsRefreshing] = useState<any>(false);


    const [companyName, setCompanyName] = useState('');
    const [address, setAdress] = useState('');
    const [zipcode, setZipcode] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [gst, setGst] = useState('');
    const [phone, setPhone] = useState('');
    const [website, setWebsite] = useState('');
    const [email, setEmail] = useState('');
    const [invoiceInit, setInvoiceInit] = useState('1000');


    const handelRefresh = async () => {
        setIsRefreshing(true);
        // await fetchCustomerList();
        setIsRefreshing(false);
    };

    const handleFormSubmission = () => {
        if (companyName == '') {
            MessagesService.commonMessage("Company Name is required");
        } else if (address == '') {
            MessagesService.commonMessage("Address is required");
        } else if (zipcode == '') {
            MessagesService.commonMessage("Zipcode is required");
        } else if (city == '') {
            MessagesService.commonMessage("City is required");
        } else if (state == '') {
            MessagesService.commonMessage("State is required");
        } else if (phone.length != 10) {
            MessagesService.commonMessage("Invalid Phone Number");
        } else if (email == '') {
            MessagesService.commonMessage("Email is required");
        } else {
            ApiService.postWithToken("api/invoice-generator/companies/add", {
                name: companyName,
                company_address: companyName,
                zipcode: zipcode,
                city: city,
                state: state,
                gst: phone,
                phone: phone,
                email: email,
                website: website,
                invoice_init_number: invoiceInit,
            }).then((res) => {
                MessagesService.commonMessage(res.message, res.status ? "SUCCESS" : "ERROR");
                if (res.status) {
                    navigation.navigate("ListCompany");
                }

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
                title={t('AddCompany')}
                leftIcon={'back'}
                titleRight
            />
            {/* AppBar End */}


            < ScrollView showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={isRefreshing} onRefresh={handelRefresh} />
                }
            >
                <View style={[GlobalStyleSheet.container]}>
                    <View style={{ marginTop: 10 }}>
                        <Input
                            inputRounded
                            placeholder={t('companyName')}
                            value={companyName}
                            onChangeText={setCompanyName}
                            maxlength={20}
                        />
                    </View>
                    <View style={{ marginTop: 10 }}>
                        <Divider dashed color={COLORS.primary} />
                        <Text style={{ textAlign: 'center' }}>Address</Text>
                        <Input
                            inputRounded
                            placeholder={t('companyAddress')}
                            value={address}
                            onChangeText={setAdress}
                            maxlength={20}
                        />
                        {/* </View>
                    <View style={{ marginTop: 10 }}> */}
                        <Input
                            inputRounded
                            placeholder={t('zipcode')}
                            value={zipcode}
                            onChangeText={setZipcode}
                            maxlength={20}
                            keyboardType={'number-pad'}

                        />
                        {/* </View>
                    <View style={{ marginTop: 10 }}> */}
                        <Input
                            inputRounded
                            placeholder={t('city')}
                            value={city}
                            onChangeText={setCity}
                            maxlength={20}
                        />
                        {/* </View>
                    <View style={{ marginTop: 10 }}> */}
                        <Input
                            inputRounded
                            placeholder={t('state')}
                            value={state}
                            onChangeText={setState}
                            maxlength={25}
                        />
                        <Divider dashed color={COLORS.primary} />

                    </View>
                    <View style={{ marginTop: 20 }}>
                        <Input
                            inputRounded
                            placeholder={t('gst')}
                            value={gst}
                            onChangeText={setGst}
                            maxlength={25}
                        />
                    </View>
                    <View style={{ marginTop: 20 }}>
                        <Input
                            inputRounded
                            placeholder={t('phone')}
                            value={phone}
                            onChangeText={setPhone}
                            maxlength={25}
                            keyboardType={'number-pad'}

                        />
                    </View>
                    <View style={{ marginTop: 20 }}>
                        <Input
                            inputRounded
                            placeholder={t('website')}
                            value={website}
                            onChangeText={setWebsite}
                            maxlength={25}
                        />
                    </View>
                    <View style={{ marginTop: 10 }}>
                        <Input
                            inputRounded
                            placeholder={t('email')}
                            value={email}
                            onChangeText={setEmail}
                            maxlength={25}
                        />
                    </View>
                    {/* 
                    <View style={{ marginTop: 10 }}>
                        <Input
                            inputRounded
                            placeholder={t('invoiceInitiateNumber')}
                            value={invoiceInit}
                            onChangeText={setInvoiceInit}
                            maxlength={25}
                            defaultValue='1000'
                        />
                    </View> */}

                    <View style={{ marginTop: 12 }}>

                        {
                            isLoading === false ?
                                <Button title={t('addCompany')} onPress={handleFormSubmission} /> : <ActivityIndicator size={70} color={COLORS.primary} />
                        }
                    </View>

                </View>
            </ScrollView >
        </View >
    );
};

const styles = StyleSheet.create({

    notifactioncricle: {
        height: 16,
        width: 16,
        borderRadius: 15,
        backgroundColor: COLORS.card,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 2,
        right: 2
    },

    TextInput: {
        ...FONTS.fontRegular,
        fontSize: SIZES.font,
        color: COLORS.title,
        height: 60,
        borderRadius: 15,
        paddingHorizontal: 10,
        paddingLeft: 30,
        marginBottom: 10

    },

    customerItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 15,
        // shadowOffset: {
        //     width: 0,
        //     height: 15,
        // },
        // shadowOpacity: 0.34,
        shadowRadius: 31.27,
        marginHorizontal: 10,
        // marginVertical: 4,
        top: 4,
        borderBottomColor: "black",
        borderBottomWidth: 0.2
    },

    addButton: {
        position: 'absolute', // Fixes the button at a particular position
        bottom: 35, // 30px from the bottom
        right: 20, // 20px from the right
        backgroundColor: COLORS.primary, // Matches the button's background color from CSS
        padding: 15, // 15px padding around the button content
        borderRadius: 50, // Circular button
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,  // Shadow for Android
        shadowColor: '#000',  // Shadow for iOS
        shadowOffset: { width: 0, height: 4 },  // Shadow offset for iOS
        shadowOpacity: 0.2,  // Shadow opacity for iOS
        shadowRadius: 8,
        flexDirection: 'row'
        // Shadow blur radius for iOS

    },
    addButtonText: {
        color: COLORS.white,
        fontSize: SIZES.font,
        fontWeight: 'bold',
    },
})

export default AddCompany;

