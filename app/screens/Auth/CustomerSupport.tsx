import { View, Text, SafeAreaView, Image, ScrollView, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { COLORS, FONTS } from '../../constants/theme';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { useTheme } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import { IMAGES } from '../../constants/Images';
import CommonService from '../../lib/CommonService';
import Header from '../../layout/Header';


type CustomerSupportScreenProps = StackScreenProps<RootStackParamList, 'CustomerSupport'>;

const CustomerSupport = ({ navigation }: CustomerSupportScreenProps) => {

    const theme = useTheme();
    const { colors }: { colors: any } = theme;
    const [supportObject, setSupportObject] = useState({
        PHONE_NUMBER: null,
        WHATSAPP_NUMBER: null,
        EMAIL: null
    });
    useEffect(() => {
        CommonService.getAppSettings(["CUSTOMER_SUPPORT_INFO"]).then((res) => {
            if (res.data) {
                let valueJSON = res.data?.value;
                let valueObj = JSON.parse(valueJSON);
                setSupportObject(valueObj);
            }
        })
    }, [])

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.card, }}>
            <Header
                title={"Customer Support"}
                leftIcon='back'
                titleRight
            />
            <ScrollView style={{ flexGrow: 1, }} showsVerticalScrollIndicator={false}>
                <View style={[styles.companyDetailsContainer]}>
                    <View style={{ marginBottom: 30 }}>
                        <Text style={[styles.title1, { color: colors.title, textAlign: 'center' }]}>Customer Support</Text>
                        <Text style={[styles.title2, { color: colors.title, textAlign: 'center', marginBottom: 20 }]}>We're here to help you! Contact us using the details below.</Text>
                    </View>
                    <View>
                        <Text style={[styles.titleKey, { color: colors.title }]}>Phone Number</Text>
                        <Text style={[styles.companyDetail, { color: colors.title }]}>{supportObject?.PHONE_NUMBER || "8228822825"}</Text>
                        <Text style={[styles.titleKey, { color: colors.title }]}>WhatsApp Number</Text>
                        <Text style={[styles.companyDetail, { color: colors.title }]}>{supportObject?.WHATSAPP_NUMBER || "8228822825"}</Text>
                        <Text style={[styles.titleKey, { color: colors.title }]}>Support Email</Text>
                        <Text style={[styles.companyDetail, { color: colors.title }]}>{supportObject?.EMAIL || "support@paylapscore.com"}</Text>
                        <Text style={[styles.titleKey, { color: colors.title }]}>Website</Text>
                        <Text style={[styles.companyDetail, { color: colors.title }]}>paylapscore.com</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    title1: {
        ...FONTS.fontSemiBold,
        fontSize: 28,
        color: COLORS.title,
        marginBottom: 15,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 2, height: 3 },
        textShadowRadius: 4,
    },
    title2: {
        ...FONTS.fontRegular,
        fontSize: 18,
        color: COLORS.title,
    },
    companyDetailsContainer: {
        backgroundColor: '#f7f7f7',
        padding: 30,
        borderRadius: 25,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        margin: 20,
    },
    titleKey: {
        ...FONTS.fontSemiBold,
        fontSize: 22,
        marginTop: 20,
        color: COLORS.primary,
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 1, height: 2 },
        textShadowRadius: 3,
    },
    companyDetail: {
        ...FONTS.fontMedium,
        fontSize: 19,
        marginBottom: 25,
        color: '#333',
        textShadowColor: 'rgba(0, 0, 0, 0.1)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    }
});

export default CustomerSupport;