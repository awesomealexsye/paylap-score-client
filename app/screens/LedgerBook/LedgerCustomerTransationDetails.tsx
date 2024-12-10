import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Share, Platform, ActivityIndicator, Modal, Alert } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { Feather } from '@expo/vector-icons';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import Header from '../../layout/Header';
import CustomerTransactionTable from '../Customer/CustomerTransactionTable';

type LedgerCustomerTransationsDetailsScreenProps = StackScreenProps<RootStackParamList, 'LedgerCustomerTransationsDetails'>;

export const LedgerCustomerTransationsDetails = ({ navigation, route }: LedgerCustomerTransationsDetailsScreenProps) => {

	const { customer } = route.params;
	// console.log("customertransactionDetail", customer)
	const theme = useTheme();
	const { colors } = theme;
	const [modalVisible, setModalVisible] = useState(false);
	const [isImageLoading, setImageLoading] = useState(true); // Image loading state

	const showPayButton = customer.transaction_type === "CREDIT" ? 'DEBIT' : 'CREDIT';
	const handlePreview = () => {
		setModalVisible(true);
	};

	// const handlePayment = async () => {
	// 	console.log("hello...")
	// 	navigation.navigate("AddPayment", { item: customer, transaction_type: showPayButton, existPayment: true });
	// }

	// const shareTransaction = async () => {
	// 	const PLAY_STORE_URL = CONFIG.APP_BUILD.ANDROID.APP_URL;
	// 	const APP_STORE_URL = CONFIG.APP_BUILD.IOS.APP_URL;
	// 	let message = `✨✨ *Transaction Details* ✨✨

	//     ━━━━━━━━━━━━━━━━━━━━━━━
	//     👤 *Customer Name*: ${customer.customer_name}
	//     📞 *Mobile*: ${customer.customer_mobile}
	//     ━━━━━━━━━━━━━━━━━━━━━━━

	//     💳 *Transaction Type*: ${customer.transaction_type === "CREDIT" ? "🟢 Credit" : "🔴 Debit"}
	//     💰 *Amount*: ₹ ${customer.amount}
	//     ━━━━━━━━━━━━━━━━━━━━━━━

	//     📅 *Transaction Date*: ${customer.transaction_date}
	//     ⏳ *Estimated End Date*: ${customer.estimated_given_date}
	//     ━━━━━━━━━━━━━━━━━━━━━━━

	//     🆔 *Transaction ID*: 
	//     ${customer.transaction_id}
	//     ━━━━━━━━━━━━━━━━━━━━━━━

	//     📝 *Description*:
	//     ${customer.description}

	//     ━━━━━━━━━━━━━━━━━━━━━━━
	//     🔗 *Shared via PayLap App* 🚀

	//     📲 *Download the PayLap app now*:

	//     ▶️ [*Play Store*](${PLAY_STORE_URL})
	//     🍏 [*App Store*](${APP_STORE_URL})
	//     ━━━━━━━━━━━━━━━━━━━━━━━`;

	// 	try {
	// 		await Share.share({
	// 			message: message
	// 		});
	// 	} catch (error) {
	// 		Alert.alert("Something Went Wrong");
	// 	}
	// };


	return (
		<View style={{ backgroundColor: colors.card, flex: 1 }}>


			{/* AppBar Start */}

			<Header
				title='Transaction Details'
				leftIcon={'back'}
			// rightIcon2={'Edit'}
			/>


			{/* <View style={[styles.headerContainer, { backgroundColor: colors.card }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Feather size={24} color={colors.title} name={'arrow-left'} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.title }]}>Transaction Details</Text>
            </View> */}

			{/* AppBar End */}

			{/* Modal to show image in full screen */}
			<FilePreviewModal
				modalVisible={modalVisible}
				close={setModalVisible}
				image={customer?.image}
			/>

			<ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center', paddingVertical: 20 }}>
				{/* Customer Details Card */}
				<View style={[styles.card, { backgroundColor: colors.card }]}>
					<View style={styles.customerItem}>
						<View>
							<Text style={[styles.customerName, { color: colors.title }]}>{customer.transaction_type}</Text>
							<Text style={[styles.lastInteraction, { color: colors.text }]}>{customer.last_updated_date}</Text>
						</View>
						<View style={{ flexDirection: "row-reverse", justifyContent: "space-around", alignItems: "center" }}>
							<Text style={{ color: customer.transaction_type === "CREDIT" ? COLORS.primary : COLORS.danger, fontSize: SIZES.font, fontWeight: "900" }}>
								₹ {customer.amount}
							</Text>
							{/* <Text style={{
								color: colors.title, fontSize: SIZES.fontSm, ...FONTS.fontSemiBold,
							}}>{customer.transaction_type}</Text> */}
						</View>
					</View>
					<View style={{
						borderBottomColor: colors.text,
						borderBottomWidth: 0.4
					}} />
					<View style={styles.dateContainer}>

						<View style={{ flexDirection: 'row', justifyContent: 'center', gap: 10 }}>
							<Text style={[styles.label, { color: colors.text, }]}>Date: </Text>
							<Text style={[styles.value, { color: colors.title, }]}>{customer.transaction_date}</Text>
						</View>
					</View>
					{/* <View style={{
						borderBottomColor: colors.text,
						borderBottomWidth: 0.4
					}} /> */}

				</View>

				{/* Description Card */}
				<View style={[styles.card, { backgroundColor: colors.card, marginTop: 20 }]}>
					<Text style={[styles.cardTitle, { color: colors.title }]}>Description</Text>
					<Text style={[styles.cardText, { color: colors.text }]}>{customer.description}</Text>
				</View>


				{/* Attachment Section */}
				{customer?.image !== "" && (
					<View style={[styles.card, { backgroundColor: colors.card, marginTop: 20 }]}>
						<Text style={[styles.cardTitle, { color: colors.title }]}>Attached Bill Receipt</Text>

						<TouchableOpacity onPress={handlePreview} style={styles.attachmentContainer}>
							{isImageLoading && (
								<ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
							)}
							<Image
								style={styles.attachmentImage}
								source={{ uri: customer?.image }}
								onLoadStart={() => setImageLoading(true)}
								onLoadEnd={() => setImageLoading(false)}
							/>
						</TouchableOpacity>
					</View>
				)}
			</ScrollView>


			{/* Share Button */}
			<View style={{ paddingHorizontal: 20, marginBottom: 20, }}>
				{/* <ButtonIcon
					color={showPayButton == 'DEBIT' ? 'red' : 'green'}
					onPress={handlePayment}
					title={showPayButton}
					iconDirection='right'
					icon={<FontAwesome style={{ color: COLORS.white, marginLeft: 10 }} name={'rupee'} size={18} />}
				/> */}
				{/* <ButtonIcon
					onPress={shareTransaction}
					title='Share'
					iconDirection='right'
					icon={<FontAwesome style={{ color: COLORS.white, marginLeft: 10 }} name={'share'} size={18} />}
				/> */}
			</View>

		</View>
	);
};

