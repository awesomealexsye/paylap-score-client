import React, { useRef, useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, TextInput, StyleSheet, SafeAreaView, FlatList } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { IMAGES } from '../../constants/Images';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { ApiService } from '../../lib/ApiService';
import ButtonIcon from '../../components/Button/ButtonIcon';
import FilePreviewModal from '../../components/Modal/FilePreviewModal';
import Header from '../../layout/Header';



type LedgerCustomerDetailsScreenProps = StackScreenProps<RootStackParamList, 'LedgerCustomerDetails'>

export const LedgerCustomerDetails = ({ navigation, route }: LedgerCustomerDetailsScreenProps) => {
	const { customer } = route.params;

	const theme = useTheme();
	const { colors }: { colors: any; } = theme;


	const [modalVisible, setModalVisible] = useState(false)
	const handlePreview = () => {
		setModalVisible(true);
	}


	return (
		<View style={{ backgroundColor: colors.card, flex: 1 }}>

			<Header
				title='Transction Details'
				leftIcon='back'
				titleRight
			/>

			<FilePreviewModal close={setModalVisible} modalVisible={modalVisible} title="Preview" previewImage={customer?.image} />

			<View style={{ flex: 1, alignItems: 'center' }} >
				<View style={{
					height: 220,
					width: 380,
					top: 20,
					backgroundColor: colors.card,
					borderRadius: 31,
					shadowColor: "#025135",
					shadowOffset: {
						width: 0,
						height: 15,
					},
					shadowOpacity: 0.34,
					shadowRadius: 31.27,
					flexDirection: 'column'
				}}>


					<View style={[styles.customerItem, { marginTop: 25 }]}>
						<View style={{}}>
							<View style={{ flexDirection: 'row', }}>

								<View style={{ marginLeft: 18 }}>
									<Text style={[styles.customerName, { color: colors.title, ...FONTS.fontSemiBold }]}>{customer.customer_name + "static"}</Text>
									<Text style={[styles.lastInteraction, { color: colors.title }]}>{customer.last_updated_date}</Text>

								</View>

							</View>

						</View>

						<View style={{ flexDirection: "column", alignItems: "center", position: "relative", }}>
							<Text style={{ color: customer.transaction_type === "CREDIT" ? COLORS.primary : COLORS.danger, fontSize: 18, fontWeight: "900" }} > ₹ {customer.amount}</Text>
							<Text style={[styles.type, { color: colors.title }]}>{customer.transaction_type}</Text>
						</View>

					</View>
					<View style={{ flexDirection: "row", alignItems: 'center', justifyContent: "center", marginTop: 20 }}>

						<Text style={{
							color: colors.title, ...FONTS.fontBold, marginRight: 5, fontSize
								: 16
						}}>
							Transaction ID :
							{/* <Feather name='arrow-right' size={16} color={COLORS.white} /> */}
						</Text>
						<Text style={{ color: colors.title, ...FONTS.fontBold, fontSize: 16 }}>
							{customer.transaction_id}
							{/* <Feather name='arrow-right' size={16} color={COLORS.white} /> */}
						</Text>

					</View>
				</View>
				<View style={{
					height: 140,
					width: 380,
					top: 40,
					backgroundColor: colors.card,
					borderRadius: 31,
					shadowColor: "#025135",
					shadowOffset: {
						width: 0,
						height: 15,
					},
					shadowOpacity: 0.34,
					shadowRadius: 31.27,
					// elevation: 8,
					flexDirection: 'column'
				}}>
					<View style={{ borderBottomWidth: 1, height: 50 }} >
						<Text style={{ ...FONTS.fontSemiBold, fontSize: 18, color: colors.title, marginLeft: 20, top: 10 }}>Description</Text>
					</View>
					<View >
						<Text style={{ ...FONTS.fontSemiBold, fontSize: 14, color: colors.title, margin: 15, textAlign: "justify" }}>
							{customer.description + "ejwkgbriwbru"}
						</Text>
					</View>


				</View>

				{/* {customer?.image !== "" && <View style={{
					height: 180,
					width: 380,
					top: 40,
					marginTop: 20,
					backgroundColor: colors.card,
					borderRadius: 31,
					shadowColor: "#025135",
					shadowOffset: {
						width: 0,
						height: 15,
					},
					shadowOpacity: 0.34,
					shadowRadius: 31.27,
					// elevation: 8,
					flexDirection: 'column',

				}}>
					<View style={{ borderBottomWidth: 1, height: 50 }} >
						<Text style={{ ...FONTS.fontSemiBold, fontSize: 18, color: colors.title, marginLeft: 20, top: 10 }}>Attached Bill Reciept</Text>
					</View>

					< TouchableOpacity onPress={handlePreview} >
						<View style={{ paddingHorizontal: 15, top: 10 }}  >
							<Image
								style={{ height: 110, width: 350, borderRadius: 10 }}
								source={{ uri: customer?.image }}
							/>
						</View>
					</TouchableOpacity >



				</View>} */}
			</View>
			<View style={{ paddingHorizontal: 20, marginBottom: 30 }}>
				<ButtonIcon title='Share' iconDirection='right' icon={<FontAwesome style={{ color: COLORS.white, marginLeft: 10 }} name={'share'} size={18} />}>
				</ButtonIcon>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({

	TextInput: {
		...FONTS.fontRegular,
		fontSize: 16,
		color: COLORS.title,
		height: 60,
		borderRadius: 61,
		paddingHorizontal: 20,
		paddingLeft: 30,
		borderWidth: 1,
		//  borderColor:'#EBEBEB',
		backgroundColor: '#FAFAFA',
		marginBottom: 10

	},


	customerItem: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: 15,
		borderRadius: 18,
		shadowColor: "#025135",
		shadowOffset: {
			width: 0,
			height: 15,
		},
		shadowOpacity: 0.34,
		shadowRadius: 31.27,
		marginHorizontal: 10,
		marginVertical: 4,
		top: 4
	},
	customerName: {
		color: COLORS.title,
		fontSize: 22,
	},
	lastInteraction: {
		color: 'white',
		opacity: 0.6,
		fontSize: 16,
	},
	type: {
		color: COLORS.title,
		fontSize: 16,
		...FONTS.fontBold,
		marginTop: 5

	},
	button: {
		width: 380,
		height: 60,
		backgroundColor: COLORS.primary,
		marginBottom: 20,
		padding: 15, // 15px padding around the button content
		borderRadius: 12, // Circular button
		elevation: 5,  // Shadow for Android
		shadowColor: '#000',  // Shadow for iOS
		shadowOffset: { width: 0, height: 4 },  // Shadow offset for iOS
		shadowOpacity: 0.2,  // Shadow opacity for iOS

		// Shadow blur radius for iOS
	},
	buttonText: {
		color: Colors.white,
		fontSize: 16,
		fontWeight: 'bold',
		textAlign: "center"
	},

	header: {
		height: 60,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		backgroundColor: COLORS.card,
	},

	actionBtn: {
		height: 35,
		width: 35,
		borderRadius: 8,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: COLORS.background,

	}
})

export default LedgerCustomerDetails;
