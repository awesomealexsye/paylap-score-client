import { View, Text, SafeAreaView, ScrollView, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { COLORS, FONTS } from '../../constants/theme';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { useTheme } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import CommonService from '../../lib/CommonService';
import Header from '../../layout/Header';
import Icon from 'react-native-vector-icons/FontAwesome'; // Importing FontAwesome icons

type CustomerSupportScreenProps = StackScreenProps<RootStackParamList, 'CustomerSupport'>;

type SupportObject = {
    PHONE_NUMBER: string | null;
    WHATSAPP_NUMBER: string | null;
    EMAIL: string | null;
    WEBSITE: string | null;
};

const CustomerSupport = ({ navigation }: CustomerSupportScreenProps) => {
    const theme = useTheme();
    const { colors }: { colors: any } = theme;

    const [supportObject, setSupportObject] = useState<SupportObject>({
        PHONE_NUMBER: null,
        WHATSAPP_NUMBER: null,
        EMAIL: null,
        WEBSITE: null,
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
        if (!url.startsWith('http')) {
            url = `https://${url}`;
        }
        Linking.openURL(url);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.card }}>
            <Header
                title={"Customer Support"}
                leftIcon='back'
                titleRight
            />
            <ScrollView style={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
                <View style={[styles.companyDetailsContainer]}>
                    <View style={{ marginBottom: 30 }}>
                        <Text style={[styles.title2, { color: colors.title, textAlign: 'center', marginBottom: 20 }]}>We're here to help you! Contact us using the details below.</Text>
                    </View>
                    <View>
                        <Text style={[styles.titleKey, { color: colors.title }]}>Phone Number</Text>
                        <TouchableOpacity style={styles.button} onPress={() => handlePhonePress(supportObject?.PHONE_NUMBER || "8228822825")}>
                            <Icon name="phone" size={20} color="#fff" style={styles.buttonIcon} />
                            <Text style={styles.buttonText}>
                                {supportObject?.PHONE_NUMBER || "8228822825"}
                            </Text>
                        </TouchableOpacity>
                        <Text style={[styles.titleKey, { color: colors.title }]}>WhatsApp Number</Text>
                        <TouchableOpacity style={styles.button} onPress={() => handleWhatsAppPress(supportObject?.WHATSAPP_NUMBER || "8228822825")}>
                            <Icon name="whatsapp" size={20} color="#fff" style={styles.buttonIcon} />
                            <Text style={styles.buttonText}>
                                {supportObject?.WHATSAPP_NUMBER || "8228822825"}
                            </Text>
                        </TouchableOpacity>
                        <Text style={[styles.titleKey, { color: colors.title }]}>Support Email</Text>
                        <TouchableOpacity style={styles.button} onPress={() => handleEmailPress(supportObject?.EMAIL || "support@paylapscore.com")}>
                            <Icon name="envelope" size={20} color="#fff" style={styles.buttonIcon} />
                            <Text style={styles.buttonText}>
                                {supportObject?.EMAIL || "support@paylapscore.com"}
                            </Text>
                        </TouchableOpacity>
                        <Text style={[styles.titleKey, { color: colors.title }]}>Website</Text>
                        <TouchableOpacity style={styles.button} onPress={() => handleWebsitePress(supportObject?.WEBSITE || "paylapscore.com")}>
                            <Icon name="globe" size={20} color="#fff" style={styles.buttonIcon} />
                            <Text style={styles.buttonText}>
                                {supportObject?.WEBSITE || "paylapscore.com"}
                            </Text>
                        </TouchableOpacity>
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
    button: {
        backgroundColor: COLORS.primary,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginTop: 10,
        marginBottom: 25,
        alignItems: 'center',
        flexDirection: 'row',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    buttonIcon: {
        marginRight: 10,
    },
    buttonText: {
        ...FONTS.fontMedium,
        fontSize: 19,
        color: '#fff',
    },
});

export default CustomerSupport;
