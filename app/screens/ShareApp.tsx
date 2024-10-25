import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect, useTheme } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useEffect, useState } from 'react';
import {
	Alert,
	Image,
	Platform,
	ScrollView,
	Share,
	StatusBar,
	Text,
	TouchableOpacity,
	View
} from 'react-native';
import { GlobalStyleSheet } from '../constants/StyleSheet';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import Header from '../layout/Header';
import { ApiService } from '../lib/ApiService';
import CommonService from '../lib/CommonService';
import { RootStackParamList } from '../navigation/RootStackParamList';
import CONFIG from '../constants/config';
import * as Clipboard from 'expo-clipboard';  // Import Clipboard API
import { MessagesService } from '../lib/MessagesService';
import { IMAGES } from '../constants/Images';

type ShareAppProps = StackScreenProps<RootStackParamList, 'ShareApp'>;

const ShareApp = ({ navigation }: ShareAppProps) => {
	const theme = useTheme();
	const { colors }: { colors: any } = theme;

	const [userReferral, setUserReferral] = useState("");
	const selector = Platform.OS === "ios" ? "& " : "?";

	const PLAY_STORE_URL = CONFIG.APP_BUILD.ANDROID.APP_URL;
	const APP_STORE_URL = CONFIG.APP_BUILD.IOS.APP_URL;

	useEffect(() => {
		CommonService.currentUserDetail().then((res) => {
			setUserReferral(res?.refferal);
		});
	}, []);

	const handleShareCode = async () => {
		try {
			await Share.share({
				message: `🚀 Join PAYLAP Score Today! 🚀\n\nHey there! 📲 I’m using PAYLAP Score to manage finances easily, and it’s been a game-changer! You should try it too. Download the app and start managing your business effortlessly with just a few taps!\n\n💥 Use my referral code: **${userReferral}** to get started and unlock exciting features! 💥\n\n\n\n📱📱🔗 Download on Play Store: ${PLAY_STORE_URL}\n\n🔗 Download on Apple App Store: ${APP_STORE_URL}\n\nManage your business finances smarter and faster with PAYLAP Score! 📊`,
			});
		} catch (error) {
			Alert.alert("SomeThing Went Wrong");
			console.error('Error sharing referral code:', error);
		}
	};

	const copyToClipboard = () => {
		Clipboard.setString(userReferral); // Copy the referral code to the clipboard
		MessagesService.commonMessage("Refferal Code has Copied", "SUCCESS")
	};

	const [referredPeople, setReferredPeople] = useState([]);

	useFocusEffect(
		useCallback(() => {
			ApiService.postWithToken('api/user/refferal-list', {}).then(res => {
				if (res.status) {
					setReferredPeople(res.data);
				}
			});
		}, [])
	);

	const ReferredPersonListTile = (referredPeople: any) => (
		<TouchableOpacity style={{
			flexDirection: 'row',
			alignItems: 'center',
			padding: 12,
		}} onPress={() => { }}>
			<Image source={{ uri: referredPeople.image }} style={{
				width: 48,
				height: 48,
				borderRadius: 23,
				marginRight: 16,
				backgroundColor: COLORS.primary
			}} />
			<View style={{ flex: 1 }}>
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
			<View style={[GlobalStyleSheet.card, { backgroundColor: colors.background }]}>
				<Header
					title='Share'
					leftIcon={'back'}
					titleRight
				/>
				<StatusBar barStyle="light-content" backgroundColor="#4C1D95" />
				<ScrollView contentContainerStyle={{ padding: 16 }}>
					<View style={[GlobalStyleSheet.container, { borderBottomColor: COLORS.inputborder, justifyContent: "center", alignItems: "center" }]}>
						<Image source={theme.dark ? IMAGES.appnamedark : IMAGES.appname}
							style={{
								height: 110,
								width: 150,
								objectFit: "contain",
							}} />
					</View>
					{/* <Text style={{
						...FONTS.fontBold,
						fontSize: SIZES.h3,
						color: colors.title,
						marginBottom: 8,
					}}>Invite PayLap Score!</Text> */}
					<Text style={{
						fontSize: SIZES.font,
						color: colors.title,
						marginBottom: 24,
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
							width: 40,
							height: 40,
							borderRadius: 30,
							backgroundColor: COLORS.primary,
							justifyContent: 'center',
							alignItems: 'center',
						}}>
							<MaterialIcons name="campaign" size={22} color={COLORS.white} />
						</View>
						<View style={{
							height: 2,
							backgroundColor: COLORS.primary,
							flex: 1,
							marginHorizontal: 10,
						}} />
						<View style={{
							width: 40,
							height: 40,
							borderRadius: 30,
							backgroundColor: COLORS.primary,
							justifyContent: 'center',
							alignItems: 'center',
						}}>
							<MaterialIcons name="smartphone" size={22} color={COLORS.white} />
						</View>
					</View>

					<View style={{ marginBottom: 24 }}>
						<Text style={{
							...FONTS.fontBold,
							fontSize: SIZES.font,
							color: colors.title,
							marginBottom: 8,
						}}>Your Referral Code</Text>
						<View style={{
							backgroundColor: COLORS.primary,
							borderRadius: 10,
							padding: 8,
							flexDirection: 'row',
							justifyContent: 'space-between',
							alignItems: 'center',
						}}>
							<Text style={{
								...FONTS.fontBold,
								color: COLORS.white,
								fontSize: SIZES.h4,
								paddingHorizontal: 15,
							}}>{userReferral}</Text>

							{/* Copy to clipboard button */}
							<TouchableOpacity onPress={copyToClipboard} style={{
								backgroundColor: colors.primaryLight,
								borderRadius: 20,
								padding: 8,
								marginLeft: 10,
							}}>
								<MaterialIcons name="content-copy" size={22} color={COLORS.white} />
							</TouchableOpacity>
							{/* Share button */}
							<TouchableOpacity onPress={handleShareCode} style={{
								backgroundColor: colors.primaryLight,
								borderRadius: 20,
								padding: 8,
							}}>
								<MaterialIcons name="share" size={24} color={COLORS.white} />
							</TouchableOpacity>
						</View>
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

					<View style={{ paddingBottom: 50 }}></View>
				</ScrollView>
			</View>
		</View>
	);
};

export default ShareApp;
