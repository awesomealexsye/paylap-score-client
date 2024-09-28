import { useTheme } from '@react-navigation/native';
import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView } from 'react-native'
import Header from '../../layout/Header';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { IMAGES } from '../../constants/Images';
import { COLORS, FONTS } from '../../constants/theme';
import { Feather } from '@expo/vector-icons';
import Button from '../../components/Button/Button';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import ProfileScore from './PeofileScore';
import CommonService from '../../lib/CommonService';

type CustomerScoreScreenProps = StackScreenProps<RootStackParamList, 'CustomerScore'>;

const CustomerScore = ({ navigation }: CustomerScoreScreenProps) => {

    const labels = [
        {
            name: 'Very Poor',
            labelColor: '#ff2900',
            activeBarColor: '#ff2900',
        },
        {
            name: 'Poor',
            labelColor: '#ff5400',
            activeBarColor: '#ff5400',
        },
        {
            name: 'Good',
            labelColor: '#f4ab44',
            activeBarColor: '#f4ab44',
        },
        {
            name: 'Very Good',
            labelColor: '#f2cf1f',
            activeBarColor: '#f2cf1f',
        },
        {
            name: 'Excellent',
            labelColor: '#14eb6e',
            activeBarColor: '#14eb6e',
        },
    ];

    const theme = useTheme();
    const { colors }: { colors: any } = theme;


    const scoreVal = { min: 0, max: 100 };
    const [userScore, setUserScore] = useState(0)
    useEffect(() => {
        CommonService.currentUserDetail().then((res) => {
            setUserScore(res?.credit_score);
        })
    })
    return (
        <>
            <Header
                title='Credit Score'
                leftIcon='back'
                titleRight
            />
            <View style={{ marginTop: 50 }}>
                <ProfileScore value={userScore} labels={labels} minValue={scoreVal.min} maxValue={scoreVal.max} />
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
                        labels.map((item, index) => {
                            return (
                                <View style={{ marginTop: 20, flexDirection: 'row', gap: 70 }} key={index}>
                                    <View style={{ width: 50, height: 20, backgroundColor: item.labelColor, flex: 1 }} key={index}>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ color: colors.title }}>{item.name}</Text>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ color: colors.title }}>{`${((scoreVal.max / labels.length) * index) + 1} - ${(scoreVal.max / labels.length) * (index + 1)}`}</Text>
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