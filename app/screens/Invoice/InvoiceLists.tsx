import React, { useCallback, useEffect, useRef, useState } from "react";
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
import { MaterialIcons, AntDesign, Feather } from "@expo/vector-icons";
import { Menu, Provider } from "react-native-paper";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import InvoiceCreate from "./InvoiceCreate";
import { ApiService } from "../../lib/ApiService";
import StorageService from "../../lib/StorageService";
import CONFIG from "../../constants/config";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Header from "../../layout/Header";
import { MessagesService } from "../../lib/MessagesService";
import { COLORS, FONTS, SIZES } from "../../constants/theme";
import { useTheme } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const FilterModal = ({ isVisible, onClose }: any) => {
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

  const theme = useTheme();
  const { colors }: { colors: any } = theme;

  return (
    <Animated.View
      style={[
        styles.modalContainer,
        { transform: [{ translateX: slideAnim }] },
        { backgroundColor: colors.background },
      ]}
    >
      <View style={styles.modalHeader}>
        <TouchableOpacity onPress={onClose}>
          <Feather size={24} color={colors.title} name={"arrow-left"} />
        </TouchableOpacity>
        <Text style={[styles.modalTitle, { color: colors.title }]}>
          Filter Invoices
        </Text>
        <TouchableOpacity onPress={handleReset}>
          <Text style={styles.resetText}>Reset</Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View style={styles.filterGroup}>
          <Text style={[styles.filterLabel, { color: colors.title }]}>
            Filter by total
          </Text>
          <View style={styles.row}>
            <TextInput
              placeholder="From amount"
              placeholderTextColor={colors.title}
              style={[
                styles.input,
                { backgroundColor: colors.card, color: colors.title },
              ]}
              keyboardType="numeric"
            />
            <TextInput
              placeholder="To amount"
              placeholderTextColor={colors.title}
              style={[
                styles.input,
                { backgroundColor: colors.card, color: colors.title },
              ]}
              keyboardType="numeric"
            />
          </View>
        </View>
        <View style={styles.filterGroup}>
          <Text style={[styles.filterLabel, { color: colors.title }]}>
            Filter by date
          </Text>
          <View style={styles.row}>
            <TextInput
              placeholderTextColor={colors.title}
              placeholder="Issue Date"
              style={[
                styles.input,
                { backgroundColor: colors.card, color: colors.title },
              ]}
            />
            <TextInput
              placeholder="Due Date"
              placeholderTextColor={colors.title}
              style={[
                styles.input,
                { backgroundColor: colors.card, color: colors.title },
              ]}
            />
          </View>
        </View>
        <View style={styles.filterGroup}>
          <Text style={[styles.filterLabel, { color: colors.title }]}>
            Filter by status
          </Text>
          <TextInput
            placeholder="Invoice Status"
            placeholderTextColor={colors.title}
            style={[
              styles.input,
              { backgroundColor: colors.card, color: colors.title },
            ]}
          />
        </View>
        <View style={styles.filterGroup}>
          <Text style={[styles.filterLabel, { color: colors.title }]}>
            Filter by customer
          </Text>
          <TextInput
            placeholder="Customer"
            placeholderTextColor={colors.title}
            style={[
              styles.input,
              { backgroundColor: colors.card, color: colors.title },
            ]}
          />
        </View>
        <TouchableOpacity style={styles.filterButton} onPress={() => onClose()}>
          <Text style={styles.filterButtonText}>Filter Invoices</Text>
        </TouchableOpacity>
      </ScrollView>
    </Animated.View>
  );
};

const invoices = [
  {
    id: "#123456789",
    status: "Unpaid",
    amount: "₹ 3,520.00",
    dueDate: "Mar 31, 2024",
    items: "6 items",
  },
  {
    id: "#987654321",
    status: "Overdue",
    amount: "₹ 4,200.00",
    dueDate: "Apr 15, 2024",
    items: "3 items",
  },
  {
    id: "#456123789",
    status: "Paid",
    amount: "₹ 2,800.00",
    dueDate: "May 1, 2024",
    items: "5 items",
  },
  {
    id: "#789456123",
    status: "Paid",
    amount: "₹ 1,200.00",
    dueDate: "Apr 10, 2024",
    items: "2 items",
  },
];

