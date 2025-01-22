import React, { useRef, useState } from 'react';
import {
	View,
	Text,
	TextInput,
	FlatList,
	TouchableOpacity,
	StyleSheet,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import Header from '../../layout/Header';
import BottomSheet from '@gorhom/bottom-sheet';

type InvoiceOrganizationsProps = StackScreenProps<RootStackParamList, 'InvoiceOrganizations'>;

export const InvoiceOrganizations = ({ navigation }: InvoiceOrganizationsProps) => {

	const bottomSheetRef = useRef(null);
	const [selectedItem, setSelectedItem] = useState(null);

	const openBottomSheet = (item: any) => {
		setSelectedItem(item);
		bottomSheetRef.current?.expand();
	};




	const organizations = Array(1).fill({
		name: 'Name of the Organization',
		email: 'support@lucodeia.com',
	});

	const renderItem = ({ item }) => (
		<View style={styles.organizationRow}>
			<View style={styles.organizationInfo}>
				<View style={styles.avatar}>
					<Text style={styles.avatarText}>A</Text>
				</View>
				<View>
					<Text style={styles.organizationName}>{item.name}</Text>
					<Text style={styles.organizationEmail}>{item.email}</Text>
				</View>
			</View>
			<TouchableOpacity onPress={openBottomSheet}>
				<MaterialIcons name="more-vert" size={24} color="gray" />
			</TouchableOpacity>
		</View>
	);

	return (
		<View style={styles.container}>
			{/* Header */}
			<Header
				leftIcon={'back'}
				title={'Organizatios'}
				titleRight
			/>

			{/* Search Bar */}
			<TextInput
				style={styles.searchBar}
				placeholder="Find organization"
				placeholderTextColor="#999"
			/>

			{/* New Organization */}
			<TouchableOpacity onPress={() => {
				navigation.navigate("InvoiceAddOrganization");
			}} style={styles.newOrganizationButton}>
				<Text style={styles.newOrganizationText}>+ New Organization</Text>
			</TouchableOpacity>

			{/* All Organizations */}
			<Text style={styles.sectionTitle}>All Organizations</Text>

			{/* List */}
			<FlatList
				data={organizations}
				renderItem={renderItem}
				keyExtractor={(item, index) => index.toString()}
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
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,

	},

	searchBar: {
		backgroundColor: '#F7F7F7',
		borderRadius: 8,
		paddingHorizontal: 15,
		paddingVertical: 10,
		marginBottom: 15,
		borderColor: '#ccc',
		borderWidth: 1,
	},
	newOrganizationButton: {
		marginBottom: 15,
	},
	newOrganizationText: {
		color: '#007BFF',
		fontSize: 16,
		fontWeight: 'bold',
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: '600',
		marginBottom: 10,
	},
	organizationRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 15,
		paddingVertical: 10,
		borderBottomWidth: 1,
		borderBottomColor: '#F0F0F0',
	},
	organizationInfo: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	avatar: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: '#F0F0F0',
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 10,
	},
	avatarText: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#666',
	},
	organizationName: {
		fontSize: 16,
		fontWeight: 'bold',
	},
	organizationEmail: {
		fontSize: 14,
		color: '#666',
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

export default InvoiceOrganizations;