// Modal Component to show full-screen image
const FilePreviewModal = ({ modalVisible, close, image }) => {
	const [isImageLoading, setImageLoading] = useState(true); // Image loading state for popup
	const theme = useTheme();
	const { colors } = theme;

	return (
		<Modal
			visible={modalVisible}
			transparent={true}
			animationType="slide">

			<View style={styles.modalContainer}>
				{/* Close button */}
				<TouchableOpacity
					style={styles.closeButton}
					onPress={() => close(false)}>
					<Feather name="x" size={30} color={colors.primary} />
				</TouchableOpacity>

				<View style={styles.modalContent}>
					{isImageLoading && (
						<ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
					)}
					<Image
						style={styles.fullImage}
						source={{ uri: image }}
						onLoadStart={() => setImageLoading(true)}
						onLoadEnd={() => setImageLoading(false)}
					/>
				</View>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	headerContainer: {
		height: 60,
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 10,
	},
	backButton: {
		padding: 10,
		marginRight: 5,
		height: 45,
		width: 45,
		borderRadius: 22.5,
		alignItems: 'center',
		justifyContent: 'center',
	},
	headerTitle: {
		...FONTS.fontSemiBold,
		fontSize: SIZES.font,
	},
	card: {
		width: "90%",
		borderRadius: 15,
		padding: 15,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 5 },
		shadowOpacity: 0.25,
		shadowRadius: 10,
		elevation: 5,
	},
	customerItem: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginVertical: 10,

	},
	customerName: {
		...FONTS.fontSemiBold,
		fontSize: SIZES.font,
	},
	lastInteraction: {
		fontSize: SIZES.fontSm,
		opacity: 0.6,
	},

	dateContainer: {
		flexDirection: "row",
		justifyContent: 'center',
		marginVertical: 10,

	},
	dateItem: {
		alignItems: 'flex-start',
	},
	label: {
		...FONTS.fontRegular,
		fontSize: SIZES.fontSm,
	},
	value: {
		...FONTS.fontBold,
		fontSize: SIZES.fontSm,
	},
	transactionIDContainer: {
		flexDirection: "row",
		justifyContent: "center",
		marginTop: 20,
	},
	cardTitle: {
		...FONTS.fontSemiBold,
		fontSize: SIZES.fontLg,
		marginBottom: 10,
	},
	cardText: {
		...FONTS.fontRegular,
		fontSize: SIZES.fontSm,
		textAlign: "justify",
	},
	attachmentContainer: {
		marginTop: 10,
		alignItems: 'center',
		justifyContent: 'center',
	},
	attachmentImage: {
		height: 110,
		width: '100%',
		borderRadius: 10,
	},
	loader: {
		position: 'absolute',
	},
	// Modal styles
	modalContainer: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.8)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalContent: {
		width: '90%',
		height: '70%',
		justifyContent: 'center',
		alignItems: 'center',
	},
	closeButton: {
		position: 'absolute',
		top: 30,
		right: 20,
		zIndex: 1, // Ensure the close button is on top of the image
	},
	fullImage: {
		width: '100%',
		height: '100%',
		resizeMode: 'contain',
	},
});

export default LedgerCustomerTransationsDetails;
