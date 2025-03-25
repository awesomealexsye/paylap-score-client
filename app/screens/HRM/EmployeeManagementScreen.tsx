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
  MaterialCommunityIcons,
  Feather,
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

  // For the dropdown header
  const [companyList, setCompanyList] = useState<any[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    const fetchCredentials = async () => {
      const userIdStr = await StorageService.getStorage(
        CONFIG.HARDCODE_VALUES.USER_ID
      );
      const auth_key = await StorageService.getStorage(
        CONFIG.HARDCODE_VALUES.AUTH_KEY
      );
      setCredentials({ user_id: userIdStr, auth_key });
    };
    fetchCredentials();
  }, []);

  useEffect(() => {
    if (credentials && credentials.user_id && credentials.auth_key) {
      getCompanyList({
        user_id: credentials.user_id,
        auth_key: credentials.auth_key,
      })
        .unwrap()
        .then((data) => {
          // Assuming data.data is an array of companies
          console.log("data :", data.data);
          setCompanyList(data.data);
          if (data.data && data.data.length > 0) {
            setSelectedCompany(data.data[0]);
          }
        })
        .catch((err) => {
          console.error("Error fetching companies:", err);
        });
    }
  }, [credentials]);

  return (
    <View style={styles.container}>
      {/* Custom header with dropdown */}
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color={colors.title} />
        </TouchableOpacity>
        <View style={styles.dropdownContainer}>
          <Text
            style={[styles.headerTitle, { color: colors.title, fontSize: 15 }]}
          >
            Employee Management
          </Text>
          <Text
            style={[styles.headerTitle, { color: colors.title, opacity: 0.6 }]}
          >
            {selectedCompany ? selectedCompany.name : "Select Company"}
          </Text>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setDropdownVisible(!dropdownVisible)}
          >
            <MaterialIcons
              name="arrow-drop-down"
              size={24}
              color={colors.title}
            />
          </TouchableOpacity>
          {dropdownVisible && (
            <View style={styles.dropdownList}>
              {companyList?.map((company, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSelectedCompany(company);
                    setDropdownVisible(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>{company.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>

      {/* List Section */}
      <ScrollView style={styles.content}>
        <TouchableOpacity
          onPress={() => navigation.navigate("HRMAddCompany")}
          style={[
            styles.listItem,
            { backgroundColor: colors.card, borderColor: "gray" },
          ]}
        >
          {/* Icon Container */}
          <View
            style={[
              styles.listIconContainer,
              { backgroundColor: COLORS.primary },
            ]}
          >
            <MaterialIcons
              name="business"
              size={20}
              color={COLORS.background}
            />
          </View>
          {/* Text */}
          <Text style={[styles.listText, { color: colors.title }]}>
            Create Company
          </Text>
          {/* Arrow */}
          <Feather name="chevron-right" size={22} color="#999" />
        </TouchableOpacity>
        <View
          style={[
            styles.gridContainer,
            { backgroundColor: colors.backgroundColor },
          ]}
        >
          {[
            {
              title: "Employee Management",
              icon: "users",
              color: "#6A5ACD",
              route: "EmployeeManagementScreen",
            },
            {
              title: "Salary Management",
              icon: "credit-card",
              color: "#1E90FF",
              route: "GenerateEmployeeSalariesListScreen",
            },
          ].map((item, index) => (
            <TouchableOpacity
              onPress={() => navigation.navigate(item?.route)}
              key={index}
              style={[styles.card, { backgroundColor: COLORS.primary }]}
            >
              <View style={styles.iconContainer}>
                <FontAwesome5 name={item.icon} size={24} color="white" />
              </View>
              <Text style={[styles.cardText, { color: "white" }]}>
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {[
          {
            title: " Employee List",
            icon: "user-plus",
            color: "#6A5ACD",
            route: "EmployeeListScreen",
          },
          {
            title: "Time Attendance",
            icon: "calendar-check",
            color: "#FF5733",
            route: "EmployeeAttendendsList",
          },
          {
            title: "Salary Statement",
            icon: "file-invoice-dollar",
            color: "#FF1493",
            route: "EmployeeAttendanceDetails",
          },
        ].map((item, index) => (
          <TouchableOpacity
            onPress={() => navigation.navigate(item?.route)}
            key={index}
            style={[
              styles.listItem,
              { borderColor: item.color, backgroundColor: colors.card },
            ]}
          >
            {/* Icon Container */}
            <View
              style={[
                styles.listIconContainer,
                { backgroundColor: item.color },
              ]}
            >
              <FontAwesome5 name={item.icon} size={18} color="white" />
            </View>
            {/* Text */}
            <Text style={[styles.listText, { color: colors.title }]}>
              {item.title}
            </Text>
            {/* Arrow */}
            <Feather name="chevron-right" size={22} color="#999" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    overflow: "visible", // allow dropdown to be visible
  },
  dropdownContainer: {
    flex: 1,
    marginLeft: 16,
    position: "relative",
    overflow: "visible", // allow dropdown list to overflow
    zIndex: 1000,
  },
  headerTitle: {
    fontSize: 12,
    fontWeight: "500",
  },
  dropdownButton: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  dropdownList: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingVertical: 5,
    zIndex: 10000,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  dropdownItemText: {
    fontSize: 13,
    color: "#1E293B",
  },
  content: { padding: 15, zIndex: -10 },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "#FFFFFF",
    width: "48%",
    padding: 10,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 15,
    elevation: 3,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
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
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    position: "relative",
  },
  listIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  listText: { flex: 1, fontSize: 12, fontWeight: "500" },
});

export default EmployeeManagementScreen;