const TopBar = ({
  selectedCompany,
  setSelectedCompany,
  onOpenFilter,
  onCompanyChange, // Added callback prop
}: any) => {
  const navigation = useNavigation<any>();

  const theme = useTheme();
  const { colors }: { colors: any } = theme;

  const [menuVisible, setMenuVisible] = useState(false);
  const [companies, setCompanies] = useState([]);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const [isFilterVisible, setFilterVisible] = useState(false);

  const openFilterModal = () => setFilterVisible(true);
  const closeFilterModal = () => setFilterVisible(false);

  useFocusEffect(
    useCallback(() => {
      getCompanyList();
      headerCompanySet();
    }, [])
  );

  const getCompanyList = async () => {
    const res = await ApiService.postWithToken(
      "api/invoice-generator/companies/list",
      {}
    );
    setCompanies(res?.data);
  };

  const changeCompany = async (company: any) => {
    await StorageService.setStorage(
      CONFIG.HARDCODE_VALUES.INVOICE_GEN_SESSION.ORGANIZATION_INFO,
      JSON.stringify(company)
    );
    setSelectedCompany(company.name);
    // Call the callback to refresh invoice list
    if (onCompanyChange) {
      onCompanyChange();
    }
  };

  const headerCompanySet = async () => {
    const companyInfoStr = await StorageService.getStorage(
      CONFIG.HARDCODE_VALUES.INVOICE_GEN_SESSION.ORGANIZATION_INFO
    );
    if (companyInfoStr != null) {
      const company = JSON.parse(companyInfoStr);
      setSelectedCompany(company.name);
    }
  };
  const backToHome = () => {
    // navigation.goBack();
    navigation.replace("DrawerNavigation");
  };

  return (
    <>
      <View
        style={{
          backgroundColor: colors.card,
          display: "flex",
          flexDirection: "row",
          paddingVertical: 20,
          paddingHorizontal: 10,
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <TouchableOpacity onPress={backToHome}>
          <Feather size={24} color={colors.title} name={"arrow-left"} />
        </TouchableOpacity>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            width: "90%",
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              paddingLeft: 10,
            }}
          >
            <Text style={[styles.headerTitle, { color: colors.title }]}>
              Business
            </Text>
            <Menu
              visible={menuVisible}
              onDismiss={closeMenu}
              anchor={
                <TouchableOpacity
                  onPress={openMenu}
                  style={[
                    styles.companyDropdown,
                    {
                      backgroundColor: colors.card,
                      paddingHorizontal: 8,
                      borderRadius: 10,
                      justifyContent: "center",
                      alignItems: "flex-start",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.companyName,
                      { color: colors.title, padding: 4 },
                    ]}
                  >
                    {selectedCompany}
                  </Text>
                  <AntDesign name="caretdown" size={14} color={colors.title} />
                </TouchableOpacity>
              }
            >
              {companies.map((company: any, index) => (
                <Menu.Item
                  key={index}
                  onPress={() => {
                    changeCompany(company);
                    closeMenu();
                  }}
                  title={company?.name}
                />
              ))}
            </Menu>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity onPress={onOpenFilter}>
              <MaterialIcons
                name="filter-list"
                size={32}
                color={colors.title}
                style={styles.filterIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
};

const FilterTabs = ({ activeTab, setActiveTab }: any) => {
  const tabs = ["All", "Paid", "Unpaid", "Overdue"];
  const theme = useTheme();
  const { colors }: { colors: any } = theme;

  return (
    <View style={[styles.tabContainer, { backgroundColor: colors.background }]}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[styles.tabButton, activeTab === tab && styles.activeTab]}
          onPress={() => setActiveTab(tab)}
        >
          <Text
            style={[styles.tabText, activeTab === tab && styles.activeTabText]}
          >
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const InvoiceCard = ({ invoice }: any) => {
  const navigation = useNavigation();
  const statusColors: any = {
    Unpaid: COLORS.danger,
    Overdue: COLORS.primaryLight,
    Paid: COLORS.primary,
  };
  const showPDFDetail = (data: any) => {
    navigation.navigate("InvoiceDetail", { invoice_id: data.id });
  };

  const theme = useTheme();
  const { colors }: { colors: any } = theme;
  // if (invoice?.invoice_status == 'Unpaid') {
  // 	console.log("invoic card", invoice)
  // }

  return (
    <TouchableOpacity onPress={() => showPDFDetail(invoice)}>
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={[styles.invoiceId, { color: colors.title }]}>
            {invoice.client_info.name}
          </Text>
          <View
            style={[
              styles.statusTag,
              { backgroundColor: statusColors[invoice?.invoice_status] },
            ]}
          >
            <Text style={[styles.statusText, { color: COLORS.background }]}>
              {invoice.invoice_status}
            </Text>
          </View>
        </View>
        <View style={styles.row}>
          <Text
            style={[styles.invoiceId, { color: colors.title, fontSize: 13 }]}
          >
            #{invoice.id}
          </Text>
          <Text style={[styles.items, { color: colors.title }]}>
            {invoice.item_count}
          </Text>
        </View>
        {invoice.full_amount_received == 0 && (
          <Text
            style={[styles.invoiceId, { color: COLORS.danger, fontSize: 13 }]}
          >
            Pending: ₹
            {(
              Number(invoice.grand_total_amount) -
              Number(invoice.received_amount)
            ).toFixed(2)}
          </Text>
        )}

        <View style={styles.row}>
          <Text style={[styles.dueDate, { color: colors.title }]}>
            {invoice.created_at_new}
          </Text>
          <Text style={[styles.amount, { color: colors.title }]}>
            ₹ {invoice.grand_total_amount}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const InvoicesScreen = () => {
  const [isFilterVisible, setFilterVisible] = useState(false);
  const openFilterModal = () => setFilterVisible(true);
  const closeFilterModal = () => setFilterVisible(false);
  const [invoiceList, setInvoiceList] = useState([]);

  const [selectedCompany, setSelectedCompany] = useState("Default");
  const [activeTab, setActiveTab] = useState("All");

  useFocusEffect(
    useCallback(() => {
      fetchInvoiceList();
    }, [])
  );

  const fetchInvoiceList = async () => {
    const companyInfo = await StorageService.getStorage(
      CONFIG.HARDCODE_VALUES.INVOICE_GEN_SESSION.ORGANIZATION_INFO
    );
    if (companyInfo != null) {
      const companyInfoObj = JSON.parse(companyInfo);
      const res = await ApiService.postWithToken(
        "api/invoice-generator/invoice/list",
        { company_id: companyInfoObj.id }
      );
      if (res.status) {
        setInvoiceList(res.data);
      }
    } else {
      MessagesService.commonMessage("Invalid Company ID.");
    }
  };

  const filteredInvoices =
    activeTab === "All"
      ? invoiceList
      : invoiceList.filter(
          (invoice: any) => invoice.invoice_status === activeTab
        );

  const theme = useTheme();
  const { colors }: { colors: any } = theme;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <TopBar
        selectedCompany={selectedCompany}
        setSelectedCompany={setSelectedCompany}
        onOpenFilter={openFilterModal}
        onCompanyChange={fetchInvoiceList} // Pass the callback here
      />
      <View style={{ alignItems: "center" }}>
        <View
          style={{
            paddingVertical: 20,
            // height: 140,
            width: "90%",
            top: 10,
            marginBottom: 10,

            backgroundColor: COLORS.primary,
            borderRadius: 15,
            shadowColor: "#025135",
            shadowOffset: {
              width: 0,
              height: 15,
            },
            shadowOpacity: 0.34,
            shadowRadius: 31.27,
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: "90%",
              flexDirection: "row",
              marginBottom: 10,
              rowGap: 4,
              justifyContent: "center",
              alignItems: "center",
              borderBlockColor: COLORS.white,
              borderBottomWidth: 1,
              padding: 5,
            }}
          >
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                borderRightWidth: 1,
                borderRightColor: COLORS.white,
              }}
            >
              <Text
                style={{
                  ...FONTS.fontBold,
                  fontSize: SIZES.fontSm,
                  color: COLORS.primaryLight,
                }}
              >
                {"Total Amount"}
              </Text>
              <Text
                style={{
                  ...FONTS.fontSemiBold,
                  fontSize: SIZES.fontSm,
                  color: COLORS.white,
                }}
              >
                ₹ {100}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  ...FONTS.fontBold,
                  fontSize: SIZES.fontSm,
                  color: COLORS.primaryLight,
                }}
              >
                {"Pending Amount"}
              </Text>
              <Text
                style={{
                  ...FONTS.fontSemiBold,
                  fontSize: SIZES.fontSm,
                  color: COLORS.white,
                  left: 5,
                }}
              >
                ₹ {100}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <FilterTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      {invoiceList.length > 0 ? (
        <FlatList
          data={filteredInvoices}
          keyExtractor={(item: any) => item.id}
          renderItem={({ item }) => <InvoiceCard invoice={item} />}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <Text
          style={[
            styles.companyMessage,
            { color: colors.title, textAlign: "center", marginTop: 12 },
          ]}
        >
          No Result Found
        </Text>
      )}
      {isFilterVisible && (
        <FilterModal isVisible={isFilterVisible} onClose={closeFilterModal} />
      )}
    </SafeAreaView>
  );
};

const SettingsScreen = () => (
  <View style={styles.centeredView}>
    <Text style={styles.screenText}>Settings</Text>
  </View>
);

const Tab = createBottomTabNavigator();

type InvoiceListsProps = StackScreenProps<RootStackParamList, "InvoiceLists">;

export const InvoiceLists = ({ navigation }: InvoiceListsProps) => {
  const theme = useTheme();
  const { colors }: { colors: any } = theme;

  return (
    <Provider>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            if (route.name === "Invoices") {
              return <MaterialIcons name="receipt" size={size} color={color} />;
            } else if (route.name === "Create") {
              return (
                <MaterialIcons
                  name="add-circle-outline"
                  size={size}
                  color={color}
                />
              );
            } else if (route.name === "Settings") {
              return (
                <MaterialIcons name="settings" size={size} color={color} />
              );
            }
          },
          tabBarActiveTintColor: colors.title,
          tabBarInactiveTintColor: COLORS.primary,
          tabBarStyle: { height: 90, backgroundColor: colors.card },
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
      </Tab.Navigator>
    </Provider>
  );
};

export default InvoiceLists;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  companyDropdown: {
    flexDirection: "row",
    alignItems: "center",
  },
  companyName: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "bold",
  },
  filterIcon: {
    marginLeft: 10,
  },
  companyMessage: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
    padding: 10,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    paddingVertical: 10,
    top: 10,
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
    alignItems: "center",
  },
  dueDate: {
    fontSize: 14,
    color: "#666",
  },
  amount: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
  },
  items: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#888",
  },
  listContainer: {
    paddingVertical: 20,
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
