import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import {
  FontAwesome5,
  MaterialIcons,
} from "@expo/vector-icons";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import { useTheme } from "@react-navigation/native";
import { COLORS } from "../../constants/theme";
import StorageService from "../../lib/StorageService";
import CONFIG from "../../constants/config";
import { useGetCompanyListMutation } from "../../redux/api/company.api";

type EmployeeManagementScreenProps = StackScreenProps<
  RootStackParamList,
  "EmployeeManagementScreen"
>;

export const EmployeeManagementScreen = ({
  navigation,
}: EmployeeManagementScreenProps) => {
  const [getCompanyList] = useGetCompanyListMutation();

  const theme = useTheme();
  const { colors }: { colors: any } = theme;

  // Store credentials from storage
  const [credentials, setCredentials] = useState<{
    user_id: string | null;
    auth_key: string | null;
  } | null>(null);

  // For the dropdown header (company list)
  const [companyList, setCompanyList] = useState<any[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  // Fetch credentials and possible stored company from local storage
  useEffect(() => {
    const fetchCredentials = async () => {
      const userIdStr = await StorageService.getStorage(
        CONFIG.HARDCODE_VALUES.USER_ID
      );
      const auth_key = await StorageService.getStorage(
        CONFIG.HARDCODE_VALUES.AUTH_KEY
      );

      // Retrieve stored company ID and name
      const storedCompanyId = await StorageService.getStorage(
        CONFIG.HARDCODE_VALUES.HRM_SESSION.COMPANY_ID
      );
      const storedCompanyName = await StorageService.getStorage(
        CONFIG.HARDCODE_VALUES.HRM_SESSION.COMPANY_NAME
      );

      let initialSelectedCompany: any = null;
      if (storedCompanyId && storedCompanyName) {
        initialSelectedCompany = {
          id: storedCompanyId,
          name: storedCompanyName,
        };
      }

      setSelectedCompany(initialSelectedCompany);
      setCredentials({ user_id: userIdStr, auth_key });
    };
    fetchCredentials();
  }, []);

  // Fetch company list from API
  useEffect(() => {
    if (credentials && credentials.user_id && credentials.auth_key) {
      getCompanyList({
        user_id: credentials.user_id,
        auth_key: credentials.auth_key,
      })
        .unwrap()
        .then((data) => {
          setCompanyList(data.data);
          if (data.data && data.data.length > 0) {
            // If we already have a selectedCompany from storage, confirm it's valid
            if (selectedCompany && selectedCompany.id) {
              const foundCompany = data.data.find(
                (c: any) => c.id == selectedCompany.id
              );
              if (foundCompany) {
                // If found, set that as selected
                setSelectedCompany(foundCompany);
              } else {
                // If not found, fallback to the first in the list
                setSelectedCompany(data.data[0]);
                // Also store in local storage
                StorageService.setStorage(
                  CONFIG.HARDCODE_VALUES.HRM_SESSION.COMPANY_ID,
                  data.data[0].id.toString()
                );
                StorageService.setStorage(
                  CONFIG.HARDCODE_VALUES.HRM_SESSION.COMPANY_NAME,
                  data.data[0].name
                );
              }
            } else {
              // No previously selected company, set the first in the list
              setSelectedCompany(data.data[0]);
              // Store in local storage
              StorageService.setStorage(
                CONFIG.HARDCODE_VALUES.HRM_SESSION.COMPANY_ID,
                data.data[0].id.toString()
              );
              StorageService.setStorage(
                CONFIG.HARDCODE_VALUES.HRM_SESSION.COMPANY_NAME,
                data.data[0].name
              );
            }
          }
        })
        .catch((err) => {
          console.error("Error fetching companies:", err);
        });
    }
  }, [credentials]);

  // Handle company selection
  const handleSelectCompany = (company: any) => {
    setSelectedCompany(company);
    setDropdownVisible(false);

    // Store in local storage
    StorageService.setStorage(
      CONFIG.HARDCODE_VALUES.HRM_SESSION.COMPANY_ID,
      company.id.toString()
    );
    StorageService.setStorage(
      CONFIG.HARDCODE_VALUES.HRM_SESSION.COMPANY_NAME,
      company.name
    );
  };

  // Card items
  const cardItems = [
    {
      title: "Manage Company",
      icon: "building",
      color: "#28a745",
      route: "HRMCompanyListScreen",
    },
    {
      title: "Employee Management",
      icon: "users",
      color: "#6A5ACD",
      route: "EmployeeListScreen",
    },
    {
      title: "Salary Management",
      icon: "credit-card",
      color: "#1E90FF",
      route: "GenerateEmployeeSalariesListScreen",
    },
    {
      title: "Time Attendance",
      icon: "calendar-check",
      color: "#FF5733",
      route: "NotAvailable",
    },
    {
      title: "Salary Statement",
      icon: "file-invoice-dollar",
      color: "#FF1493",
      route: "NotAvailable",
    },
  ];

  const [mainItem, ...otherItems] = cardItems;

  return (
    <View style={styles.container}>
      {/* Custom header */}
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        {/* Back Arrow */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerIconLeft}
        >
          <MaterialIcons name="arrow-back" size={24} color={colors.title} />
        </TouchableOpacity>

        {/* Title in center */}
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: colors.title }]}>
            Employee Management
          </Text>
        </View>

        {/* Plus Icon to create company */}
        <TouchableOpacity
          onPress={() => navigation.navigate("HRMAddCompany")}
          style={styles.headerIconRight}
        >
          <MaterialIcons name="add" size={24} color={colors.title} />
        </TouchableOpacity>
      </View>

      {/* Second row in header for Company Selector */}
      <View
        style={[
          styles.headerDropdownRow,
          { backgroundColor: colors.card, borderTopColor: "#E2E8F0" },
        ]}
      >
        <TouchableOpacity
          style={styles.companySelectorButton}
          onPress={() => setDropdownVisible(!dropdownVisible)}
        >
          <Text style={[styles.companySelectorButtonText, { color: colors.title }]}>
            {selectedCompany ? selectedCompany.name : "Select Company"}
          </Text>
          <MaterialIcons
            name={dropdownVisible ? "arrow-drop-up" : "arrow-drop-down"}
            size={24}
            color={colors.title}
          />
        </TouchableOpacity>
      </View>
      {dropdownVisible && (
        <View
          style={[
            styles.dropdownList,
            {
              backgroundColor: colors.card,
              borderTopWidth: 0,
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
            },
          ]}
        >
          {companyList?.map((company, index) => (
            <TouchableOpacity
              key={index}
              style={styles.dropdownItem}
              onPress={() => handleSelectCompany(company)}
            >
              <Text style={[styles.dropdownItemText, { color: colors.title }]}>
                {company.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* List Section */}
      <ScrollView style={styles.content}>
        {/* Main card container */}
        <View style={styles.mainCardContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate(mainItem.route)}
            style={[styles.mainCard, { backgroundColor: mainItem.color }]}
          >
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: "rgba(255,255,255,0.2)" },
              ]}
            >
              <FontAwesome5 name={mainItem.icon} size={30} color="white" />
            </View>
            <Text style={[styles.cardText, { color: "white", fontSize: 16 }]}>
              {mainItem.title}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Two-column grid for other cards */}
        <View style={styles.gridContainer}>
          {otherItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => navigation.navigate(item.route)}
              style={[styles.card, { backgroundColor: item.color }]}
            >
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: "rgba(255,255,255,0.2)" },
                ]}
              >
                <FontAwesome5 name={item.icon} size={24} color="white" />
              </View>
              <Text style={[styles.cardText, { color: "white" }]}>
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default EmployeeManagementScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },

  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  headerIconLeft: {
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerIconRight: {
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },

  /* Header Dropdown Row */
  headerDropdownRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
  },
  companySelectorButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  companySelectorButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  dropdownList: {
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    paddingVertical: 4,
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  dropdownItemText: {
    fontSize: 14,
  },

  /* Content */
  content: {
    padding: 15,
    zIndex: -10,
  },

  /* Main Card */
  mainCardContainer: {
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "center",
  },
  mainCard: {
    width: "100%",
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 15,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },

  /* Grid */
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "#FFFFFF",
    width: "48%",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 15,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cardText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#444",
    marginTop: 10,
    textAlign: "center",
  },
});