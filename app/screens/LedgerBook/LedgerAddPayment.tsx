import { useTheme, useFocusEffect } from '@react-navigation/native';
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Image, TextInput, TouchableOpacity, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import Header from '../../layout/Header';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { COLORS, FONTS } from '../../constants/theme';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import { FontAwesome } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import ButtonIcon from '../../components/Button/ButtonIcon';
import useImagePicker from '../../customHooks/ImagePickerHook';
import { ApiService } from '../../lib/ApiService';
import { MessagesService } from '../../lib/MessagesService';
import { ActivityIndicator } from 'react-native-paper';
import { IMAGES } from '../../constants/Images';

type LedgerAddPaymentScreenProps = StackScreenProps<RootStackParamList, 'LedgerAddPayment'>;

const LedgerAddPayment = ({ navigation, route }: LedgerAddPaymentScreenProps) => {
	const { item, transaction_type, existPayment }: any = route.params;

	const { image, pickImage, takePhoto }: any = useImagePicker();

	const [amount, setAmount] = useState<String>("");
	const [description, setDescription] = useState<String>("");


	const [givenDate, setGivenDate] = useState<String>("");
	const [takenDate, setTakenDate] = useState(`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')} ${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}:${String(new Date().getSeconds()).padStart(2, '0')}`);


	const [inputDateType, setInputDateType] = useState<String>("");
	const [isLoading, setIsLoading] = useState(false)

	const theme = useTheme();
	const { colors }: { colors: any } = theme;

	const [date, setDate] = useState(new Date());
	const [show, setShow] = useState(false);


	const onChange = (event: any, selectedDate: any) => {
		const currentDate = selectedDate || date;
		setShow(false);
		setDate(new Date());

		if (inputDateType == "Given Date") {
			setGivenDate(`${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`);
		} else {
			setTakenDate(`${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`);
		}
	};

	const showDatepicker = (inputeDatetype: string) => {
		setInputDateType(inputeDatetype);
		setShow(true);
	};


	const fetchAddPaymentData = async () => {
		const data: any = {
			ledger_book_customers_id: item?.id,
			amount: amount,
			transaction_type: transaction_type,
			description: description,
			transaction_date: takenDate,
			transaction_id: item?._id,
			image: image,

		}

		if (amount.length == 0) {
			MessagesService.commonMessage(`Please enter amount that you want to ${transaction_type}`);
			return;
		}
		if (existPayment == true && item.amount < amount) {
			MessagesService.commonMessage(`Enter Amount must be smaller than pending amount`);
			return;
		}


		setIsLoading(true);
		ApiService.postWithToken("api/ledger-book/customer/transactions/add", data).then((res) => {
			console.log("************", res);
			if (res.status == true) {
				MessagesService.commonMessage(res.message, "SUCCESS");
				navigation.goBack();
			}
			setIsLoading(false);
		});
	};

	return (

		<View style={{ backgroundColor: colors.background, flex: 1, }}>
			<Header
				title={"Ledger Book Add Payment"}
				leftIcon='back'
				titleRight
			/>
			<KeyboardAvoidingView>
				<ScrollView contentContainerStyle={{ flexGrow: 1, padding: 15 }}>
					<View style={{
						flex: 1,
						alignItems: 'center',
					}}>
						<Image
							source={theme.dark ? IMAGES.appnamedark : IMAGES.appname}
							style={{
								height: 110,
								width: 150,
								objectFit: "contain",
							}}
						/>
					</View>
					<View style={[GlobalStyleSheet.card, { backgroundColor: colors.card }]}>
						<View style={GlobalStyleSheet.cardBody}>
							<View style={{ marginBottom: 10 }}>
								<Input
									// keyboardType='numeric'
									icon={<FontAwesome style={{ opacity: .6 }} name={'rupee'} size={20} color={colors.text} />}
									placeholder="Enter amount"
									onChangeText={amount => setAmount(amount)}
									defaultValue={existPayment ? String(item.amount) : ''}
								/>
							</View>
							<View style={{ marginBottom: 10 }}>
								<Input
									multiline={true}
									placeholder="Enter Details (Item Name, Bill no)"
									onChangeText={description => setDescription(description)}
								/>
							</View>
							<View style={{ display: 'flex', justifyContent: 'center' }}>
								{show && (
									<View style={{ alignSelf: 'center' }}>
										<DateTimePicker
											value={date}
											mode="date"
											display="default"
											onChange={onChange}
										/>
									</View>
								)}
							</View>
							<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: "center", marginTop: 12, flexWrap: 'wrap' }}>
								{/* <View>
                                    <Text>{transaction_type === 'CREDIT' ? 'Transaction Date' : 'Taken Date'}</Text>
                                    <ButtonIcon
                                        onPress={() => showDatepicker('Taken Date')}
                                        size={'sm'}
                                        title={takenDate || date.toLocaleDateString()}
                                        icon={<FontAwesome style={{ opacity: 1 }} name={'calendar'} size={20} color={COLORS.white} />}
                                    />

                                </View> */}

								{/* <View>
									<Text style={{ color: colors.title, margin: 5 }}>Last Date</Text>
									<ButtonIcon onPress={() => showDatepicker('Given Date')}
										size={'sm'}
										color={colors.primary}
										title={givenDate || date.toLocaleDateString()}
										iconDirection='right'
										icon={<FontAwesome style={{ opacity: 1 }} name={'calendar'} size={20} color={COLORS.white} />}
									/>
								</View> */}

								{!existPayment &&
									<View style={{ marginTop: 20 }}>
										<ButtonIcon onPress={pickImage}
											size={'sm'}
											color={colors.primary}
											title='Attach bills'
											iconDirection='left'
											icon={<FontAwesome style={{ opacity: 1, color: COLORS.white }}
												name={'camera'}
												size={20}
												color={colors.white} />}
										/>
									</View>
								}
							</View>
						</View>
					</View>
					{image && (
						<Image
							source={{ uri: image }}
							style={{ width: 300, height: 300, alignSelf: 'center' }}
						/>
					)}
					<View style={[GlobalStyleSheet.container,]}>
						{
							isLoading === false ?
								<Button
									title={"Submit"}
									color={colors.primary}
									textColor={COLORS.card}
									onPress={fetchAddPaymentData}
									style={{ borderRadius: 12 }}
								/> : <ActivityIndicator size={70} color={COLORS.primary} />
						}
					</View>
				</ScrollView>

			</KeyboardAvoidingView>

		</View>

	)
}

const styles = StyleSheet.create({
	tracktitle: {
		...FONTS.fontMedium,
		fontSize: 10,
		color: COLORS.title
	},
	tracktitle2: {
		...FONTS.fontMedium,
		fontSize: 13,
		color: COLORS.card
	},
	addresscard: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		borderBottomWidth: 1,
		borderStyle: 'dashed',
		marginHorizontal: -15,
		paddingHorizontal: 15,
		paddingBottom: 15,
		borderBottomColor: COLORS.inputborder
	},
	bottomBtn: {
		height: 75,
		width: '100%',
		backgroundColor: COLORS.card,
		justifyContent: 'center',
		paddingHorizontal: 15,
		shadowColor: "#000",
		shadowOffset: {
			width: 2,
			height: 2,
		},
		shadowOpacity: .1,
		shadowRadius: 5,
	}
})

export default LedgerAddPayment;