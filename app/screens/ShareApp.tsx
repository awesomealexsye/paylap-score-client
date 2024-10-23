import { useTheme, useFocusEffect } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useEffect, useState, } from 'react'
import {
	View,
	Text,
	TouchableOpacity,
	Image,
	ScrollView,
	Share,
	Alert,
	StatusBar,
	Linking,
	Platform,
} from 'react-native'
import { RootStackParamList } from '../navigation/RootStackParamList';
import Header from '../layout/Header';
import { GlobalStyleSheet } from '../constants/StyleSheet';
import { IMAGES } from '../constants/Images';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import CommonService from '../lib/CommonService';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import CustomerActivityBtn from './Customer/CustomerActivityBtn';
import { ApiService } from '../lib/ApiService';






type ShareAppProps = StackScreenProps<RootStackParamList, 'ShareApp'>;

const ShareApp = ({ navigation }: ShareAppProps) => {


	const theme = useTheme();
	const { colors }: { colors: any } = theme;

	const [userReferral, setUserReferral] = useState("");
	const selector = Platform.OS === "ios" ? "& " : "?";

	useEffect(() => {
		CommonService.currentUserDetail().then((res) => {
			setUserReferral(res?.refferal);
		})
	}, []);

	const shareApp = async () => {
		try {
			const result = await Share.share({
				message:
					'Hey! Try out the PayLap app for great deals and rewards, Download it from https://play.google.com/store/apps/details?id=com.paylap.paylapscore Don’t forget to use my referral code: .' + userReferral,
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




	const shareAppOnWhatsApp = () => {
		const message = "Hey! Check out this amazing app: https://play.google.com/store/apps/details?id=com.paylap.paylapscore"; // Your app's link
		const url = `whatsapp://send${selector}text=${encodeURIComponent(message)}`;

		Linking.canOpenURL(url)
			.then((supported) => {
				if (supported) {
					Linking.openURL(url);
				} else {
					Alert.alert("WhatsApp is not installed on this device");
				}
			})
			.catch((err) => console.error("An error occurred", err));
	};

	const shareAppViaSMS = () => {
		const message = `Join me on PayLap Score! Use my referral code: ${userReferral} https://play.google.com/store/apps/details?id=com.paylap.paylapscore`;
		const phoneNumber = ""; // You can pre-fill the number if needed, or leave it blank for the user to enter
		const url = `sms:${phoneNumber}${selector}body=${encodeURIComponent(message)}`;

		Linking.canOpenURL(url)
			.then((supported) => {
				if (supported) {
					return Linking.openURL(url);
				} else {
					alert("SMS client is not available");
				}
			})
			.catch((err) => console.error("An error occurred", err));
	};

	const shareAppOnMail = () => {

		const body = `Join me on PayLap Score! Use my referral code: ${userReferral} https://play.google.com/store/apps/details?id=com.paylap.paylapscore`;
		const subject = "Check out this amazing app!";
		const email = `mailto:${selector}subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

		Linking.canOpenURL(email)
			.then((supported) => {
				if (supported) {
					return Linking.openURL(email);
				} else {
					alert("Email client is not available");
				}
			})
			.catch((err) => console.error("An error occurred", err));
	};

	const handleShareCode = async () => {
		try {
			await Share.share({
				message: `Join me on PayLap Score! Use my referral code: ${userReferral}`,
			});
		} catch (error) {
			Alert.alert("SomeThing Went Wrong")
			console.error('Error sharing referral code:', error);
		}
	};

	const [referredPeople, setReferredPeople] = useState([]);

	useFocusEffect(
		useCallback(() => {
			ApiService.postWithToken('api/user/refferal-list', {}).then(res => {
				if (res.status) {
					setReferredPeople(res.data);
				}

			})
		}, [])
	);

	const ReferredPersonListTile = (referredPeople: any) => (
		<TouchableOpacity style={{
			flexDirection: 'row',
			alignItems: 'center',
			padding: 12,
			// borderBottomColor: COLORS.primary,
		}} onPress={() => { }}>
			<Image source={{ uri: referredPeople.image }} style={{
				width: 48,
				height: 48,
				borderRadius: 23,
				marginRight: 16,
				backgroundColor: COLORS.primary
			}} />
			<View style={{ flex: 1, }}>
				<Text style={{
					...FONTS.fontSemiBold,
					color: colors.title,
					fontSize: SIZES.font,

				}}>{referredPeople.name}</Text>
				<Text style={{
					...FONTS.fontRegular,
					color: colors.title,
					fontSize: SIZES.fontSm,
					marginTop: 4,
				}}>{referredPeople.status}</Text>
			</View>
			<MaterialIcons name="check" size={24} color={COLORS.primary} />
		</TouchableOpacity>
	);


	return (
		<View style={{ backgroundColor: colors.background, flex: 1 }}>
			<View style={[GlobalStyleSheet.card, { backgroundColor: colors.background, }]}>

				<Header
					title='Share'
					leftIcon={'back'}
					titleRight
				/>



				<StatusBar barStyle="light-content" backgroundColor="#4C1D95" />

				<ScrollView contentContainerStyle={{ padding: 16, }}>
					<Text style={{
						...FONTS.fontBold,
						fontSize: 36,
						color: colors.title,
						marginBottom: 8,
					}}>Invite PayLap Score !</Text>
					<Text style={{
						fontSize: 16,
						color: colors.title,
						marginBottom: 24,
						// lineHeight: 24,
					}}>
						Invite your Indian contacts and NRI friends & family to PayLap Score.
					</Text>

					<View style={{
						flexDirection: 'row',
						justifyContent: 'space-around',
						alignItems: 'center',
						marginBottom: 24,
					}}>
						<View style={{
							width: 60,
							height: 60,
							borderRadius: 30,
							backgroundColor: COLORS.primary,
							justifyContent: 'center',
							alignItems: 'center',
						}}>
							<MaterialIcons name="campaign" size={30} color={COLORS.white} />
						</View>
						<View style={{
							height: 2,
							backgroundColor: COLORS.primary,
							flex: 1,
							marginHorizontal: 10,
						}} />
						<View style={{
							width: 60,
							height: 60,
							borderRadius: 30,
							backgroundColor: COLORS.primary,
							justifyContent: 'center',
							alignItems: 'center',
						}}>
							<MaterialIcons name="smartphone" size={30} color={COLORS.white} />
						</View>
					</View>

					<View style={{ marginBottom: 24, }}>
						<Text style={{
							...FONTS.fontBold,
							fontSize: SIZES.font,
							color: colors.title,
							marginBottom: 8,
						}}>Your Referral Code</Text>
						<View style={{
							backgroundColor: COLORS.primary,
							borderRadius: 12,
							padding: 8,
							flexDirection: 'row',
							justifyContent: 'space-between',
							alignItems: 'center',
						}}>
							<Text style={{
								...FONTS.fontBold,
								color: COLORS.white,
								fontSize: SIZES.h4,
								paddingHorizontal: 15

							}}>{userReferral}</Text>
							<TouchableOpacity onPress={handleShareCode} style={{
								backgroundColor: colors.primaryLight,
								borderRadius: 20,
								padding: 8,
							}}>
								<MaterialIcons name="share" size={24} color={COLORS.white} />
							</TouchableOpacity>
						</View>
					</View>

					<Text style={{
						...FONTS.fontBold,
						fontSize: SIZES.font,
						color: colors.title,

					}}>Invite</Text>

					<View style={{
						flexDirection: "row",
						justifyContent: "space-evenly",
						alignItems: "center",
						marginVertical: 20
					}}>
						<CustomerActivityBtn
							gap
							icon={<MaterialCommunityIcons name={'whatsapp'} color={colors.title} size={23} />}
							color={colors.card}
							text='WhatsApp'
							onpress={shareAppOnWhatsApp}
						/>
						<CustomerActivityBtn

							gap
							icon={<MaterialIcons name="sms" size={23} color={colors.title} />} color={colors.card}
							text='SMS'
							onpress={shareAppViaSMS}
						/><CustomerActivityBtn
							gap
							icon={<MaterialIcons name="email" size={23} color={colors.title} />} color={colors.card}
							text='Email'
							onpress={shareAppOnMail}
						/><CustomerActivityBtn
							gap
							icon={<MaterialIcons name="more-horiz" size={25} color={colors.title} />} color={colors.card}
							text='More'
							onpress={shareApp}
						/>
					</View>
					<View style={{ flexDirection: 'row', alignItems: "center", justifyContent: "space-between" }}>
						<Text style={{
							...FONTS.fontBold,
							fontSize: SIZES.font,
							color: colors.title,

						}}>People you've referred</Text>
						<Text style={{
							...FONTS.fontBold,
							fontSize: SIZES.font,
							color: colors.title,

						}}>( {referredPeople.length} )</Text>
					</View>

					<View style={{
						backgroundColor: colors.card,
						borderRadius: 12,
						marginVertical: 20
					}}>
						{referredPeople.map((person: any, index) => (
							<ReferredPersonListTile
								key={index}
								name={person.name}
								image={person.profile_image}
								status={person.joined_at}
								onPress={{}}
							/>
						))}
					</View>
					<View style={{
						paddingBottom: 50,
					}}
					>

					</View>
				</ScrollView>


			</View>
		</View>
	)
}


export default ShareApp


