import React, { useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	SafeAreaView,
	FlatList,
	ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Header from "../../layout/Header";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";

import { COLORS, FONTS } from '../../constants/theme';
import { useTheme } from "@react-navigation/native";

interface InvoiceItem {
	id: string;
	title: string;
	price: number;
	quantity: number;
}

type InvoiceCreateProps = StackScreenProps<RootStackParamList, 'InvoiceCreate'>;

export const InvoiceCreate = ({ navigation }: InvoiceCreateProps) => {
	const theme = useTheme();
	const { colors }: { colors: any } = theme;

	const [items, setItems] = useState([
		{ id: "1", title: "Item title will be here", price: 6.95, quantity: 15 },
	]);

	const handleRemoveItem = (id: string) => {
		setItems(items.filter((item) => item.id !== id));
	};

	const handleAddItem = () => {
		const newItem: InvoiceItem = {
			id: Math.random().toString(),
			title: "New Item",
			price: 0,
			quantity: 1,
		};
		setItems([...items, newItem]);
	};

	const calculateSubtotal = () => {
		return items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
	};

	const calculateDiscount = () => {
		return (parseFloat(calculateSubtotal()) * 0.1).toFixed(2); // Example 10% discount
	};

	const calculateShipping = () => {
		return 20.0.toFixed(2); // Example flat shipping rate
	};

	const calculateTax = () => {
		return (parseFloat(calculateSubtotal()) * 0.15).toFixed(2); // Example 15% tax
	};

	const calculateTotal = () => {
		return (
			parseFloat(calculateSubtotal()) +
			parseFloat(calculateShipping()) +
			parseFloat(calculateTax()) -
			parseFloat(calculateDiscount())
		).toFixed(2);
	};

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView>
				{/* Header */}
				<Header
					leftIcon={'back'}
					title={'Create Invoice'}
					titleRight
				/>

				{/* Billed From */}
				<View style={styles.section}>
					<Text style={[styles.sectionTitle, { color: colors.title }]}>Billed from</Text>
					<TouchableOpacity onPress={() => { navigation.navigate("InvoiceOrganizations") }} style={[styles.card, { backgroundColor: colors.card }]}>
						<MaterialIcons name="business" size={24} style={{ color: colors.title }} />
						<View style={styles.cardContent}>
							<Text style={[styles.cardTitle, { color: colors.title }]}>Name</Text>
							<Text style={[styles.cardSubtitle, { color: colors.title }]}>support@lucodeia.com</Text>
						</View>
						<MaterialIcons name="keyboard-arrow-right" size={24} style={{ color: colors.title }} />
					</TouchableOpacity>
				</View>

				{/* Billed To */}
				<View style={styles.section}>
					<Text style={[styles.sectionTitle, { color: colors.title }]}>Billed to</Text>
					<TouchableOpacity onPress={() => { navigation.navigate("InvoiceClients") }} style={[styles.card, { backgroundColor: colors.card }]}>
						<MaterialIcons name="person" size={24} style={{ color: colors.title }} />
						<View style={styles.cardContent}>
							<Text style={[styles.cardTitle, { color: colors.title }]}>Name</Text>
							<Text style={[styles.cardSubtitle, { color: colors.title }]}>support@lucodeia.com</Text>
						</View>
						<MaterialIcons name="keyboard-arrow-right" size={24} style={{ color: colors.title }} />
					</TouchableOpacity>
				</View>

				{/* General */}
				<View style={styles.section}>
					<Text style={[styles.sectionTitle, { color: colors.title }]}>General</Text>
					<View style={styles.row}>
						<TextInput placeholder="Currency" style={styles.input} />
						<TextInput placeholder="Invoice Number" style={styles.input} />
					</View>
					<View style={styles.row}>
						<TextInput placeholder="Issue Date" style={styles.input} />
						<TextInput placeholder="Due Date" style={styles.input} />
					</View>
				</View>

				{/* Items */}
				<View style={styles.section}>
					<View style={styles.itemsHeader}>
						<Text style={[styles.sectionTitle, { color: colors.title }]}>Items</Text>
					</View>
					<FlatList
						data={items}
						keyExtractor={(item) => item.id}
						renderItem={({ item }) => (
							<View style={[styles.item, { backgroundColor: colors.card }]}>
								<View style={styles.itemContent}>
									<Text style={[styles.itemTitle, { color: colors.title }]}>{item.title}</Text>
									<Text style={[styles.itemSubtitle, { color: colors.title }]}>
										${item.price.toFixed(2)} x {item.quantity}
									</Text>
								</View>
								<View style={styles.itemActions}>
									<Text style={[styles.itemPrice, { color: colors.title }]}>
										${(item.price * item.quantity).toFixed(2)}
									</Text>
									<TouchableOpacity onPress={() => handleRemoveItem(item.id)}>
										<MaterialIcons name="edit" size={20} color="#007bff" />
									</TouchableOpacity>
								</View>
							</View>
						)}
						ListFooterComponent={() => (
							<TouchableOpacity style={styles.addItemButton} onPress={() => { navigation.navigate("InvoiceAddItems"); }}>
								<MaterialIcons name="add-circle" size={20} color="#007bff" />
								<Text style={[styles.addItemText,]}>Add Item</Text>
							</TouchableOpacity>
						)}
					/>
				</View>

				{/* Totals */}
				<View style={styles.section}>
					<View style={styles.rowBetween}>
						<Text style={[styles.totalLabel, { color: colors.title }]}>Subtotal</Text>
						<Text style={[styles.totalValue, { color: colors.title }]}>${calculateSubtotal()}</Text>
					</View>
					<View style={styles.rowBetween}>
						<Text style={[styles.totalLabel, { color: colors.title }]}>Discount</Text>
						<Text style={[styles.totalValue, { color: colors.title }]}>${calculateDiscount()}</Text>
					</View>
					<View style={styles.rowBetween}>
						<Text style={[styles.totalLabel, { color: colors.title }]}>Shipping & Handling</Text>
						<Text style={[styles.totalValue, { color: colors.title }]}>${calculateShipping()}</Text>
					</View>
					<View style={styles.rowBetween}>
						<Text style={[styles.totalLabel, { color: colors.title }]}>Tax</Text>
						<Text style={[styles.totalValue, { color: colors.title }]}>${calculateTax()}</Text>
					</View>
					<View style={styles.rowBetween}>
						<Text style={[styles.totalLabel, styles.totalLabelBold, { color: colors.title }]}>Total</Text>
						<Text style={[styles.totalValue, styles.totalValueBold, { color: colors.title }]}>${calculateTotal()}</Text>
					</View>
				</View>

				{/* Notes and T&C */}
				<View style={styles.section}>
					<TextInput
						placeholder="Notes"
						style={styles.notesInput}
						multiline
					/>
					<TextInput
						placeholder="Terms and Conditions"
						style={styles.notesInput}
						multiline
					/>
				</View>

				{/* Generate Invoice Button */}
				<View style={styles.footer}>
					<TouchableOpacity style={[styles.footerButton, { backgroundColor: COLORS.primary }]}>
						<Text style={[styles.footerButtonText, { color: colors.title }]}>Generate Invoice</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};


const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	header: {
		padding: 20,
		backgroundColor: "#fff",
		borderBottomWidth: 1,
		borderBottomColor: "#ddd",
	},
	headerTitle: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#333",
	},
	section: {
		marginVertical: 10,
		paddingHorizontal: 20,
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: "bold",

		marginBottom: 10,
	},
	card: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#fff",
		padding: 15,
		borderRadius: 10,
		marginBottom: 10,
		shadowColor: "#000",
		shadowOpacity: 0.1,
		shadowRadius: 5,
		elevation: 2,
	},
	cardContent: {
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
		color: "#666",
	},
	row: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	rowBetween: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginVertical: 5,
	},
	input: {
		flex: 1,
		backgroundColor: "#fff",
		borderRadius: 10,
		padding: 10,
		fontSize: 16,
		marginHorizontal: 5,
		borderWidth: 1,
		borderColor: "#ddd",
	},
	itemsHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	item: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		padding: 15,

		borderRadius: 10,
		marginBottom: 10,
		shadowColor: "#000",
		shadowOpacity: 0.1,
		shadowRadius: 5,
		elevation: 2,
	},
	itemContent: {
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
	},
	itemActions: {
		alignItems: "flex-end",
	},
	itemPrice: {
		fontSize: 16,
		fontWeight: "bold",
		color: "#333",
		marginBottom: 5,
	},
	addItemButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 10,
	},
	addItemText: {
		marginLeft: 5,
		fontSize: 14,
		color: "#007bff",
		fontWeight: "bold",
	},
	totalLabel: {
		fontSize: 14,
		color: "#666",
	},
	totalLabelBold: {
		fontWeight: "bold",
		color: "#333",
	},
	totalValue: {
		fontSize: 14,
		color: "#666",
	},
	totalValueBold: {
		fontWeight: "bold",
		color: "#333",
	},
	notesInput: {
		backgroundColor: "#fff",
		borderRadius: 10,
		padding: 10,
		fontSize: 16,
		borderWidth: 1,
		borderColor: "#ddd",
		marginVertical: 10,
	},
	footer: {
		padding: 20,
	},
	footerButton: {

		borderRadius: 10,
		padding: 15,
		alignItems: "center",
	},
	footerButtonText: {
		fontSize: 16,
		fontWeight: "bold",

	},
});



export default InvoiceCreate;