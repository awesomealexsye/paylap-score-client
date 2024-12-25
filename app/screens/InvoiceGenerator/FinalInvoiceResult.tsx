import React, { useEffect } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    BackHandler,
    Linking
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import * as WebBrowser from 'expo-web-browser';
import { useTranslation } from 'react-i18next';
import { FontAwesome } from '@expo/vector-icons';

import { RootStackParamList } from '../../navigation/RootStackParamList';
import { COLORS } from '../../constants/theme';
import Header from '../../layout/Header';
import ButtonIcon from '../../components/Button/ButtonIcon';

type FinalInvoiceResultProps = StackScreenProps<RootStackParamList, 'FinalInvoiceResult'>;

export const FinalInvoiceResult = ({ navigation, route }: FinalInvoiceResultProps) => {
    const theme = useTheme();
    const { colors } = theme;
    const { t } = useTranslation();

    const pdf_url = route.params.data.pdf_url;
    console.log(pdf_url, "pdf");
    const previous_screen = route.params.previous_screen;

    useEffect(() => {
        // Handle hardware back press
        const onBackPress = () => {
            if (previous_screen == "ChooseInvoiceDesign") {
                navigation.navigate('CompanyCustomerList');
            } else {
                navigation.goBack();
            }
            return true;
        };

        const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);
        return () => backHandler.remove();
    }, [navigation]);

    const handleOpenWebPage = async () => {
        await WebBrowser.openBrowserAsync(pdf_url);
    };

    const handleDownloadPDF = async () => {
        Linking.openURL(pdf_url + '&download=true');
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.card }]}>
            {/* AppBar Start */}
            <Header
                title="Invoice"
                leftIcon="back"
                titleRight
                // Handle header back button press
                leftAction={() => {
                    if (previous_screen == "ChooseInvoiceDesign") {
                        navigation.navigate('CompanyCustomerList');
                    } else {
                        navigation.goBack();
                    }
                    // navigation.navigate('CompanyCustomerList')
                }
                }
            />
            {/* AppBar End */}

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.buttonWrapper}>
                    <ButtonIcon
                        iconDirection="left"
                        text={COLORS.background}
                        color={COLORS.info}
                        icon={<FontAwesome name="list" size={20} color={COLORS.background} />}
                        title={t('showPDF')}
                        onPress={handleOpenWebPage}
                        style={styles.buttonSpacing}
                    />

                    <ButtonIcon
                        iconDirection="left"
                        text={COLORS.background}
                        color={COLORS.danger}
                        icon={<FontAwesome name="list" size={20} color={COLORS.background} />}
                        title={t('downloadPDF')}
                        onPress={handleDownloadPDF}
                        style={styles.buttonSpacing}
                    />
                </View>
            </ScrollView>
        </View>
    );
};

export default FinalInvoiceResult;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',   // Centers vertically
        alignItems: 'center',       // Centers horizontally
        paddingHorizontal: 16,
        paddingVertical: 16
    },
    buttonWrapper: {
        width: '100%',
        maxWidth: 400
    },
    buttonSpacing: {
        marginVertical: 12
    }
});
