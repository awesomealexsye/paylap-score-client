import { useTheme, useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useState, useCallback } from 'react'
import { View, Text, ScrollView } from 'react-native'
import Header from '../../layout/Header';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { COLORS, FONTS } from '../../constants/theme';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import ProfileScore from './PeofileScore';
import CommonService from '../../lib/CommonService';
import CONFIG from '../../constants/config';

type CustomerScoreScreenProps = StackScreenProps<RootStackParamList, 'CustomerScore'>;

const CustomerScore = ({ navigation }: CustomerScoreScreenProps) => {


    const theme = useTheme();
    const { colors }: { colors: any } = theme;

    const scoreVal = { min: 0, max: 100 };
    const [userScore, setUserScore] = useState(0)
    useFocusEffect(
        useCallback(() => {
            CommonService.currentUserDetail().then((res) => {
                setUserScore(res?.credit_score);
            })
        }, [])
    );
    return (
        <>
            <Header
                title='Credit Score'
                leftIcon='back'
                titleRight
            />
            <View style={{ marginTop: 50 }}>
                <ProfileScore value={userScore} labels={CONFIG.CREDIT_SCORE_LABEL} minValue={CONFIG.CREDIT_SCORE_RANGE.MIN} maxValue={CONFIG.CREDIT_SCORE_RANGE.MAX} />
            </View>
            <View style={[GlobalStyleSheet.container, { marginTop: 70, paddingHorizontal: 30 }]}>
                <View style={{ marginTop: 10, flexDirection: 'row', gap: 80 }}>
                    <View>
                        <Text style={{ ...FONTS.font, ...FONTS.fontMedium, ...FONTS.fontBold, color: colors.title }}>Color</Text>
                    </View>
                    <View>
                        <Text style={{ ...FONTS.font, ...FONTS.fontMedium, ...FONTS.fontBold, color: colors.title }}>Description</Text>
                    </View>
                    <View>
                        <Text style={{ ...FONTS.font, ...FONTS.fontMedium, ...FONTS.fontBold, color: colors.title }}>Range</Text>
                    </View>
                </View>
                <View style={{ marginTop: 10, flexDirection: 'column', gap: 5 }}>
                    {
                        CONFIG.CREDIT_SCORE_LABEL.map((item, index) => {
                            return (
                                <View style={{ marginTop: 20, flexDirection: 'row', gap: 70 }} key={index}>
                                    <View style={{ width: 50, height: 20, backgroundColor: item.labelColor, flex: 1 }} key={index}>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ color: colors.title }}>{item.name}</Text>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ color: colors.title }}>{`${((scoreVal.max / CONFIG.CREDIT_SCORE_LABEL.length) * index) + 1} - ${(scoreVal.max / CONFIG.CREDIT_SCORE_LABEL.length) * (index + 1)}`}</Text>
                                    </View>
                                </View>
                            )
                        })
                    }
                </View>
            </View >
        </>
    )
}


export default CustomerScore