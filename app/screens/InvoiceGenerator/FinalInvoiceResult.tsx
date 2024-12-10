import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Modal, StyleSheet, Dimensions, Button, BackHandler } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { COLORS } from '../../constants/theme';
import Header from '../../layout/Header';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';


type FinalInvoiceResultProps = StackScreenProps<RootStackParamList, 'FinalInvoiceResult'>
export const FinalInvoiceResult = ({ navigation }: FinalInvoiceResultProps) => {

    const theme = useTheme();
    const { colors }: { colors: any } = theme;


    useEffect(() => {
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
                <View>
                    <View>
                        <Text style={{ textAlign: 'center', marginHorizontal: 23, marginVertical: 60 }}>Your invoice is generating in new minutes...</Text>
                    </View>

                </View>
            </ScrollView>
        </View>
    );
};

export default FinalInvoiceResult;
