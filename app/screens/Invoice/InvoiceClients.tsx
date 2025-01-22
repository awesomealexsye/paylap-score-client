import React, { useRef, useState } from 'react';
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	FlatList,
	StyleSheet,
} from 'react-native';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import { StackScreenProps } from '@react-navigation/stack';
import Header from '../../layout/Header';
import BottomSheet from '@gorhom/bottom-sheet';
import { MaterialIcons } from '@expo/vector-icons';

const clients = [
	{ id: '1', name: 'Name of the Client', email: 'support@lucodeia.com' },
	{ id: '2', name: 'Name of the Client', email: 'support@lucodeia.com' },

];

type InvoiceClientsProps = StackScreenProps<RootStackParamList, 'InvoiceClients'>;

export const InvoiceClients = ({ navigation }: InvoiceClientsProps) => {


	const bottomSheetRef = useRef(null);
	const [selectedItem, setSelectedItem] = useState(null);

	const openBottomSheet = (item: any) => {
		setSelectedItem(item);
		bottomSheetRef.current?.expand();
	};


	const renderItem = ({ item }) => (
		<View style={styles.clientContainer}>
			<View style={styles.avatar}>
				<Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
			</View>
			<View style={styles.clientInfo}>
				<Text style={styles.clientName}>{item.name}</Text>
				<Text style={styles.clientEmail}>{item.email}</Text>
			</View>
			<TouchableOpacity onPress={openBottomSheet} style={styles.optionsButton}>
				<Text style={styles.optionsText}>⋮</Text>
			</TouchableOpacity>
		</View>
	);

	return (
		<View style={styles.container}>
			{/* Header */}
			<Header
				leftIcon={'back'}
				title={'Clients'}
				titleRight
			/>
			<View>

			</View>
			{/* Search Bar */}
			<TextInput
				style={styles.searchBar}
				placeholder="Find client"
				placeholderTextColor="#999"
			/>

			{/* New Client Button */}
			<TouchableOpacity onPress={() => {
				navigation.navigate("InvoiceAddClient");
			}} style={styles.newClientButton}>
				<Text style={styles.newClientText}>+ New Client</Text>
			</TouchableOpacity>

			{/* Clients List */}
			<FlatList
				data={clients}
				keyExtractor={(item) => item.id}
				renderItem={renderItem}
				ListHeaderComponent={<Text style={styles.allClientsText}>All Clients</Text>}
				contentContainerStyle={styles.listContent}
			/>
			<BottomSheet
				ref={bottomSheetRef}
				snapPoints={['30%', '50%']}
				enablePanDownToClose
				backgroundStyle={styles.bottomSheetBackground}
			>
				<View style={styles.bottomSheetContent}>


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
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,

	},
	header: {
		fontSize: 18,
		fontWeight: 'bold',
		alignSelf: 'center',
		marginTop: 10,
		marginBottom: 15,
	},
	searchBar: {
		backgroundColor: '#F7F7F7',
		borderRadius: 8,
		paddingHorizontal: 15,
		paddingVertical: 12,
		marginBottom: 10,
		borderColor: '#ccc',
		borderWidth: 1,
	},
	newClientButton: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 15,
	},
	newClientText: {
		color: '#007BFF',
		fontSize: 16,
		fontWeight: 'bold',
	},
	allClientsText: {
		fontSize: 16,
		fontWeight: 'bold',
		marginBottom: 10,
	},
	clientContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 10,
		borderBottomWidth: 1,
		borderBottomColor: '#F0F0F0',
	},
	avatar: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: '#EAEAEA',
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 10,
	},
	avatarText: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#555',
	},
	clientInfo: {
		flex: 1,
	},
	clientName: {
		fontSize: 16,
		fontWeight: 'bold',
	},
	clientEmail: {
		fontSize: 14,
		color: '#999',
	},
	optionsButton: {
		padding: 10,
	},
	optionsText: {
		fontSize: 18,
		color: '#999',
	},
	listContent: {
		paddingBottom: 20,
	},
	bottomSheetBackground: {
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,

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

export default InvoiceClients;