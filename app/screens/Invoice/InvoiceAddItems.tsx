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

export const InvoiceAddItems = ({ navigation }) => {
	const [items, setItems] = useState([
		{ id: 0, title: "", quantity: "", price: "", tax: "10", discount: "0", includeTax: false },
	]);

	useEffect(() => {

	}, []);

	const handleAddItem = () => {
		const newItem = {
			id: items.length,
			title: "",
			quantity: "",
			price: "",
			tax: "10",
			discount: "0",
			includeTax: false,
		};
		setItems([...items, newItem]);
	};

	const handleRemoveItem = (id) => {
		if (items.length === 1) {
			Alert.alert("Error", "At least one item is required.");
			return;
		}
		const updatedItems = items.filter((item) => item.id !== id);
		setItems(updatedItems);
	};

	const handleChange = (id, field, value) => {
		const updatedItems = items.map((item) =>
			item.id === id ? { ...item, [field]: value } : item
		);
		setItems(updatedItems);
	};

	useEffect(() => {
		getitemsFromStorage();
	}, []);
	useEffect(() => {
		setItemsFromStorage(items);
	}, [items])
	const calculateTotalPrice = (item) => {
		const basePrice = parseFloat(item.price || "0") * parseInt(item.quantity || "0");
		const discountAmount = (basePrice * parseFloat(item.discount || "0")) / 100;
		const priceAfterDiscount = basePrice - discountAmount;
		const taxAmount = (priceAfterDiscount * parseFloat(item.tax || "0")) / 100;
		return item.includeTax ? priceAfterDiscount + taxAmount : priceAfterDiscount;
	};

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

		await StorageService.setStorage(CONFIG.HARDCODE_VALUES.INVOICE_GEN_SESSION.ITEM_INFO, JSON.stringify(data));
		navigation.navigate("InvoiceCreate");
	};

	const getitemsFromStorage = async () => {
		const itemObj = await StorageService.getStorage(CONFIG.HARDCODE_VALUES.INVOICE_GEN_SESSION.ITEM_INFO);
		if (itemObj != null) {
			const items = JSON.parse(itemObj);
			setItems(items);
		}
	}
	const setItemsFromStorage = async (items: any) => {
		const itemObj = await StorageService.setStorage(CONFIG.HARDCODE_VALUES.INVOICE_GEN_SESSION.ITEM_INFO, JSON.stringify(items));
		if (itemObj != null) {
			const items = JSON.parse(itemObj);
			setItems(items);
		}
	}

	return (
		<SafeAreaView style={styles.container}>
			<Header leftIcon="back" title="Add New Items" />
			<ScrollView contentContainerStyle={styles.scrollContainer}>
				{items.map((item) => (
					<View key={item.id} style={styles.card}>
						<View style={styles.headerRow}>
							<Text style={styles.cardTitle}>Item {item.id + 1}</Text>
							<TouchableOpacity
								onPress={() => handleRemoveItem(item.id)}
								style={styles.removeButton}
							>
								<Text style={styles.removeText}>✕</Text>
							</TouchableOpacity>
						</View>

						<Text style={styles.label}>Item Title</Text>
						<TextInput
							style={styles.input}
							placeholder="Enter item title"
							value={item.title}
							onChangeText={(text) => handleChange(item.id, "title", text)}
						/>

						<View style={styles.row}>
							<View style={styles.halfInputContainer}>
								<Text style={styles.label}>Quantity</Text>
								<TextInput
									style={styles.input}
									placeholder="Enter quantity"
									value={item.quantity}
									onChangeText={(text) => handleChange(item.id, "quantity", text)}
									keyboardType="numeric"
								/>
							</View>

							<View style={styles.halfInputContainer}>
								<Text style={styles.label}>Price</Text>
								<TextInput
									style={styles.input}
									placeholder="Enter price"
									value={item.price}
									onChangeText={(text) => handleChange(item.id, "price", text)}
									keyboardType="numeric"
								/>
							</View>
						</View>

						<Text style={styles.label}>Discount (%)</Text>
						<TextInput
							style={styles.input}
							placeholder="Enter discount"
							value={item.discount}
							onChangeText={(text) => handleChange(item.id, "discount", text)}
							keyboardType="numeric"
						/>

						<Text style={styles.label}>Tax (%)</Text>
						<TextInput
							style={styles.input}
							placeholder="Enter tax"
							value={item.tax}
							onChangeText={(text) => handleChange(item.id, "tax", text)}
							keyboardType="numeric"
						/>

						<View style={styles.switchContainer}>
							<Text style={styles.switchLabel}>Include Tax in Price?</Text>
							<Switch
								value={item.includeTax}
								onValueChange={(value) => handleChange(item.id, "includeTax", value)}
							/>
						</View>

						<Text style={styles.totalPrice}>
							Total: ₹{calculateTotalPrice(item).toFixed(2)}
						</Text>
					</View>
				))}

				<TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
					<Text style={styles.addButtonText}>+ Add New Item</Text>
				</TouchableOpacity>

				<TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
					<Text style={styles.submitButtonText}>Submit Invoice</Text>
				</TouchableOpacity>
			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f0f4f7",
	},
	scrollContainer: {
		padding: 20,
	},
	card: {
		backgroundColor: "#fff",
		borderRadius: 15,
		padding: 20,
		marginBottom: 15,
		elevation: 4,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.1,
		shadowRadius: 8,
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
		color: "#333",
	},
	removeButton: {
		backgroundColor: "#ff4d4d",
		padding: 5,
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
		color: "#555",
		marginBottom: 5,
	},
	input: {
		borderWidth: 1,
		borderColor: "#ddd",
		borderRadius: 10,
		padding: 12,
		marginBottom: 10,
		fontSize: 16,
		backgroundColor: "#fafafa",
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
		color: "#555",
	},
	totalPrice: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#007bff",
		textAlign: "center",
		marginVertical: 10,
	},
	addButton: {
		backgroundColor: "#007bff",
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
		backgroundColor: "#28a745",
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