import React, { useCallback, useState, useEffect } from "react";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	SafeAreaView,
	ScrollView,
	Switch,
	TextInput,
	Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import Header from "../../layout/Header";
import { useFocusEffect, useTheme } from "@react-navigation/native";
import StorageService from "../../lib/StorageService";
import CONFIG from "../../constants/config";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import { MessagesService } from "../../lib/MessagesService";

type InvoiceCreateProps = StackScreenProps<RootStackParamList, 'InvoiceCreate'>

export const InvoiceCreate = ({ navigation }: InvoiceCreateProps) => {
	const theme = useTheme();
	const { colors } = theme;

	const [items, setItems] = useState([]);
	const [invoiceName, setInvoiceName] = useState("#1");
	const [organization, setOrganization] = useState({ id: 0, name: '', email: '' });
	const [client, setClient] = useState({ id: 0, name: '', email: '', phone: '' });
	const [isFullPaymentReceived, setIsFullPaymentReceived] = useState(false);
	const [showReceivedAmount, setShowReceivedAmount] = useState(false);
	const [receivedAmount, setReceivedAmount] = useState('');
	const [expectedDate, setExpectedDate] = useState(null);
	const [showDatePicker, setShowDatePicker] = useState(false);

	useEffect(() => {
		if (isFullPaymentReceived) {
			setReceivedAmount(calculateTotal());
			setExpectedDate(null);
			setShowReceivedAmount(false);
		} else {
			setReceivedAmount('');
		}
	}, [isFullPaymentReceived]);

	useFocusEffect(
		useCallback(() => {
			getAllSessionValue();
		}, [])
	);
	const getAllSessionValue = async () => {
		const organizationObj = await StorageService.getStorage(CONFIG.HARDCODE_VALUES.INVOICE_GEN_SESSION.ORGANIZATION_INFO);
		const clientObj = await StorageService.getStorage(CONFIG.HARDCODE_VALUES.INVOICE_GEN_SESSION.CLIENT_INFO);
		const itemObj = await StorageService.getStorage(CONFIG.HARDCODE_VALUES.INVOICE_GEN_SESSION.ITEM_INFO);
		if (organizationObj != null) {
			const organization = JSON.parse(organizationObj);
			setOrganization(organization);
		}
		// const organizationObj = await StorageService.getStorage(CONFIG.HARDCODE_VALUES.INVOICE_GEN_SESSION.ORGANIZATION_INFO);
		if (clientObj != null) {
			const client = JSON.parse(clientObj);
			setClient(client);
		}
		if (itemObj != null) {
			const items = JSON.parse(itemObj);
			setItems(items);
		}

	}

	// Handle item removal
	const handleRemoveItem = (id: any) => {
		const updatedItems = items.filter((item) => item.id !== id);
		setItems(updatedItems);
	};

	// Calculate total price per item
	const calculateItemTotal = (item: any) => {
		const basePrice = parseFloat(item.price || "0") * parseInt(item.quantity || "0");
		return basePrice;
		// const discountAmount = (basePrice * parseFloat(item.discount || "0")) / 100;
		// const priceAfterDiscount = basePrice - discountAmount;
		// const taxAmount = (priceAfterDiscount * parseFloat(item.tax || "0")) / 100;
		// return item.includeTax ? priceAfterDiscount + taxAmount : priceAfterDiscount;
	};

	// Calculate subtotal (sum of all items)
	const calculateSubtotal = () => {
		return items
			.reduce((total, item) => total + calculateItemTotal(item), 0)
			.toFixed(2);
	};

	// Calculate total discount
	const calculateDiscount = () => {
		return items
			.reduce((total, item) => {
				const basePrice = parseFloat(item.price || "0") * parseInt(item.quantity || "0");
				return total + (basePrice * parseFloat(item.discount || "0")) / 100;
			}, 0)
			.toFixed(2);
	};

	// Calculate total tax
	const calculateTax = () => {
		return items
			.reduce((total, item) => {
				const basePrice = parseFloat(item.price || "0") * parseInt(item.quantity || "0");
				const discountAmount = (basePrice * parseFloat(item.discount || "0")) / 100;
				const priceAfterDiscount = basePrice - discountAmount;
				return total + (priceAfterDiscount * parseFloat(item.tax || "0")) / 100;
			}, 0)
			.toFixed(2);
	};

	// Grand total = subtotal + tax - discount
	const calculateTotal = () => {
		return (
			parseFloat(calculateSubtotal()) +
			parseFloat(calculateTax()) -
			parseFloat(calculateDiscount())
		).toFixed(2);
	};


	const handleDateChange = (event: any, selectedDate: any) => {
		setShowDatePicker(false);
		if (selectedDate) {
			setExpectedDate(selectedDate.toISOString().split('T')[0]);
		}
	};

	const generateInvoice = async () => {
		let totalGrandNum = Number(calculateTotal());
		if (organization.id === 0) {
			Alert.alert("Error", "Please Select Organization", [{ text: "OK" }], {
				cancelable: false,
			});
		} else if (client.id === 0) {
			Alert.alert("Error", "Please Select Client", [{ text: "OK" }], {
				cancelable: false,
			});
		} else if (items.length === 0) {
			Alert.alert("Error", "Please Select Items", [{ text: "OK" }], {
				cancelable: false,
			});
		} else if (totalGrandNum <= 0) {
			Alert.alert("Error", "Invalid Item", [{ text: "OK" }], {
				cancelable: false,
			});
		}
		else if (!isFullPaymentReceived && Number(receivedAmount) <= 0) {
			Alert.alert("Error", "Received Amount is required", [{ text: "OK" }], {
				cancelable: false,
			});
		}
		else if (!isFullPaymentReceived && expectedDate == null) {
			Alert.alert("Error", "Expected Date is required", [{ text: "OK" }], {
				cancelable: false,
			});
		}
		else {
			let api_info = {
				name: invoiceName,
				company_id: organization.id,
				client_id: client.id,
				item_info: items,
				grand_total_amount: calculateTotal(),
				received_amount: receivedAmount,
				expected_given_data: expectedDate,
			};
			navigation.navigate("ChooseInvoiceDesign", { data: api_info });
		}
	};

	// Existing item handling and calculation functions...

	const calculatePendingAmount = () => {
		const total = parseFloat(calculateTotal());
		const received = parseFloat(receivedAmount) || 0;
		return (total - received).toFixed(2);
	};

	return (
		<>
			<Header leftIcon="back" title="Create Invoice" />
			<SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
				<ScrollView>


					{/* Existing organization, client, and items sections... */}
					<View style={styles.section}>
						<Text style={[styles.sectionTitle, { color: colors.title }]}>Organization</Text>
						<TouchableOpacity
							style={[styles.orgClientCard, { backgroundColor: colors.card }]}
							onPress={() => navigation.navigate("InvoiceOrganizations")}
						>
							<MaterialIcons name="business" size={24} color="#007bff" />
							<View style={styles.cardDetails}>
								<Text style={[styles.cardTitle, { color: colors.title }]}>{organization.name}</Text>
								<Text style={styles.cardSubtitle}>{organization.email}</Text>
							</View>
							<MaterialIcons name="keyboard-arrow-right" size={24} color="#aaa" />
						</TouchableOpacity>
					</View>

					{/* Client Section */}
					<View style={styles.section}>
						<Text style={[styles.sectionTitle, { color: colors.title }]}>Client</Text>
						<TouchableOpacity
							style={[styles.orgClientCard, { backgroundColor: colors.card }]}
							onPress={() => navigation.navigate("InvoiceClients")}
						>
							<MaterialIcons name="person" size={24} color="#28a745" />
							<View style={styles.cardDetails}>
								<Text style={[styles.cardTitle, { color: colors.title }]}>{client.name}</Text>
								<Text style={styles.cardSubtitle}>{client.email}</Text>
							</View>
							<MaterialIcons name="keyboard-arrow-right" size={24} color="#aaa" />
						</TouchableOpacity>
					</View>

					{/* Items Section */}
					<View style={styles.section}>
						<Text style={[styles.sectionTitle, { color: colors.title }]}>Items</Text>

						{items.map((item: any) => (
							<View key={item.id} style={[styles.card, { backgroundColor: colors.card }]}>
								<View style={styles.cardContent}>
									<Text style={[styles.itemTitle, { color: colors.title }]}>{item.title}</Text>
									<Text style={[, { color: colors.title }]}>
										₹{item.price} x {item.quantity}
									</Text>
									<Text style={styles.itemDiscount}>
										Discount: {item.discount}%
									</Text>
									<Text style={[styles.itemTax, { color: colors.title }]}>
										Tax: {item.tax}% {item.includeTax ? "(Included)" : "(Excluded)"}
									</Text>
									<Text style={styles.itemTotal}>
										Total: ₹{calculateItemTotal(item).toFixed(2)}
									</Text>
								</View>
								<TouchableOpacity onPress={() => handleRemoveItem(item.id)}>
									<MaterialIcons name="delete" size={24} color="#ff4d4d" />
								</TouchableOpacity>
							</View>
						))}

						<TouchableOpacity
							style={styles.addItemButton}
							onPress={() => navigation.replace("InvoiceAddItems")}
						>
							<MaterialIcons name="add-circle" size={20} color="#007bff" />
							<Text style={styles.addItemText}>Add New Item</Text>
						</TouchableOpacity>
					</View>

					{/* Totals Section */}
					<View style={styles.section}>
						<View style={styles.rowBetween}>
							<Text style={[styles.totalLabel, { color: colors.title }]}>Subtotal</Text>
							<Text style={[styles.totalValue, { color: colors.title }]}>₹{calculateSubtotal()}</Text>
						</View>
						<View style={styles.rowBetween}>
							<Text style={[styles.totalLabel, { color: colors.title }]}>Discount</Text>
							<Text style={[styles.totalValue, { color: colors.title }]}>-₹{calculateDiscount()}</Text>
						</View>
						<View style={styles.rowBetween}>
							<Text style={[styles.totalLabel, { color: colors.title }]}>Tax</Text>
							<Text style={[styles.totalValue, { color: colors.title }]}>+₹{calculateTax()}</Text>
						</View>
						<View style={[styles.rowBetween, styles.totalRow]}>
							<Text style={[styles.totalLabelBold, { color: colors.title }]}>Grand Total</Text>
							<Text style={styles.totalAmount}>₹{calculateTotal()}</Text>
						</View>
					</View>
					{/* Totals Section */}
					<View style={styles.section}>
						{/* Existing total calculations... */}
					</View>

					{/* Payment Section */}
					<View style={styles.section}>
						<Text style={[styles.sectionTitle, { color: colors.title }]}>Payment Details</Text>
						<View style={styles.rowBetween}>
							<Text style={[styles.totalLabel, { color: colors.title }]}>Full Payment Received?</Text>
							<Switch
								value={isFullPaymentReceived}
								onValueChange={setIsFullPaymentReceived}
							/>
						</View>

						{!isFullPaymentReceived && (
							<View>
								{/* <View style={[styles.rowBetween, { marginTop: 10 }]}>
									<Text style={styles.totalLabel}>Add Partial Payment?</Text>
									<Switch
										value={showReceivedAmount}
										onValueChange={setShowReceivedAmount}
									/>
								</View> */}

								<View style={{gap:10}}>
									<TextInput
										style={[styles.input,{backgroundColor: colors.card, color: colors.title}]}
										placeholder="Received Amount"
										placeholderTextColor={colors.title}
										keyboardType="numeric"
										value={receivedAmount}
										onChangeText={(val) => {
											console.log("valss", val)
											if (parseFloat(val) <= parseFloat(calculateTotal())) {
												setReceivedAmount(val)
											} else if (val == "" || val == null) {
												setReceivedAmount('')

											}
										}}
									/>
									{/* {setReceivedAmount } */}

									<TouchableOpacity
										onPress={() => setShowDatePicker(true)}
										style={styles.dateInputContainer}
									>
										<TextInput
											style={[styles.input,{backgroundColor:colors.card,color:colors.title}]}
											
                                            placeholderTextColor={colors.title}
											placeholder="Select Expected Date"
											value={expectedDate}
											editable={false}
										/>
										<MaterialIcons
											name="calendar-today"
											size={20}
											color="#666"
											style={[styles.dateIcon,{color:colors.title}]}
										/>
									</TouchableOpacity>

									{showDatePicker && (
										<DateTimePicker
											value={expectedDate ? new Date(expectedDate) : new Date()}
											mode="date"
											display="default"
											onChange={handleDateChange}
										/>
									)}

									<View style={[styles.amountSummary,{backgroundColor:colors.card}]}>
										<Text style={[styles.amountLabel,{color:colors.title}]}>Pending Amount:</Text>
										<Text style={styles.amountValue}>
											₹{calculatePendingAmount()}
										</Text>
									</View>
								</View>

							</View>
						)}
					</View>
					{/* Generate Invoice Button */}
					<View style={styles.footer}>
						<TouchableOpacity style={styles.footerButton} onPress={generateInvoice}>
							<Text style={styles.footerButtonText}>Generate Invoice</Text>
						</TouchableOpacity>
					</View>
				</ScrollView>
			</SafeAreaView>
		</>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f4f6f8",
	},
	section: {
		marginVertical: 10,
		paddingHorizontal: 20,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 10,
		color: "#333",
	},
	orgClientCard: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#fff",
		padding: 15,
		borderRadius: 10,

		marginBottom: 10,
	},
	cardDetails: {
		flex: 1,
		marginLeft: 10,
	},
	cardTitle: {
		fontSize: 16,
		fontWeight: "bold",
		color: "#333",
	},
	cardSubtitle: {
		fontSize: 14,
		color: "#777",
	},
	card: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#fff",
		padding: 15,
		borderRadius: 10,
		marginBottom: 10,
	},
	cardContent: {
		flex: 1,
	},
	itemTitle: {
		fontSize: 16,
		fontWeight: "bold",
		color: "#333",
	},
	itemSubtitle: {
		fontSize: 14,
		color: "#666",
		marginVertical: 4,
	},
	itemDiscount: {
		fontSize: 14,
		color: "#ff9800",
	},
	itemTax: {
		fontSize: 14,
		color: "#9c27b0",
	},
	itemTotal: {
		fontSize: 14,
		color: "#007bff",
		fontWeight: "bold",
		marginTop: 5,
	},
	addItemButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		marginTop: 10,
	},
	addItemText: {
		color: "#007bff",
		fontWeight: "bold",
		marginLeft: 5,
	},
	rowBetween: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginVertical: 5,
	},
	totalLabel: {
		fontSize: 16,
		color: "#555",
	},
	totalLabelBold: {
		fontWeight: "bold",
		fontSize: 18,
		color: "#333",
	},
	totalValue: {
		fontSize: 16,
		fontWeight: "bold",
	},
	totalAmount: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#007bff",
	},
	footer: {
		padding: 20,
	},
	footerButton: {
		backgroundColor: "#007bff",
		padding: 15,
		borderRadius: 12,
		alignItems: "center",
	},
	footerButtonText: {
		color: "#fff",
		fontSize: 18,
		fontWeight: "bold",
	},
	input: {
		height: 50,
		borderColor: '#ddd',
		borderWidth: 1,
		borderRadius: 8,
		paddingHorizontal: 12,
		
		fontSize: 16,
	},
	dateInputContainer: {
		position: 'relative',
	},
	dateIcon: {
		position: 'absolute',
		right: 15,
		top: 10,
		color: "#fff",
	},
	amountSummary: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginVertical: 10,
		padding: 12,
		backgroundColor: '#f8f9fa',
		borderRadius: 8,
	},
	amountLabel: {
		fontSize: 16,
		color: '#6c757d',
	},
	amountValue: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#dc3545',
	},
	totalRow: {

	}
	// Add other existing styles...
});

export default InvoiceCreate;