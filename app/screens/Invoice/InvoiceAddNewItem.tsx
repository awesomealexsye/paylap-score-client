import React, { useRef, useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	TextInput,
	FlatList,
	TouchableOpacity,
	SafeAreaView,
} from "react-native";
import { MaterialIcons, Entypo } from "@expo/vector-icons";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import Header from "../../layout/Header";

import BottomSheet from '@gorhom/bottom-sheet';

import { useTheme } from '@react-navigation/native';


interface Item {
	id: string;
	name: string;
	price: string;
}
type InvoiceAddNewItemsProps = StackScreenProps<RootStackParamList, 'InvoiceAddNewItems'>;

export const InvoiceAddNewItems = ({ navigation }: InvoiceAddNewItemsProps) => {



	const theme = useTheme();
	const { colors }: { colors: any } = theme;


	const bottomSheetRef = useRef(null);
	const [selectedItem, setSelectedItem] = useState(null);
	const [item, setItem] = useState(null);

	const openBottomSheet = (item: any) => {
		setSelectedItem(item);
		bottomSheetRef.current?.expand();
	};
	const items = [
		{ id: '1', name: 'Item 1', price: '$15.99' },
		{ id: '2', name: 'Item 2', price: '$20.00' },
		{ id: '3', name: 'Item 3', price: '$12.50' },
		{ id: '4', name: 'Item 4', price: '$18.75' },
	];



	const handleNewItem = () => {
		const newItem: Item = {
			id: Math.random().toString(),
			name: "New Item",
			price: "$0.00",
		};
		// setItems((prevItems) => [newItem, ...prevItems]);
	};

	const renderItem = ({ item }: { item: Item }) => (
		<TouchableOpacity style={[styles.itemContainer, { backgroundColor: colors.card }]}>
			<View style={styles.itemDetails}>
				<Text style={styles.itemName}>{item.name}</Text>
				<Text style={styles.itemPrice}>{item.price}</Text>
			</View>
			<TouchableOpacity onPress={openBottomSheet}>
				<Entypo name="dots-three-vertical" size={20} color="#555" />
			</TouchableOpacity>
		</TouchableOpacity>
	);

	return (

		<>
			<Header
				leftIcon={'back'}
				title={'Add New Items'}
				titleRight
			/>

			<SafeAreaView style={styles.container}>
				{/* Header */}


				{/* Search Bar */}
				<View style={styles.searchBar}>
					<MaterialIcons name="search" size={24} color="#666" />
					<TextInput
						placeholder="Find item"
						placeholderTextColor="#aaa"
						style={styles.searchInput}
					/>
				</View>

				{/* New Item Button */}
				<TouchableOpacity style={styles.newItemButton} onPress={handleNewItem}>
					<MaterialIcons name="add-circle-outline" size={20} color="#fff" />
					<Text style={styles.newItemText}>New Item</Text>
				</TouchableOpacity>

				{/* Items List */}
				<View style={styles.itemsList}>
					<Text style={styles.itemsListTitle}>All Items</Text>
					<FlatList
						data={items}
						keyExtractor={(item) => item.id}
						renderItem={renderItem}
						contentContainerStyle={styles.itemsListContent}
					/>
					<BottomSheet
						ref={bottomSheetRef}
						snapPoints={['30%', '50%']}
						enablePanDownToClose
						backgroundStyle={styles.bottomSheetBackground}
					>
						<View style={styles.bottomSheetContent}>
							<Text style={styles.sheetTitle}>Manage Item</Text>
							{selectedItem && (
								<Text style={styles.selectedItemText}>
									{selectedItem.name} - {selectedItem.price}
								</Text>
							)}
							<TouchableOpacity onPress={() => { navigation.navigate("InvoiceEditItem") }} style={styles.sheetButton}>
								<MaterialIcons name="edit" size={24} color="#555" />
								<Text style={styles.sheetButtonText}>Edit Item</Text>
							</TouchableOpacity>
							<TouchableOpacity style={[styles.sheetButton, styles.removeButton]}>
								<MaterialIcons name="delete" size={24} color="#555" />
								<Text style={[styles.sheetButtonText, { color: '#F44336' }]}>Remove Item</Text>
							</TouchableOpacity>
						</View>
					</BottomSheet>
				</View>
			</SafeAreaView>
		</>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		padding: 20,
		borderBottomWidth: 1,
		borderBottomColor: "#ddd",
	},
	headerTitle: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#333",
	},
	searchBar: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#f5f5f5",
		marginHorizontal: 20,
		borderRadius: 10,
		paddingHorizontal: 10,
		paddingVertical: 8,
		marginTop: 10,

	},
	searchInput: {
		flex: 1,
		fontSize: 16,
		color: "#333",
		marginLeft: 10,
	},
	newItemButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#007bff",
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 10,
		marginHorizontal: 20,
		marginTop: 15,
	},
	newItemText: {
		marginLeft: 5,
		fontSize: 16,
		fontWeight: "bold",
		color: "#fff",
	},
	itemsList: {
		flex: 1,
		marginTop: 15,
		paddingHorizontal: 20,
	},
	itemsListTitle: {
		fontSize: 16,
		fontWeight: "bold",
		color: "#333",
		marginBottom: 10,
	},
	itemsListContent: {
		paddingBottom: 20,
	},
	itemContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		padding: 15,
		backgroundColor: "#f5f5f5",
		borderRadius: 10,
		marginBottom: 10,

	},
	itemDetails: {
		flex: 1,
	},
	itemName: {
		fontSize: 16,
		fontWeight: "bold",
		color: "#333",
	},
	itemPrice: {
		fontSize: 14,
		color: "#666",
		marginTop: 5,
	},
	bottomSheetBackground: {
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		backgroundColor: '#fff',
	},
	bottomSheetContent: {
		flex: 1,
		padding: 20,
	},
	sheetTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		marginBottom: 10,
	},
	selectedItemText: {
		fontSize: 16,
		color: '#555',
		marginBottom: 20,
	},
	sheetButton: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#f0f0f0',
		borderRadius: 10,
		padding: 15,
		marginBottom: 10,
	},
	removeButton: {
		backgroundColor: '#fff',
		borderWidth: 1,
		borderColor: '#F44336',
	},
	sheetButtonText: {
		fontSize: 16,
		marginLeft: 10,
		color: '#333',
	},
});



export default InvoiceAddNewItems;