import { useTheme, useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useState, useCallback } from 'react'
import { View, Text, ScrollView, ActivityIndicator } from 'react-native'
import Header from '../../layout/Header';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { COLORS, FONTS } from '../../constants/theme';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import ProfileScore from './PeofileScore';
import CommonService from '../../lib/CommonService';
import CONFIG from '../../constants/config';
import { ApiService } from '../../lib/ApiService';

type CustomerScoreScreenProps = StackScreenProps<RootStackParamList, 'CustomerScore'>;

const CustomerScore = ({ navigation, route }: CustomerScoreScreenProps) => {

    const { customer } = route.params;

    const theme = useTheme();
    const { colors }: { colors: any } = theme;

    const scoreVal = { min: CONFIG.CREDIT_SCORE_RANGE.MIN, max: CONFIG.CREDIT_SCORE_RANGE.MAX };
    const [userScore, setUserScore] = useState(0)
    const [isLoading, setIsLoading] = useState(false)

    useFocusEffect(
        useCallback(() => {
            if (customer.id) {
                setIsLoading(true)
                ApiService.postWithToken("api/user/credit-score", { request_user_id: customer.id }).then((res) => {
                    if (res.status) {
                        setUserScore(res?.data?.credit_score);
                    }
                    setIsLoading(false)
                })
            } else {
                CommonService.currentUserDetail().then((res) => {
                    setUserScore(res?.credit_score);
                })
            }
        }, [])
    );
    return (
        <>
            <Header
                title='Credit Score'
                leftIcon='back'
                titleRight
            />
            {isLoading === false ? <View style={{ marginTop: 50 }}>
                <ProfileScore value={userScore} labels={CONFIG.CREDIT_SCORE_LABEL} minValue={CONFIG.CREDIT_SCORE_RANGE.MIN} maxValue={CONFIG.CREDIT_SCORE_RANGE.MAX} />
            </View> : <ActivityIndicator size={70} color={COLORS.primary} />}

            <View style={[GlobalStyleSheet.container, { marginTop: 70, paddingHorizontal: 30 }]}>
                <View style={{ marginTop: 10, flexDirection: 'row', gap: 80 }}>
                    <View>
                        <Text style={{ ...FONTS.font, ...FONTS.fontMedium, ...FONTS.fontBold, color: colors.title, fontSize: 14 }}>Color</Text>
                    </View>
                    <View>
                        <Text style={{ ...FONTS.font, ...FONTS.fontMedium, ...FONTS.fontBold, color: colors.title, fontSize: 14 }}>Description</Text>
                    </View>
                    <View>
                        <Text style={{ ...FONTS.font, ...FONTS.fontMedium, ...FONTS.fontBold, color: colors.title, fontSize: 14 }}>Range</Text>
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
                                        <Text style={{ color: colors.title, fontSize: 10 }}>{item.name}</Text>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ color: colors.title, fontSize: 10 }}>{`${((((scoreVal.max - scoreVal.min) / CONFIG.CREDIT_SCORE_LABEL.length) * index) + 1) + scoreVal.min} - ${(((scoreVal.max - scoreVal.min) / CONFIG.CREDIT_SCORE_LABEL.length) * (index + 1) + scoreVal.min)}`}</Text>
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