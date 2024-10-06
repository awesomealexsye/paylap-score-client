import { useTheme, useFocusEffect } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect, useCallback, useState } from 'react'
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet, Share, Alert } from 'react-native'
import { RootStackParamList } from '../navigation/RootStackParamList';
import Header from '../layout/Header';

import { GlobalStyleSheet } from '../constants/StyleSheet';
import { IMAGES } from '../constants/Images';
import { COLORS, FONTS } from '../constants/theme';
import CommonService from '../lib/CommonService';
import ButtonIcon from '../components/Button/ButtonIcon';
import { Feather } from '@expo/vector-icons';

type ShareAppProps = StackScreenProps<RootStackParamList, 'ShareApp'>;

const ShareApp = (
	{ navigation }: ShareAppProps

) => {



	const theme = useTheme();
	const { colors }: { colors: any } = theme;
	const [userRefferal, setuserRefferal] = useState("");

	useEffect(() => {
		CommonService.currentUserDetail().then((res) => {
			setuserRefferal(res?.refferal);
		})
	}, []);

	const shareApp = async () => {


		try {
			const result = await Share.share({
				message:
					'Hey! Try out the PayLap app for great deals and rewards, Download it from https://play.google.com/store/apps/details?id=com.paylap.paylapscore Don’t forget to use my referral code: .' + userRefferal,
				url: "https://play.google.com/store/apps/details?id=com.paylap.paylapscore"
			});
			if (result.action === Share.sharedAction) {
				if (result.activityType) {
					// shared with activity type of result.activityType
				} else {
					// shared
				}
			} else if (result.action === Share.dismissedAction) {
				// dismissed
			}
		} catch (error: any) {
			Alert.alert(error.message);
		}
	}




	return (
		<View style={{ backgroundColor: colors.card, flex: 1 }}>
			<View style={[GlobalStyleSheet.card, { backgroundColor: colors.card, }]}>

				<Header
					title='Share'
					leftIcon={'back'}
					titleRight
				/>



				<Text style={{ color: colors.title, ...FONTS.fontBold, fontSize: 15, textAlign: "center", padding: 10 }}>
					Refer Friends . Get Rewards
				</Text>
				<View style={[GlobalStyleSheet.cardBody, { flexDirection: "column", justifyContent: "center", alignItems: "center" }]}>
					<Image source={IMAGES.gift} style={{ height: 100, width: 100 }} />
				</View>

				<Text style={{ color: colors.title, ...FONTS.fontBold, fontSize: 15, textAlign: "center", padding: 10 }}>
					Get Rewards
				</Text>

				<Text style={{ color: colors.title, ...FONTS.fontSemiBold, fontSize: 15, textAlign: "center", padding: 30 }}>
					Introduce Your Friends to PayLap Score & Earn Rewards
				</Text>

				<ButtonIcon title={"Share App"} icon={<Feather name='share' size={20} color={COLORS.background}
				/>} onPress={shareApp} />

			</View>


		</View>
	)
}


export default ShareApp