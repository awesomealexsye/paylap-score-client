import { useTheme } from '@react-navigation/native';
import React, { useState } from 'react'
import { View, Text, ScrollView } from 'react-native'
import Header from '../layout/Header';
import { GlobalStyleSheet } from '../constants/StyleSheet';
import { COLORS, FONTS } from '../constants/theme';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/RootStackParamList';




type NotAvailableScreenProps = StackScreenProps<RootStackParamList, 'NotAvailable'>;

const NotAvailable = ({ navigation }: NotAvailableScreenProps) => {
    const theme = useTheme();
    const { colors }: { colors: any } = theme;

    return (
        <View style={{ backgroundColor: colors.background, flex: 1 }}>
            <Header
                title='Not Available'
                leftIcon='back'
                rightIcon1
            />

            <View style={[GlobalStyleSheet.container, { padding: 0, position: 'absolute', left: 0, right: 0, bottom: 0, top: 65 }]}>
                <View
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Text style={{ ...FONTS.h5, color: colors.title, marginBottom: 8 }}>This feature is not available.</Text>
                </View>
            </View>
        </View>
    )
}


export default NotAvailable