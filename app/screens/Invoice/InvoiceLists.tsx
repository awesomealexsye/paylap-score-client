import React, { useRef, useState } from "react";
import {
	View,
	Text,
	FlatList,
	StyleSheet,
	TouchableOpacity,
	SafeAreaView,
	Animated,
	ScrollView,
	TextInput,
	Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons, AntDesign, Feather } from "@expo/vector-icons";
import { Menu, Provider } from "react-native-paper";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import InvoiceCreate from "./InvoiceCreate";


const { width } = Dimensions.get("window");

const FilterModal = ({ isVisible, onClose }) => {
	const slideAnim = useRef(new Animated.Value(width)).current; // Starts off-screen (right)

	React.useEffect(() => {
		if (isVisible) {
			// Slide in from the right
			Animated.timing(slideAnim, {
				toValue: 0,
				duration: 300,
				useNativeDriver: false,
			}).start();
		} else {
			// Slide out to the right
			Animated.timing(slideAnim, {
				toValue: width,
				duration: 300,
				useNativeDriver: false,
			}).start(() => onClose());
		}
	}, [isVisible]);

	const handleReset = () => {
		// Logic to reset filters (if any)
	};

	return (
		<Animated.View style={[styles.modalContainer, { transform: [{ translateX: slideAnim }] }]}>
			<View style={styles.modalHeader}>
				<TouchableOpacity onPress={onClose}>
					<Feather size={24} color={"blue"} name={'arrow-left'} />
				</TouchableOpacity>
				<Text style={styles.modalTitle}>Filter Invoices</Text>
				<TouchableOpacity onPress={handleReset}>
					<Text style={styles.resetText}>Reset</Text>
				</TouchableOpacity>
			</View>
			<ScrollView>
				<View style={styles.filterGroup}>
					<Text style={styles.filterLabel}>Filter by total</Text>
					<View style={styles.row}>
						<TextInput placeholder="From amount" style={styles.input} keyboardType="numeric" />
						<TextInput placeholder="To amount" style={styles.input} keyboardType="numeric" />
					</View>
				</View>
				<View style={styles.filterGroup}>
					<Text style={styles.filterLabel}>Filter by date</Text>
					<View style={styles.row}>
						<TextInput placeholder="Issue Date" style={styles.input} />
						<TextInput placeholder="Due Date" style={styles.input} />
					</View>
				</View>
				<View style={styles.filterGroup}>
					<Text style={styles.filterLabel}>Filter by status</Text>
					<TextInput placeholder="Invoice Status" style={styles.input} />
				</View>
				<View style={styles.filterGroup}>
					<Text style={styles.filterLabel}>Filter by customer</Text>
					<TextInput placeholder="Customer" style={styles.input} />
				</View>
				<TouchableOpacity style={styles.filterButton} onPress={() => onClose()}>
					<Text style={styles.filterButtonText}>Filter Invoices</Text>
				</TouchableOpacity>
			</ScrollView>
		</Animated.View>
	);
};

const invoices = [
	{ id: "#123456789", status: "Unpaid", amount: "$3,520.00", dueDate: "Mar 31, 2024", items: "6 items" },
	{ id: "#987654321", status: "Overdue", amount: "$4,200.00", dueDate: "Apr 15, 2024", items: "3 items" },
	{ id: "#456123789", status: "Paid", amount: "$2,800.00", dueDate: "May 1, 2024", items: "5 items" },
	{ id: "#789456123", status: "Paid", amount: "$1,200.00", dueDate: "Apr 10, 2024", items: "2 items" },
];

const companies = ["My Company", "Company A", "Company B", "Company C"];

