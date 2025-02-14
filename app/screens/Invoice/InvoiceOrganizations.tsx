import React, { useCallback, useRef, useState } from 'react';
import {
	View,
	Text,
	TextInput,
	FlatList,
	TouchableOpacity,
	StyleSheet,
	Image,
	Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import Header from '../../layout/Header';
import BottomSheet from '@gorhom/bottom-sheet';
import { ApiService } from '../../lib/ApiService';
import { COLORS } from '../../constants/theme';
import CONFIG from '../../constants/config';
import StorageService from '../../lib/StorageService';
import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native-paper';

import { useTheme } from '@react-navigation/native';
import { MessagesService } from '../../lib/MessagesService';

type InvoiceOrganizationsProps = StackScreenProps<RootStackParamList, 'InvoiceOrganizations'>;

export const InvoiceOrganizations = ({ navigation }: InvoiceOrganizationsProps) => {

	const theme = useTheme();
	const { colors }: { colors: any } = theme;


	// Reference for BottomSheet
	const bottomSheetRef = useRef<BottomSheet>(null);
	// State for the selected organization (to show in the bottom sheet)
	const [selectedItem, setSelectedItem] = useState<any>(null);
	// State for company data from the API
	const [companyData, setCompanyData] = useState({ status: false, image_path: '', message: '', data: [] });
	// State for search input
	const [searchQuery, setSearchQuery] = useState('');
	const [isLoading, setIsLoading] = useState<any>(false);
	const [isLoadingForDelete, setIsLoadingForDelete] = useState<any>(false);

	// Fetch the company list whenever the screen is focused
	useFocusEffect(
		useCallback(() => {
			fetchCompanyList();
		}, [])
	);

	const fetchCompanyList = () => {
		setIsLoading(true)
		ApiService.postWithToken('api/invoice-generator/companies/list', {}).then((res) => {
			if (res.status) {
				setCompanyData(res);
			}
			setIsLoading(false);
		});
	};

	// When an organization is selected, save its info and navigate to the InvoiceCreate screen
	const selectOrganization = async (organization_item: any) => {
		StorageService.setStorage(
			CONFIG.HARDCODE_VALUES.INVOICE_GEN_SESSION.ORGANIZATION_INFO,
			JSON.stringify(organization_item)
		);
		navigation.navigate('InvoiceCreate');
	};

	// Open the bottom sheet when the three-dot icon is pressed
	const openBottomSheet = (item: any) => {
		setSelectedItem(item);
		// Using snapToIndex to open the bottom sheet to the first snap point (30%)
		bottomSheetRef.current?.snapToIndex(0);
	};

	// Close the bottom sheet and clear the selected item
	const closeBottomSheet = () => {
		bottomSheetRef.current?.close();
		setSelectedItem(null);
	};

	// Filter companies based on the search query (searching by name or email)
	const filteredCompanies = companyData.data.filter((item: any) => {
		const query = searchQuery.toLowerCase();
		return item.name.toLowerCase().includes(query) || item.email.toLowerCase().includes(query);
	});

	const handleDelete = () => {
		setIsLoadingForDelete(true)
		if (selectedItem.id) {
			ApiService.postWithToken(`api/invoice-generator/companies/delete/${selectedItem.id}`, {}).then((res) => {
				MessagesService.commonMessage(res.message, res.status ? "SUCCESS" : "ERROR")
				setIsLoadingForDelete(false);
				if (res.status) {
					fetchCompanyList();
					closeBottomSheet();
				}
			});
		} else {
			MessagesService.commonMessage("Item not selected");
		}
	}

	// Render each organization item as a card with improved spacing, shadows, and layout
	const renderItem = ({ item }: any) => (
		<View style={[styles.organizationCard, { backgroundColor: colors.card }]}>
			<TouchableOpacity style={styles.organizationInfo} onPress={() => selectOrganization(item)}>
				<View style={styles.avatar}>
					<Image
						style={styles.avatarImage}
						source={{ uri: `${companyData.image_path}${item.image}` }}
					/>
				</View>
				<View style={styles.textContainer}>
					<Text style={[styles.organizationName, { color: colors.title }]}>{item.name}</Text>
					<Text style={styles.organizationEmail}>{item.email.toLowerCase()}</Text>
				</View>
			</TouchableOpacity>
			<TouchableOpacity onPress={() => openBottomSheet(item)}>
				<MaterialIcons name="more-vert" size={24} color="#666" />
			</TouchableOpacity>
		</View>
	);

	return (<><Header leftIcon={'back'} title={'Organizations'} titleRight />
		<View style={styles.container}>
			{/* Header */}


			{/* Search Bar */}
			<View style={[styles.searchContainer, { backgroundColor: colors.background, elevation: 4 }]}>
				<MaterialIcons name="search" size={22} color="#888" style={styles.searchIcon} />
				<TextInput
					style={[styles.searchBar, { color: colors.title }]}
					placeholder="Search organizations"
					placeholderTextColor={colors.title}
					value={searchQuery}
					onChangeText={setSearchQuery}
				/>
			</View>

			{/* New Organization Button */}
			<TouchableOpacity
				onPress={() => navigation.navigate('InvoiceAddOrganization')}
				style={styles.newOrganizationButton}
			>
				<Text style={styles.newOrganizationText}>+ New Organization</Text>
			</TouchableOpacity>

			{/* Organization List */}

			{isLoading === false ?
				<FlatList
					data={filteredCompanies}
					renderItem={renderItem}
					keyExtractor={(item, index) => index.toString()}
					contentContainerStyle={[styles.listContent, {}]}
				/> :
				<ActivityIndicator color={COLORS.title} size={'large'}></ActivityIndicator>
			}

			{/* Bottom Sheet (Manage Organization) */}
			<BottomSheet
				ref={bottomSheetRef}
				index={-1} // Starts off closed
				snapPoints={['30%', '50%']}
				enablePanDownToClose={true}
				backgroundStyle={[styles.bottomSheetBackground, { backgroundColor: colors.card }]}
			>
				<View style={styles.bottomSheetContent}>
					<Text style={[styles.sheetTitle, { color: colors.title }]}>Manage Organization</Text>
					{selectedItem && (
						<Text style={[styles.selectedItemText, { color: colors.title }]}>
							{selectedItem.name} - {selectedItem.email}
						</Text>
					)}
					<TouchableOpacity
						onPress={() => {
							closeBottomSheet();
							navigation.navigate('InvoiceAddOrganization', { orgranisationData: { ...selectedItem, imagepath: companyData.image_path } });
						}}
						style={[styles.sheetButton, { backgroundColor: COLORS.primary }]}
					>
						<MaterialIcons name="edit" size={24} color={COLORS.background} />
						<Text style={[styles.sheetButtonText, { color: COLORS.background }]}>Edit</Text>
					</TouchableOpacity>
					{
						!isLoadingForDelete ?
							<TouchableOpacity onPress={handleDelete} style={[styles.sheetButton, styles.removeButton, { backgroundColor: COLORS.danger }]}>
								<MaterialIcons name="delete" size={24} color={COLORS.background} />
								<Text style={[styles.sheetButtonText, { color: COLORS.background }]}>Remove</Text>
							</TouchableOpacity>
							:
							<ActivityIndicator color={COLORS.title} size={'large'}></ActivityIndicator>
					}
					{/* <TouchableOpacity onPress={handleDelete} style={[styles.sheetButton, styles.removeButton, { backgroundColor: COLORS.danger }]}>
						<MaterialIcons name="delete" size={24} color={COLORS.background} />
						<Text style={[styles.sheetButtonText, { color: COLORS.background }]}>Remove</Text>
					</TouchableOpacity> */}
				</View>
			</BottomSheet>
		</View>
	</>

	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 10

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

	},
	newOrganizationButton: {
		backgroundColor: COLORS.primary,
		paddingVertical: 15,
		borderRadius: 12,
		alignItems: 'center',
		marginBottom: 20,
		shadowColor: COLORS.primary,
		shadowOpacity: 0.3,
		shadowRadius: 5,
		elevation: 3,
	},
	newOrganizationText: {
		color: '#fff',
		fontSize: 18,
		fontWeight: '600',
	},
	listContent: {
		paddingBottom: 100,
	},
	organizationCard: {
		flexDirection: 'row',
		justifyContent: 'space-between',
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
	organizationInfo: {
		flexDirection: 'row',
		alignItems: 'center',
		flex: 1,
	},
	avatar: {
		width: 50,
		height: 50,
		borderRadius: 25,
		backgroundColor: '#e0e0e0',
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 15,
	},
	avatarImage: {
		width: 45,
		height: 45,
		resizeMode: 'cover',
		borderRadius: 25,
	},
	textContainer: {
		flex: 1,
	},
	organizationName: {
		fontSize: 18,
		fontWeight: '600',
		color: '#333',
		marginBottom: 4,
	},
	organizationEmail: {
		fontSize: 14,
		color: '#777',
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
		fontSize: 20,
		fontWeight: '700',
		marginBottom: 15,
		color: '#333',
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