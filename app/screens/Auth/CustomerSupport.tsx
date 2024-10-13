import { View, Text, SafeAreaView, ScrollView, StyleSheet, Linking, TouchableOpacity, Image, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { COLORS, FONTS } from '../../constants/theme';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { useTheme } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import CommonService from '../../lib/CommonService';
import Header from '../../layout/Header';
import MaterialCommunityIcons from '@expo/vector-icons/build/MaterialCommunityIcons';

type CustomerSupportScreenProps = StackScreenProps<RootStackParamList, 'CustomerSupport'>;

type SupportObject = {
    PHONE_NUMBER: string;
    WHATSAPP_NUMBER: string;
    EMAIL: string;
    WEBSITE: string;
};

const CustomerSupport = ({ navigation }: CustomerSupportScreenProps) => {
    const theme = useTheme();
    const { colors }: { colors: any } = theme;





    const [supportObject, setSupportObject] = useState<SupportObject>({
        PHONE_NUMBER: "",
        WHATSAPP_NUMBER: "",
        EMAIL: "",
        WEBSITE: "",
    });

    useEffect(() => {
        CommonService.getAppSettings(["CUSTOMER_SUPPORT_INFO"]).then((res) => {
            if (res.data) {
                let valueJSON = res.data?.value;
                let valueObj: SupportObject = JSON.parse(valueJSON);
                setSupportObject(valueObj);
            }
        });
    }, []);







    const handlePhonePress = (number: string) => {
        Linking.openURL(`tel:${number}`);
    };

    const handleEmailPress = (email: string) => {
        Linking.openURL(`mailto:${email}`);
    };

    const handleWhatsAppPress = (number: string) => {
        Linking.openURL(`https://wa.me/${number}`);
    };

    const handleWebsitePress = (url: string) => {
        Linking.openURL(url);
    };

    const supportOptions = [
        { type: 'mobile', icon: 'phone', iconColor: '#007bff', label: 'Mobile Number', value: `${supportObject?.PHONE_NUMBER || "8228822825"}` },
        { type: 'whatsapp', icon: 'whatsapp', iconColor: '#25D366', label: 'WhatsApp Number', value: `${supportObject?.WHATSAPP_NUMBER || "8228822825"}` },
        { type: 'supportMail', icon: 'email', iconColor: '#007bff', label: 'Support Mail', value: `${supportObject?.EMAIL || "paylapscore.com"}` },

        { type: 'website', icon: 'web', iconColor: '#007bff', label: 'Website', value: `${supportObject?.WEBSITE || "paylapscore.com"}` },
    ];


    const handlePress = (type: any) => {
        switch (type) {
            case 'mobile':
                Linking.openURL('tel:+1234567890').catch((err) => Alert.alert('Error', 'Unable to make a call'));
                break;
            case 'whatsapp':
                const whatsappURL = `https://wa.me/ ${supportObject?.WHATSAPP_NUMBER || "8228822825"}`;
                Linking.canOpenURL(whatsappURL)
                    .then((supported) => {
                        if (!supported) {
                            Alert.alert('WhatsApp is not installed', 'Please install WhatsApp to contact us.');
                        } else {
                            return Linking.openURL(whatsappURL);
                        }
                    })
                    .catch((err) => Alert.alert('Error', 'Unable to open WhatsApp'));
                break;
            case 'supportMail':
                Linking.openURL('mailto:support@[appname].com').catch((err) => Alert.alert('Error', 'Unable to send email'));
                break;

            case 'website':
                Linking.openURL(`https://${supportObject?.WEBSITE || "paylapscore.com"}`).catch((err) => Alert.alert('Error', 'Unable to send email'));
                break;
            default:
                break;
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.card }}>
            <Header
                title={"Customer Support"}
                leftIcon='back'
                titleRight
            />
            <ScrollView style={{
                flex: 1,
                padding: 20,
                backgroundColor: colors.background,
            }}>

                {supportOptions.map((option, index) => (
                    <TouchableOpacity key={index} style={{
                        backgroundColor: colors.card,
                        borderRadius: 10,
                        padding: 15,
                        marginBottom: 15,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 5,
                        elevation: 3,
                    }} onPress={() => {
                        if (option.type == "mobile") {
                            handlePhonePress(supportObject.PHONE_NUMBER)
                        } else if (option.type == "supportMail") {
                            handleEmailPress(supportObject.EMAIL)
                        } else if (option.type == "whatsapp") {
                            handleWhatsAppPress(supportObject.WHATSAPP_NUMBER)
                        } else if (option.type == "website") {
                            handleWebsitePress(supportObject.WEBSITE)
                        } else {
                            handleWebsitePress(supportObject.WEBSITE)
                        }
                    }
                    }>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>

                            <MaterialCommunityIcons name={option.icon} color={colors.primary} size={24} style={{ marginRight: 15, }} />
                            <View>
                                <Text style={{
                                    ...FONTS.fontSemiBold
                                    ,
                                    color: colors.title,
                                }}>{option.label}</Text>
                                <Text style={{
                                    ...FONTS.fontSemiBold
                                    ,
                                    color: colors.title,
                                }}>{option.value}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>

        </SafeAreaView>
    );
};


export default CustomerSupport;
