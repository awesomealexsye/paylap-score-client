import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	SafeAreaView,
	Switch,
	ScrollView,
	Alert,
} from "react-native";
import Header from "../../layout/Header";
import StorageService from "../../lib/StorageService";
import CONFIG from "../../constants/config";
import { useTheme } from "@react-navigation/native";

export const InvoiceAddItems = ({ navigation }) => {
	const theme = useTheme();
	const { colors } = theme;

	// Initialize with one blank item
	const [items, setItems] = useState([
		{ id: 0, title: "", quantity: "", price: "", tax: "0", discount: "0", includeTax: false },
	]);

	// Get stored items on mount
	useEffect(() => {
		getItemsFromStorage();
	}, []);

	// Save items to storage on change
	// useEffect(() => {
	// 	setItemsToStorage(items);
	// }, [items]);

	// Add new blank item
	const handleAddItem = () => {
		const newItem = {
			id: items.length,
			title: "",
			quantity: "",
			price: "",
			tax: "0",
			discount: "0",
			includeTax: false,
		};
		setItems([...items, newItem]);
	};

	// Remove an item (ensure at least one item remains)
	const handleRemoveItem = (id) => {
		if (items.length === 1) {
			Alert.alert("Error", "At least one item is required.");
			return;
		}
		const updatedItems = items.filter((item) => item.id !== id);
		setItems(updatedItems);
	};

	// Update a specific field in an item
	const handleChange = (id, field, value) => {
		const updatedItems = items.map((item) =>
			item.id === id ? { ...item, [field]: value } : item
		);
		setItems(updatedItems);
	};

	// Calculate total price per item
	const calculateTotalPrice = (item) => {
		const basePrice = parseFloat(item.price || "0") * parseInt(item.quantity || "0");
		const discountAmount = (basePrice * parseFloat(item.discount || "0")) / 100;
		const priceAfterDiscount = basePrice - discountAmount;
		const taxAmount = (priceAfterDiscount * parseFloat(item.tax || "0")) / 100;
		return item.includeTax ? priceAfterDiscount + taxAmount : priceAfterDiscount;
	};

	// Validate and submit items
	const handleSubmit = async () => {
		const isEmpty = items.some(
			(item) => !item.title || !item.quantity || !item.price || !item.tax
		);

		if (isEmpty) {
			Alert.alert("Error", "Please fill all required fields.");
			return;
		}

		const data = items.map((item) => ({
			...item,
			totalPrice: calculateTotalPrice(item),
		}));

		await StorageService.setStorage(
			CONFIG.HARDCODE_VALUES.INVOICE_GEN_SESSION.ITEM_INFO,
			JSON.stringify(data)
		);
		navigation.replace("InvoiceCreate");
	};

	// Get items from storage
	const getItemsFromStorage = async () => {
		const itemObj = await StorageService.getStorage(
			CONFIG.HARDCODE_VALUES.INVOICE_GEN_SESSION.ITEM_INFO
		);
		if (itemObj != null) {
			const storedItems = JSON.parse(itemObj);
			setItems(storedItems);
		}
	};

	// Save items to storage (without re‑setting state)
	const setItemsToStorage = async (items) => {
		await StorageService.setStorage(
			CONFIG.HARDCODE_VALUES.INVOICE_GEN_SESSION.ITEM_INFO,
			JSON.stringify(items)
		);
	};

	return (
		<>
			<Header leftIcon="back" title="Add New Items" />
			<SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
				<ScrollView contentContainerStyle={styles.scrollContainer}>
					{items.map((item, index) => (
						<View key={item.id} style={[styles.card, { backgroundColor: colors.card }]}>
							<View style={styles.headerRow}>
								<Text style={[styles.cardTitle, { color: colors.text }]}>
									Item {index + 1}
								</Text>
								<TouchableOpacity
									onPress={() => handleRemoveItem(item.id)}
									style={styles.removeButton}
								>
									<Text style={styles.removeText}>✕</Text>
								</TouchableOpacity>
							</View>

							<Text style={[styles.label, { color: colors.text }]}>Item Title</Text>
							<TextInput
								style={[
									styles.input,
									{ backgroundColor: colors.inputBackground, color: colors.text },
								]}
								placeholder="Enter item title"
								placeholderTextColor={colors.placeholder}
								value={item.title}
								onChangeText={(text) => handleChange(item.id, "title", text)}
							/>

							<View style={styles.row}>
								<View style={styles.halfInputContainer}>
									<Text style={[styles.label, { color: colors.text }]}>Quantity</Text>
									<TextInput
										style={[
											styles.input,
											{ backgroundColor: colors.inputBackground, color: colors.text },
										]}
										placeholder="Enter quantity"
										placeholderTextColor={colors.placeholder}
										value={item.quantity}
										onChangeText={(text) => handleChange(item.id, "quantity", text)}
										keyboardType="numeric"
									/>
								</View>

								<View style={styles.halfInputContainer}>
									<Text style={[styles.label, { color: colors.text }]}>Price</Text>
									<TextInput
										style={[
											styles.input,
											{ backgroundColor: colors.inputBackground, color: colors.text },
										]}
										placeholder="Enter price"
										placeholderTextColor={colors.placeholder}
										value={item.price}
										onChangeText={(text) => handleChange(item.id, "price", text)}
										keyboardType="numeric"
									/>
								</View>
							</View>

							<Text style={[styles.label, { color: colors.text }]}>Discount (%)</Text>
							<TextInput
								style={[
									styles.input,
									{ backgroundColor: colors.inputBackground, color: colors.text },
								]}
								placeholder="Enter discount"
								placeholderTextColor={colors.placeholder}
								value={item.discount}
								onChangeText={(text) => handleChange(item.id, "discount", text)}
								keyboardType="numeric"
							/>

							<Text style={[styles.label, { color: colors.text }]}>Tax (%)</Text>
							<TextInput
								style={[
									styles.input,
									{ backgroundColor: colors.inputBackground, color: colors.text },
								]}
								placeholder="Enter tax"
								placeholderTextColor={colors.placeholder}
								value={item.tax}
								onChangeText={(text) => handleChange(item.id, "tax", text)}
								keyboardType="numeric"
							/>

							<View style={styles.switchContainer}>
								<Text style={[styles.switchLabel, { color: colors.text }]}>
									Include Tax in Price?
								</Text>
								<Switch
									value={item.includeTax}
									onValueChange={(value) =>
										handleChange(item.id, "includeTax", value)
									}
									trackColor={{ false: "#ccc", true: colors.primary }}
									thumbColor={item.includeTax ? colors.primary : "#f4f3f4"}
								/>
							</View>

							<Text style={[styles.totalPrice, { color: colors.primary }]}>
								Total: ₹{calculateTotalPrice(item).toFixed(2)}
							</Text>
						</View>
					))}

					<TouchableOpacity
						style={[styles.addButton, { backgroundColor: colors.primary }]}
						onPress={handleAddItem}
					>
						<Text style={styles.addButtonText}>+ Add New Item</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={[styles.submitButton, { backgroundColor: colors.success || "#28a745" }]}
						onPress={handleSubmit}
					>
						<Text style={styles.submitButtonText}>Submit Invoice</Text>
					</TouchableOpacity>
				</ScrollView>
			</SafeAreaView>
		</>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	scrollContainer: {
		padding: 20,
		paddingBottom: 40,
	},
	card: {
		borderRadius: 15,
		padding: 20,
		marginBottom: 15,
		// Shadow for iOS
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		// Elevation for Android
		elevation: 3,
	},
	headerRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 10,
	},
	cardTitle: {
		fontSize: 18,
		fontWeight: "bold",
	},
	removeButton: {
		backgroundColor: "#ff4d4d",
		padding: 6,
		borderRadius: 50,
		width: 30,
		height: 30,
		alignItems: "center",
		justifyContent: "center",
	},
	removeText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "bold",
	},
	label: {
		fontSize: 14,
		marginBottom: 5,
	},
	input: {
		borderWidth: 1,
		borderColor: "#ddd",
		borderRadius: 10,
		padding: 12,
		marginBottom: 10,
		fontSize: 16,
	},
	row: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	halfInputContainer: {
		width: "48%",
	},
	switchContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginVertical: 10,
	},
	switchLabel: {
		fontSize: 16,
	},
	totalPrice: {
		fontSize: 18,
		fontWeight: "bold",
		textAlign: "center",
		marginVertical: 10,
	},
	addButton: {
		padding: 15,
		borderRadius: 10,
		alignItems: "center",
		marginVertical: 10,
	},
	addButtonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "bold",
	},
	submitButton: {
		padding: 18,
		borderRadius: 12,
		alignItems: "center",
		marginVertical: 20,
	},
	submitButtonText: {
		color: "#fff",
		fontSize: 18,
		fontWeight: "bold",
	},
});

export default InvoiceAddItems;