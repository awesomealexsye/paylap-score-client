import React, { useEffect } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    BackHandler,
    Linking, Image
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
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { IMAGES } from '../../constants/Images';

type FinalInvoiceResultProps = StackScreenProps<RootStackParamList, 'FinalInvoiceResult'>;

export const FinalInvoiceResult = ({ navigation, route }: FinalInvoiceResultProps) => {
    const theme = useTheme();
    const { colors } = theme;
    const { t } = useTranslation();

    const pdf_url = route.params.data.pdf_url;
    // console.log(pdf_url, "pdf");
    const previous_screen = route.params.previous_screen;

    useEffect(() => {
        // Handle hardware back press
        const onBackPress = () => {
            if (previous_screen == "ChooseInvoiceDesign") {
                navigation.navigate('InvoiceLists');
            } else {
                navigation.goBack();
            }
            return true;
        };

        const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);
        return () => backHandler.remove();
    }, [navigation]);

    const handleOpenWebPage = async () => {
        // console.log("pdfurl/.", pdf_url)
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
                        navigation.navigate('InvoiceLists');
                    } else {
                        navigation.goBack();
                    }
                }
                }
            />
            {/* AppBar End */}

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >

                <View style={styles.buttonWrapper}>
                    {/* <View style={{ borderBottomColor: COLORS.inputborder, justifyContent: "flex-start", alignItems: "center", marginBottom: 30 }}>

                        <Image source={theme.dark ? IMAGES.appnamedark : IMAGES.appname}
                            style={{
                                height: 110,
                                width: 150,
                                objectFit: "contain",
                            }} />
                    </View> */}
                    <ButtonIcon
                        iconDirection="left"
                        text={COLORS.background}
                        color={COLORS.info}
                        icon={<FontAwesome name="file-pdf-o" size={20} color={COLORS.background} />}
                        title={t('showPDF')}
                        onPress={handleOpenWebPage}
                        style={styles.buttonSpacing}
                    />

                    <ButtonIcon
                        iconDirection="left"
                        text={COLORS.background}
                        color={COLORS.primary}
                        icon={<FontAwesome name="download" size={20} color={COLORS.background} />}
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
        flexGrow: 1,      // Centers horizontally
        paddingHorizontal: 16,
        paddingVertical: 40
    },
    buttonWrapper: {
        width: '100%',

    },
    buttonSpacing: {
        marginVertical: 12
    }
});
