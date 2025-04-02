import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
} from "react-native";
import { Feather, AntDesign, FontAwesome } from "@expo/vector-icons";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import Header from "../../layout/Header";
import { useTheme } from "@react-navigation/native";
import StorageService from "../../lib/StorageService";
import CONFIG from "../../constants/config";
import { useGetEmployeesQuery } from "../../redux/api/employee.api";
import { COLORS } from "../../constants/theme";
import { ActivityIndicator } from "react-native-paper";

type EmployeeListScreenProps = StackScreenProps<
  RootStackParamList,
  "EmployeeListScreen"
>;

export const EmployeeListScreen = ({ navigation }: EmployeeListScreenProps) => {
  const theme = useTheme();
  const { colors }: { colors: any } = theme;

  // For storing the company ID
  const [companyID, setCompanyID] = useState<string | null>(null);

  // For storing user credentials
  const [credentials, setCredentials] = useState<{
    user_id: string | null;
    auth_key: string | null;
  } | null>(null);

  // Fetch credentials and company ID from local storage
  useEffect(() => {
    const fetchCredentials = async () => {
      const userIdStr = await StorageService.getStorage(
        CONFIG.HARDCODE_VALUES.USER_ID
      );
      const auth_key = await StorageService.getStorage(
        CONFIG.HARDCODE_VALUES.AUTH_KEY
      );
      const tempCompanyID = await StorageService.getStorage(
        CONFIG.HARDCODE_VALUES.HRM_SESSION.COMPANY_ID
      );

      setCompanyID(tempCompanyID);
      setCredentials({
        user_id: userIdStr,
        auth_key: auth_key,
      });
    };
    fetchCredentials();
  }, []);

  /**
   * Query to fetch employees. We skip the query until
   * credentials and companyID are loaded to avoid errors.
   */
  const { data, error, isLoading } = useGetEmployeesQuery(
    credentials
      ? {
        user_id: credentials.user_id || "",
        auth_key: credentials.auth_key || "",
        company_id: companyID || "",
      }
      : { user_id: "", auth_key: "", company_id: "" },
    {
      skip: !credentials, // Skip until credentials is set
    }
  );

  // Track which item is selected
  const [selectedId, setSelectedId] = useState<string | number>("1");

  // 1. Show loader if API is still fetching data
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={70} color={COLORS.primary} />
      </View>
    );
  }

  // 2. Show error if API call fails
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={{ color: COLORS.danger }}>
          Error loading employee details.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header leftIcon="back" title=" Employee List" />

      {/* 3. If no employees found, show message. Otherwise, show the list. */}
      {!data?.data || data.data.length === 0 ? (
        <View style={styles.content}>
          <Image
            // If you have a local image, replace src with require(...) or the correct import
            src={"assets/images/card.png"}
            style={styles.illustration}
            resizeMode="contain"
          />
          <Text style={[styles.noDataText, { color: colors.title }]}>
            No employees found
          </Text>
          <Text style={[styles.subText, { color: colors.title }]}>
            Add your employee
          </Text>
        </View>
      ) : (
        <FlatList
          data={data.data}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.card, { backgroundColor: colors.card }]}
              onPress={() => {
                console.log("item id", item.id);
                setSelectedId(item.id);
                navigation.navigate("EmployeeDetailScreen", item.id);
              }}
            >
              <View
                style={[styles.avatar, { backgroundColor: COLORS.primary }]}
              >
                <Text style={[styles.avatarText, { color: COLORS.background }]}>
                  {item.name[0]}
                </Text>
              </View>
              <View style={styles.info}>
                <Text style={[styles.name, { color: colors.title }]}>
                  {item.name}
                </Text>
                <Text style={[styles.role]}>{item.department}</Text>
              </View>
              {selectedId === item.id && (
                <FontAwesome name="dot-circle-o" size={20} color="#478DFF" />
              )}
            </TouchableOpacity>
          )}
        />
      )}

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("AddEmployee")}
      >
        <AntDesign name="plus" size={26} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },

  // Content
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  illustration: {
    width: 250,
    height: 200,
    marginBottom: 20,
  },
  noDataText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  subText: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },

  // Floating Button
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#4A90E2",
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 12,
    marginVertical: 5,
    marginHorizontal: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    top: 15,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { color: "white", fontSize: 16, fontWeight: "bold" },
  info: { flex: 1, marginLeft: 15 },
  name: { fontSize: 13, fontWeight: "bold", color: "#333" },
  role: { fontSize: 12, color: "#777" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default EmployeeListScreen;