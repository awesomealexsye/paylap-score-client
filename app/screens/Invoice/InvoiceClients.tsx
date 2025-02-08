import React, { useCallback, useRef, useState } from 'react';
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	FlatList,
	StyleSheet,
	Platform,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import Header from '../../layout/Header';
import BottomSheet from '@gorhom/bottom-sheet';
import { MaterialIcons } from '@expo/vector-icons';
import { ApiService } from '../../lib/ApiService';
import StorageService from '../../lib/StorageService';
import CONFIG from '../../constants/config';
import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native-paper';
import { COLORS } from '../../constants/theme';

type InvoiceClientsProps = StackScreenProps<RootStackParamList, 'InvoiceClients'>;

export const InvoiceClients = ({ navigation }: InvoiceClientsProps) => {
	// Reference for BottomSheet
	const bottomSheetRef = useRef<BottomSheet>(null);
	// State for the selected client (to display in the bottom sheet)
	const [selectedItem, setSelectedItem] = useState<any>(null);
	// State for the clients list
	const [customer, setCustomer] = useState<any[]>([]);
	// State for the search input
	const [searchQuery, setSearchQuery] = useState('');
	// Loading state
	const [isLoading, setIsLoading] = useState<boolean>(false);

	// Fetch the clients list whenever the screen is focused
	useFocusEffect(
		useCallback(() => {
			fetchCustomerList();
		}, [])
	);

	const fetchCustomerList = async () => {
		setIsLoading(true);
		const companyInfo = await StorageService.getStorage(CONFIG.HARDCODE_VALUES.INVOICE_GEN_SESSION.ORGANIZATION_INFO);
		if (companyInfo != null) {
			const companyInfoObj = JSON.parse(companyInfo);
			const company_id = companyInfoObj.id;
			ApiService.postWithToken("api/invoice-generator/customer/list", {
				company_id: company_id,
			}).then((res) => {
				if (res.status) {
					setCustomer(res.data);
				}
				setIsLoading(false);
			});
		}

	};

	// Select a client and store its data before navigating
	const selectClient = async (item: any) => {
		await StorageService.setStorage(
			CONFIG.HARDCODE_VALUES.INVOICE_GEN_SESSION.CLIENT_INFO,
			JSON.stringify(item)
		);
		navigation.navigate('InvoiceCreate');
	};

	// Open the bottom sheet for a given client
	const openBottomSheet = (item: any) => {
		setSelectedItem(item);
		bottomSheetRef.current?.snapToIndex(0);
	};

	// Close the bottom sheet and clear the selected item
	const closeBottomSheet = () => {
		bottomSheetRef.current?.close();
		setSelectedItem(null);
	};

	// Filter clients based on the search query (matching name or email)
	const filteredCustomers = customer.filter((item) => {
		const query = searchQuery.toLowerCase();
		return (
			item.name.toLowerCase().includes(query) ||
			item.email.toLowerCase().includes(query)
		);
	});

	// Render each client item as a card with enhanced styling
	const renderItem = ({ item }: any) => (
		<View style={styles.clientCard}>
			<TouchableOpacity style={styles.clientInfo} onPress={() => selectClient(item)}>
				<View style={styles.avatar}>
					<Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
				</View>
				<View>
					<Text style={styles.clientName}>{item.name}</Text>
					<Text style={styles.clientEmail}>{item.email}</Text>
				</View>
			</TouchableOpacity>
			<TouchableOpacity onPress={() => openBottomSheet(item)} style={styles.optionsButton}>
				<MaterialIcons name="more-vert" size={24} color="#666" />
			</TouchableOpacity>
		</View>
	);

	return (
		<View style={styles.container}>
			{/* Header */}
			<Header leftIcon={'back'} title={'Clients'} titleRight />

			{/* Search Bar */}
			<View style={styles.searchContainer}>
				<MaterialIcons name="search" size={22} color="#888" style={styles.searchIcon} />
				<TextInput
					style={styles.searchBar}
					placeholder="Find client"
					placeholderTextColor="#888"
					value={searchQuery}
					onChangeText={setSearchQuery}
				/>
			</View>

			{/* New Client Button */}
			<TouchableOpacity
				onPress={() => navigation.navigate("InvoiceAddClient")}
				style={styles.newClientButton}
			>
				<Text style={styles.newClientText}>+ New Client</Text>
			</TouchableOpacity>

			{/* Clients List */}
			{isLoading ? (
				<ActivityIndicator color={COLORS.title} size={'large'} />
			) : (
				<FlatList
					data={filteredCustomers}
					keyExtractor={(item) => item.id}
					renderItem={renderItem}
					contentContainerStyle={styles.listContent}
				/>
			)}

			{/* Bottom Sheet */}
			<BottomSheet
				ref={bottomSheetRef}
				index={-1} // Starts off collapsed
				snapPoints={['30%', '50%']}
				enablePanDownToClose={true}
				backgroundStyle={styles.bottomSheetBackground}
			>
				<View style={styles.bottomSheetContent}>
					{selectedItem && (
						<Text style={styles.sheetTitle}>
							{selectedItem.name} - {selectedItem.email}
						</Text>
					)}
					<TouchableOpacity
						onPress={() => {
							closeBottomSheet();
							navigation.navigate("InvoiceEditItem");
						}}
						style={styles.sheetButton}
					>
						<MaterialIcons name="edit" size={24} color="#555" />
						<Text style={styles.sheetButtonText}>Edit Client</Text>
					</TouchableOpacity>
					<TouchableOpacity style={[styles.sheetButton, styles.removeButton]}>
						<MaterialIcons name="delete" size={24} color="#F44336" />
						<Text style={[styles.sheetButtonText, { color: '#F44336' }]}>
							Remove Client
						</Text>
					</TouchableOpacity>
				</View>
			</BottomSheet>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		// backgroundColor: '#f9f9f9',
		// paddingHorizontal: 20,
		// paddingTop: Platform.OS === 'ios' ? 60 : 40,
	},
	searchContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#fff',
		borderRadius: 12,
		paddingHorizontal: 15,
		paddingVertical: 8,
		marginBottom: 20,
		shadowColor: '#000',
		shadowOpacity: 0.1,
		shadowRadius: 5,
		elevation: 3,
	},
	searchIcon: {
		marginRight: 8,
	},
	searchBar: {
		flex: 1,
		fontSize: 16,
		color: '#333',
	},
	newClientButton: {
		backgroundColor: COLORS.primary, // same as the add organization button color
		paddingVertical: 15,
		borderRadius: 12,
		alignItems: 'center',
		marginBottom: 20,
		shadowColor: COLORS.primary,
		shadowOpacity: 0.3,
		shadowRadius: 5,
		elevation: 3,
	},
	newClientText: {
		color: '#fff',
		fontSize: 18,
		fontWeight: '600',
	},
	listContent: {
		paddingBottom: 100,
	},
	clientCard: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#fff',
		padding: 15,
		borderRadius: 12,
		marginBottom: 15,
		shadowColor: '#000',
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 2,
	},
	clientInfo: {
		flexDirection: 'row',
		alignItems: 'center',
		flex: 1,
	},
	avatar: {
		width: 50,
		height: 50,
		borderRadius: 25,
		backgroundColor: '#EAEAEA',
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 15,
	},
	avatarText: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#555',
	},
	clientName: {
		fontSize: 18,
		fontWeight: '600',
		color: '#333',
		marginBottom: 4,
	},
	clientEmail: {
		fontSize: 14,
		color: '#777',
	},
	optionsButton: {
		padding: 10,
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
		fontWeight: '700',
		marginBottom: 15,
		color: '#333',
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