const Header = ({ selectedCompany, setSelectedCompany, onOpenFilter }) => {
	const [menuVisible, setMenuVisible] = useState(false);

	const openMenu = () => setMenuVisible(true);
	const closeMenu = () => setMenuVisible(false);

	const [isFilterVisible, setFilterVisible] = useState(false);

	const openFilterModal = () => setFilterVisible(true);
	const closeFilterModal = () => setFilterVisible(false);

	return (
		<LinearGradient colors={["#007bff", "#0056b3"]} style={styles.header}>
			<TouchableOpacity onPress={() => { }}>
				<Feather size={24} color={"blue"} name={'arrow-left'} />
			</TouchableOpacity>
			<Text style={styles.headerTitle}>Invoices</Text>
			<View style={styles.headerRight}>
				<Menu
					visible={menuVisible}
					onDismiss={closeMenu}
					anchor={
						<TouchableOpacity onPress={openMenu} style={styles.companyDropdown}>
							<Text style={styles.companyName}>{selectedCompany}</Text>
							<AntDesign name="caretdown" size={14} color="#fff" />
						</TouchableOpacity>
					}
				>
					{companies.map((company, index) => (
						<Menu.Item
							key={index}
							onPress={() => {
								setSelectedCompany(company);
								closeMenu();
							}}
							title={company}
						/>
					))}
				</Menu>

				<TouchableOpacity onPress={onOpenFilter}>
					<MaterialIcons name="filter-list" size={28} color="#fff" style={styles.filterIcon} />
				</TouchableOpacity>

			</View>
		</LinearGradient>
	);
};

const FilterTabs = ({ activeTab, setActiveTab }) => {
	const tabs = ["All", "Paid", "Unpaid", "Overdue"];

	return (
		<View style={styles.tabContainer}>
			{tabs.map((tab) => (
				<TouchableOpacity
					key={tab}
					style={[
						styles.tabButton,
						activeTab === tab && styles.activeTab,
					]}
					onPress={() => setActiveTab(tab)}
				>
					<Text
						style={[
							styles.tabText,
							activeTab === tab && styles.activeTabText,
						]}
					>
						{tab}
					</Text>
				</TouchableOpacity>
			))}
		</View>
	);
};

const InvoiceCard = ({ invoice }) => {
	const statusColors = {
		Unpaid: "#FEC564",
		Overdue: "#F28B82",
		Paid: "#81C995",
	};

	return (
		<View style={[styles.card, styles.shadow]}>
			<View style={[styles.statusTag, { backgroundColor: statusColors[invoice.status] }]}>
				<Text style={styles.statusText}>{invoice.status}</Text>
			</View>
			<Text style={styles.invoiceId}>{invoice.id}</Text>
			<View style={styles.row}>
				<Text style={styles.dueDate}>{invoice.dueDate}</Text>
				<Text style={styles.items}>{invoice.items}</Text>
			</View>
			<Text style={styles.amount}>{invoice.amount}</Text>
		</View>
	);
};

const InvoicesScreen = () => {

	const [isFilterVisible, setFilterVisible] = useState(false);

	const openFilterModal = () => setFilterVisible(true);
	const closeFilterModal = () => setFilterVisible(false);


	const [selectedCompany, setSelectedCompany] = useState("My Company");
	const [activeTab, setActiveTab] = useState("All");

	const filteredInvoices =
		activeTab === "All"
			? invoices
			: invoices.filter((invoice) => invoice.status === activeTab);

	return (
		<SafeAreaView style={styles.container}>

			<Header
				selectedCompany={selectedCompany}
				setSelectedCompany={setSelectedCompany}
				onOpenFilter={openFilterModal}
			/>

			<Text style={styles.companyMessage}>
				Showing invoices for: {selectedCompany}
			</Text>
			<FilterTabs activeTab={activeTab} setActiveTab={setActiveTab} />
			<FlatList
				data={filteredInvoices}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => <InvoiceCard invoice={item} />}
				contentContainerStyle={styles.listContainer}
			/>
			{isFilterVisible && <FilterModal isVisible={isFilterVisible} onClose={closeFilterModal} />}
		</SafeAreaView>
	);
};

const CreateScreen = () => (
	<View style={styles.centeredView}>
		<Text style={styles.screenText}>Create New Invoice</Text>
	</View>
);

const SettingsScreen = () => (
	<View style={styles.centeredView}>
		<Text style={styles.screenText}>Settings</Text>
	</View>
);

const Tab = createBottomTabNavigator();

type InvoiceListsProps = StackScreenProps<RootStackParamList, 'InvoiceLists'>;

