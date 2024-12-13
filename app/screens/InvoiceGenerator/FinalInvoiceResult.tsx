import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Modal, StyleSheet, Dimensions, Button, BackHandler, Linking } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { COLORS } from '../../constants/theme';
import Header from '../../layout/Header';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import * as WebBrowser from 'expo-web-browser';
import { useTranslation } from 'react-i18next';
import ButtonIcon from '../../components/Button/ButtonIcon';
import { FontAwesome } from '@expo/vector-icons';


type FinalInvoiceResultProps = StackScreenProps<RootStackParamList, 'FinalInvoiceResult'>
export const FinalInvoiceResult = ({ navigation, route }: FinalInvoiceResultProps) => {

    const theme = useTheme();
    const { colors }: { colors: any } = theme;

    const pdf_url = route.params.data.pdf_url;

    const { t } = useTranslation();



    useEffect(() => {
        // handleOpenWebPage();
        const onBackPress = () => {
            navigation.navigate("InvoiceGenList");
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            onBackPress
        );

        return () => backHandler.remove(); // Cleanup
    }, [navigation]);



    const handleOpenWebPage = async () => {
        await WebBrowser.openBrowserAsync(pdf_url);
    };
    const handleDownloadPDF = async () => {
        Linking.openURL(pdf_url + "&download=true");

        // await WebBrowser.openBrowserAsync('https://paynest.co.in/api/invoice-sample?download=true');
    };



    return (
        <View style={{ backgroundColor: colors.card, flex: 1 }}>
            {/* AppBar Start */}
            <Header
                title="Invoice"
                leftIcon="back"
                titleRight
            />
            {/* AppBar End */}

            <ScrollView showsVerticalScrollIndicator={false}>
                <View >
                    <View style={{ marginTop: 12, }}>
                        <View>
                            <ButtonIcon
                                iconDirection="left"
                                text={COLORS.background}
                                color={COLORS.info}
                                icon={<FontAwesome name='list' size={20} color={COLORS.background} />}

                                title={t('showPDF')} onPress={() => {
                                    handleOpenWebPage();
                                }} />

                        </View>

                        <View style={{ marginTop: 12 }}>
                            <ButtonIcon
                                iconDirection="left"
                                text={COLORS.background}
                                color={COLORS.danger}
                                icon={<FontAwesome name='list' size={20} color={COLORS.background} />}

                                title={t('downloadPDF')} onPress={() => {
                                    handleDownloadPDF();
                                }} />
                        </View>
                    </View>

                </View>
            </ScrollView >
        </View >
    );
};

export default FinalInvoiceResult;
