import React, { useRef, useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, TextInput, StyleSheet, SafeAreaView, FlatList, ActivityIndicator } from 'react-native';
import { useFocusEffect, useTheme } from '@react-navigation/native';
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
import Button from '../../components/Button/Button';

interface Customer {
	id: string;
	ledger_book_customers_id: string;
	name: string;
	amount: string;
	joined_at: string;
	last_updated_date: string;
	transaction_type: string;
	description: string,
	image: any;
	mobile: any;
};
// {
// 	"amount": "3838.00",
// 	"created_at": "2024-11-10T14:23:49.000000Z",
// 	"description": "Jewhsgubu",
// 	"id": 9,
// 	"image": "1731248629.jpg",
// 	"ledger_book_customers_id": "10",
// 	"status": 1,
// 	"transaction_date": "2024-11-10",
// 	"transaction_type": "DEBIT",
// 	"updated_at": "2024-11-10T14:23:49.00`0000Z",
// 	"user_id": "1"
// }





type LedgerCustomerDetailsScreenProps = StackScreenProps<RootStackParamList, 'LedgerCustomerDetails'>

export const LedgerCustomerDetails = ({ navigation, route }: LedgerCustomerDetailsScreenProps) => {
	const { item } = route.params;
	// const { customer } = route.params;

	const [customerData, setCustomersData] = useState<any>({});
	const [isLoading, setIsLoading] = useState<any>(false);

	const theme = useTheme();
	const { colors }: { colors: any; } = theme;


	const [modalVisible, setModalVisible] = useState(false)
	const handlePreview = () => {
		setModalVisible(true);
	}

	useFocusEffect(
		useCallback(() => {
			fetchCustomerTransactionList();
		}, [])
	);

	const fetchCustomerTransactionList = async () => {
		setIsLoading(true);
		const res = await ApiService.postWithToken(
			"api/ledger-book/customer/transactions/list",
			{ "ledger_book_customers_id": item?.id });
		console.log("hero########", res);
		setCustomersData(res);
		setIsLoading(false);
	}

	const renderCustomer = ({ item }: { item: Customer }) => (
		<TouchableOpacity onPress={() => navigation.navigate("LedgerCustomerTransationsDetails", { customer: item })
		}>
			<View style={[styles.customerItem, { backgroundColor: colors.card, },
				// !theme.dark && { elevation: 2 }

			]}>
				<View style={{}}>
					<View style={{ flexDirection: 'row' }}>
						<View style={{ marginLeft: 14, }}>
							{/* <Text style={{ ...styles.lastInteraction, color: !theme.dark ? "black" : 'white' }}>{item.last_updated_date}</Text> */}
							<Text style={{ color: colors.text, fontSize: 12 }}>{item.transaction_date}
							</Text>
							<Text style={{ fontSize: 13, color: !theme.dark ? "black" : 'white' }}>{item.description}</Text>
						</View>
					</View>
				</View>
				<View style={{ flexDirection: "column", alignItems: "flex-end", position: "relative", justifyContent: 'center' }}>
					<Text style={{ color: item.transaction_type === "CREDIT" ? COLORS.primaryLight : COLORS.danger, fontSize: 15, fontWeight: "900" }}>₹ {parseInt(item.amount).toLocaleString()}</Text>
					<Text style={[styles.type, { color: colors.title }]}>{item.transaction_type}</Text>
				</View>
			</View>
		</TouchableOpacity>

	);


	return (
		<View style={{ backgroundColor: colors.card, flex: 1 }}>

			<Header
				title={item?.name}
				leftIcon='back'
				titleRight
			/>


			<ScrollView showsVerticalScrollIndicator={true}>
				<View style={{ flex: 1, alignItems: 'center' }} >
					<View style={{
						height: 70,
						width: "90%",
						top: 15,
						backgroundColor: colors.primary,
						borderRadius: 15,
						shadowColor: "#025135",
						shadowOffset: {
							width: 0,
							height: 15,
						},
						shadowOpacity: 0.34,
						shadowRadius: 31.27,
						elevation: 8,
						flexDirection: 'column',
						alignItems: "center",
						marginVertical: 30
					}}>


						<View style={{
							width: "90%",
							flexDirection: 'row',
							justifyContent: "space-evenly",
							paddingTop: 20,
							alignItems: "center",
							alignContent: "center"
						}}>
							<View style={{
								alignItems: 'center',
								justifyContent: 'center',
								borderRightColor: colors.dark
							}}>
								<Text style={{
									...FONTS.fontSemiBold,
									fontSize: SIZES.h5,
									color: 'white',
									textAlign: "center"
								}}>{customerData?.data?.transaction_sum?.transaction_type} </Text>
							</View>
							<View style={{ alignItems: 'center', justifyContent: "center" }}>
								<Text style={{ ...FONTS.fontSemiBold, fontSize: SIZES.h5, color: 'white' }}>₹ {customerData.data?.transaction_sum?.updated_amount}</Text>
							</View>
						</View>
					</View>
				</View>

				{
					isLoading === false ?
						<FlatList scrollEnabled={false}
							data={customerData?.data?.records}
							renderItem={renderCustomer}
							keyExtractor={(item) => item.id}
							contentContainerStyle={{}}

						/> : <View style={{ flex: 1, justifyContent: 'center' }} >
							<ActivityIndicator color={colors.title} size={'large'}></ActivityIndicator>
						</View>
				}

			</ScrollView>
			<View style={{ flexDirection: 'row', alignItems: "center", justifyContent: 'space-evenly', paddingVertical: 20, }}>
				<Button title='DEBIT'
					color={colors.primary}
					style={{ paddingHorizontal: 60, }}
					onPress={() => navigation.navigate("LedgerAddPayment", { item: item, transaction_type: "DEBIT", existPayment: false })} />
				<Button title='CREDIT'
					color={colors.primary}
					style={{ paddingHorizontal: 60, }}
					onPress={() => navigation.navigate("LedgerAddPayment", { item: item, transaction_type: "CREDIT", existPayment: false })} />
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
		backgroundColor: '#FAFAFA',
		marginBottom: 10

	},
	customerList: {
		marginBottom: 100,
	},
	customerItem: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 15,
		shadowRadius: 31.27,
		marginHorizontal: 10,
		marginVertical: 4,
		top: 4,
		borderBottomColor: "black",
		borderBottomWidth: 0.2
	},
	customerName: {
		color: COLORS.title,
		fontSize: SIZES.fontLg,
	},
	lastInteraction: {
		fontSize: SIZES.font,
		fontWeight: 'bold'
	},
	type: {
		color: COLORS.title,
		fontSize: SIZES.fontXs,
		...FONTS.fontSemiBold,
	},

	amount: {
		color: 'red',
		fontSize: SIZES.font,
		textAlign: "center"
	},

	amountZero: {
		color: '#121221',
		fontSize: 18,
	},
	addAmmount: {
		backgroundColor: COLORS.primary,
		padding: 15, // 15px padding around the button content
		borderRadius: 10, // Circular button
		elevation: 5,  // Shadow for Android
		shadowColor: '#000',  // Shadow for iOS
		shadowOffset: { width: 0, height: 4 },  // Shadow offset for iOS
		shadowOpacity: 0.2,  // Shadow opacity for iOS

		// Shadow blur radius for iOS
	},
	removeBtn: {
		backgroundColor: 'red', // Matches the button's background color from CSS
		padding: 15, // 15px padding around the button content
		borderRadius: 10, // Circular button
		elevation: 5,  // Shadow for Android
		shadowColor: '#000',  // Shadow for iOS
		shadowOffset: { width: 0, height: 4 },  // Shadow offset for iOS
		shadowOpacity: 0.2,
	},
	addButtonText: {
		color: COLORS.white,
		fontSize: 20,
		fontWeight: 'bold',
		paddingLeft: 40,
		paddingRight: 40
	},

	header: {
		height: 60,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		backgroundColor: COLORS.card,
	},
	title: {
		fontSize: 20,
		...FONTS.fontMedium,
	},
	actionBtn: {
		height: 35,
		width: 35,
		borderRadius: 8,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: COLORS.background
	}
})

export default LedgerCustomerDetails;