export const InvoiceLists = ({ navigation }: InvoiceListsProps) => {



	return (
		<Provider>

			<Tab.Navigator
				screenOptions={({ route }) => ({
					tabBarIcon: ({ color, size }) => {
						if (route.name === "Invoices") {
							return <MaterialIcons name="receipt" size={size} color={color} />;
						} else if (route.name === "Create") {
							return <MaterialIcons name="add-circle-outline" size={size} color={color} />;
						} else if (route.name === "Settings") {
							return <MaterialIcons name="settings" size={size} color={color} />;
						}
					},
					tabBarActiveTintColor: "black",
					tabBarInactiveTintColor: "#666",
					tabBarStyle: { height: 90 },
					tabBarLabelStyle: {
						fontSize: 14,
						marginBottom: 5,
					},
				})}
			>
				<Tab.Screen
					name="Invoices"
					component={InvoicesScreen}
					options={{ headerShown: false }}
				/>
				<Tab.Screen
					name="Create"
					component={InvoiceCreate}
					options={{ headerShown: false }}
				/>
				<Tab.Screen
					name="Settings"
					component={SettingsScreen}
					options={{ headerShown: false }}
				/>
			</Tab.Navigator>

		</Provider>
	);
};

export default InvoiceLists;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f5f5f5",
	},
	header: {
		paddingHorizontal: 20,
		paddingVertical: 30,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		// borderBottomLeftRadius: 15,
		// borderBottomRightRadius: 15,
	},
	headerTitle: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#fff",
	},
	headerRight: {
		flexDirection: "row",
		alignItems: "center",
	},
	companyDropdown: {
		flexDirection: "row",
		alignItems: "center",
		marginRight: 10,
	},
	companyName: {
		fontSize: 16,
		color: "#fff",
		marginRight: 5,
		fontWeight: "bold",
	},
	filterIcon: {
		marginLeft: 10,
	},
	companyMessage: {
		fontSize: 16,
		fontWeight: "bold",
		color: "#333",
		padding: 10,
	},
	tabContainer: {
		flexDirection: "row",
		justifyContent: "space-around",
		backgroundColor: "#fff",
		paddingVertical: 10,
		borderBottomWidth: 1,
		borderBottomColor: "#ddd",
	},
	tabButton: {
		paddingVertical: 5,
		paddingHorizontal: 10,
	},
	activeTab: {
		borderBottomWidth: 2,
		borderBottomColor: "#007bff",
	},
	tabText: {
		fontSize: 16,
		color: "#666",
	},
	activeTabText: {
		color: "#007bff",
		fontWeight: "bold",
	},
	card: {
		backgroundColor: "#fff",
		borderRadius: 15,
		padding: 15,
		marginVertical: 10,
		marginHorizontal: 10,
	},
	shadow: {
		elevation: 5,
		shadowColor: "#000",
		shadowOpacity: 0.2,
		shadowRadius: 3,
		shadowOffset: { width: 0, height: 2 },
	},
	statusTag: {
		alignSelf: "flex-start",
		paddingVertical: 4,
		paddingHorizontal: 8,
		borderRadius: 5,
		marginBottom: 8,
	},
	statusText: {
		color: "#fff",
		fontSize: 12,
		fontWeight: "bold",
	},
	invoiceId: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#333",
		marginBottom: 8,
	},
	row: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	dueDate: {
		fontSize: 14,
		color: "#666",
	},
	amount: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#333",
		marginTop: 10,
	},
	items: {
		fontSize: 14,
		color: "#888",
	},
	listContainer: {
		paddingBottom: 20,
	},
	centeredView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	screenText: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#333",
	},
	modalContainer: {
		position: "absolute",
		top: 0,
		right: 0,
		bottom: 0,
		width: "80%",
		backgroundColor: "#fff",
		padding: 20,
		elevation: 10,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.3,
		shadowRadius: 5,
	},
	modalHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 20,
	},
	modalTitle: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#333",
	},
	resetText: {
		fontSize: 16,
		color: "#007bff",
		fontWeight: "bold",
	},
	filterGroup: {
		marginBottom: 20,
	},
	filterLabel: {
		fontSize: 16,
		fontWeight: "bold",
		color: "#333",
		marginBottom: 10,
	},
	row: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	input: {
		flex: 1,
		backgroundColor: "#f0f0f0",
		borderRadius: 10,
		padding: 10,
		fontSize: 16,
		marginHorizontal: 5,
	},
	filterButton: {
		backgroundColor: "#007bff",
		borderRadius: 10,
		padding: 15,
		alignItems: "center",
	},
	filterButtonText: {
		fontSize: 16,
		fontWeight: "bold",
		color: "#fff",
	},
	content: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},

});