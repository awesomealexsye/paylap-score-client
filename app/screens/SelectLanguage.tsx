import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Header from '../layout/Header';
import { GlobalStyleSheet } from '../constants/StyleSheet';
import { COLORS, FONTS } from '../constants/theme';
import { RadioButton } from 'react-native-paper';
import i18n from '../../i18n';
import { useTranslation } from 'react-i18next';
import StorageService from '../lib/StorageService';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/RootStackParamList';
import ButtonIcon from '../components/Button/ButtonIcon';
import CONFIG from '../constants/config';

type SelectLanguage = StackScreenProps<RootStackParamList, 'SelectLanguage'>;

const SelectLanguage = ({ navigation, route }: SelectLanguage) => {

    const theme = useTheme();
    const { colors }: { colors: any } = theme;

    const [langChecked, setLangChecked] = React.useState('en');

    useEffect(() => {
        StorageService.isLanguageSet().then((res) => {
            if (res != null) {
                i18n.changeLanguage(res);
                setLangChecked(res);
            }
        })
    }, [])
    // function isLanguageSet() {
    //     return StorageService.getStorage(CONFIG.HARDCODE_VALUES.SET_LANGUAGE);
    // }

    const handleLang = (lang: string) => {
        setLangChecked(lang);
        i18n.changeLanguage(lang);
        StorageService.setStorage(CONFIG.HARDCODE_VALUES.SET_LANGUAGE, lang);
        // console.log(lang);
    }


    const { t } = useTranslation();

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <View style={{ flex: 1, }}>
                <Header title={t('chooseLanguage')} titleRight />
                <ScrollView>
                    <View style={{ ...GlobalStyleSheet.container }}>
                        <View style={[GlobalStyleSheet.card, { backgroundColor: colors.card }]}>
                            <View style={GlobalStyleSheet.cardBody}>

                                <TouchableOpacity onPress={() => handleLang('en')}>
                                    <View
                                        style={{
                                            paddingVertical: 14,
                                            borderBottomWidth: 1,
                                            borderStyle: 'dashed',
                                            borderBottomColor: COLORS.inputborder,
                                            flexDirection: "row",
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <Text style={{ ...FONTS.font, color: colors.title, ...FONTS.fontMedium }}>English</Text>
                                        <RadioButton
                                            onPress={() => handleLang('en')}
                                            value="en"
                                            status={langChecked === 'en' ? 'checked' : 'unchecked'}
                                        />
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleLang('hi')}>
                                    <View
                                        style={{
                                            paddingVertical: 14,
                                            borderBottomWidth: 1,
                                            borderStyle: 'dashed',
                                            borderBottomColor: COLORS.inputborder,
                                            flexDirection: "row",
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <Text style={{ ...FONTS.font, color: colors.title, ...FONTS.fontMedium }}>Hindi</Text>
                                        <RadioButton
                                            onPress={() => handleLang('hi')}
                                            value="hi"
                                            status={langChecked === 'hi' ? 'checked' : 'unchecked'}
                                        />
                                    </View>

                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleLang('pa')}>
                                    <View
                                        style={{
                                            paddingVertical: 14,
                                            borderBottomWidth: 1,
                                            borderStyle: 'dashed',
                                            borderBottomColor: COLORS.inputborder,
                                            flexDirection: "row",
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <Text style={{ ...FONTS.font, color: colors.title, ...FONTS.fontMedium }}>Punjabi</Text>
                                        <RadioButton
                                            onPress={() => handleLang('pa')}
                                            value="pa"
                                            status={langChecked === 'pa' ? 'checked' : 'unchecked'}
                                        />
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleLang('ta')}>
                                    <View
                                        style={{
                                            paddingVertical: 14,
                                            borderBottomWidth: 1,
                                            borderStyle: 'dashed',
                                            borderBottomColor: COLORS.inputborder,
                                            flexDirection: "row",
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <Text style={{ ...FONTS.font, color: colors.title, ...FONTS.fontMedium }}>Tamil</Text>
                                        <RadioButton
                                            onPress={() => handleLang('ta')}
                                            value="ta"
                                            status={langChecked === 'ta' ? 'checked' : 'unchecked'}
                                        />
                                    </View>
                                </TouchableOpacity>
                                <View>
                                    <ButtonIcon title={"Next"} onPress={() => {
                                        StorageService.isLoggedIn().then((is_login) => {
                                            // console.log("is_logged_in", is_login);
                                            if (is_login) {
                                                navigation.replace("DrawerNavigation", { screen: 'Home' });
                                            } else {
                                                navigation.navigate("MobileSignIn")
                                            }
                                        })
                                    }} />
                                </View>

                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </View>
    );
};


export default SelectLanguage;