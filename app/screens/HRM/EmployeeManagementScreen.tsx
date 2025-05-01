// app/screens/HRM/EmployeeManagementScreen.tsx

import React, {
  useCallback,
  useEffect,
  useState,
  useRef,
  useMemo,
} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  Image,
} from "react-native";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import { useFocusEffect, useTheme } from "@react-navigation/native";
import StorageService from "../../lib/StorageService";
import { ApiService } from "../../lib/ApiService";
import CONFIG from "../../constants/config";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { COLORS } from "../../constants/theme";

type EmployeeManagementScreenProps = StackScreenProps<
  RootStackParamList,
  "EmployeeManagementScreen"
>;

export const EmployeeManagementScreen = ({
  navigation,
}: EmployeeManagementScreenProps) => {
  const theme = useTheme();
  const { colors }: { colors: any } = theme;

  // Store credentials from storage
  const [credentials, setCredentials] = useState<{
    user_id: string | null;
    auth_key: string | null;
  } | null>(null);

  // Company data
  const [companyList, setCompanyList] = useState<any[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["25%", "50%"], []);

  // Home-count data
  const [homeCount, setHomeCount] = useState<{
    company_count: number;
    employee_count: number;
    emp_leave_count: number;
  }>({
    company_count: 0,
    employee_count: 0,
    emp_leave_count: 0,
  });

  // Blocking modal if no company is available
  const [blockedModalVisible, setBlockedModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const fetchHomeCount = async () => {
        const res: any = await ApiService.postWithToken(
          "api/employee/hrm-home-count",
          {}
        );
        if (res && res.status) {
          setHomeCount(res.data);
        }
      };
      fetchHomeCount();
    }, [credentials])
  );

  // Fetch credentials and any stored company from local storage
  useEffect(() => {
    const fetchCredentials = async () => {
      const userIdStr = await StorageService.getStorage(
        CONFIG.HARDCODE_VALUES.USER_ID
      );
      const auth_key = await StorageService.getStorage(
        CONFIG.HARDCODE_VALUES.AUTH_KEY
      );

      const storedCompanyId = await StorageService.getStorage(
        CONFIG.HARDCODE_VALUES.HRM_SESSION.COMPANY_ID
      );
      const storedCompanyName = await StorageService.getStorage(
        CONFIG.HARDCODE_VALUES.HRM_SESSION.COMPANY_NAME
      );
      // load the previously‐stored image key
      const storedCompanyImg = await StorageService.getStorage(
        CONFIG.HARDCODE_VALUES.HRM_SESSION.COMPANY_IMG
      );

      let initialSelectedCompany: any = null;
      if (storedCompanyId && storedCompanyName) {
        initialSelectedCompany = {
          id: storedCompanyId,
          name: storedCompanyName,
          image: storedCompanyImg || null,
        };
      }

      setSelectedCompany(initialSelectedCompany);
      setCredentials({ user_id: userIdStr, auth_key });
    };
    fetchCredentials();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (credentials?.user_id && credentials?.auth_key) {
        ApiService.postWithToken("api/hrm/companies/list", {
          user_id: credentials.user_id,
          auth_key: credentials.auth_key,
        })
          .then((res: any) => {
            if (res?.status) {
              setCompanyList(res.data || []);
              // retain previously selected company if still available
              if (res.data && res.data.length > 0) {
                if (selectedCompany && selectedCompany.id) {
                  const found = res.data.find(
                    (c: any) => c.id == selectedCompany.id
                  );
                  if (!found) {
                    setSelectedCompany(res.data[0]);
                    StorageService.setStorage(
                      CONFIG.HARDCODE_VALUES.HRM_SESSION.COMPANY_ID,
                      res.data[0].id.toString()
                    );
                    StorageService.setStorage(
                      CONFIG.HARDCODE_VALUES.HRM_SESSION.COMPANY_NAME,
                      res.data[0].name
                    );
                    StorageService.setStorage(
                      CONFIG.HARDCODE_VALUES.HRM_SESSION.COMPANY_IMG,
                      res.data[0].image
                    );
                  }
                } else {
                  setSelectedCompany(res.data[0]);
                  StorageService.setStorage(
                    CONFIG.HARDCODE_VALUES.HRM_SESSION.COMPANY_ID,
                    res.data[0].id.toString()
                  );
                  StorageService.setStorage(
                    CONFIG.HARDCODE_VALUES.HRM_SESSION.COMPANY_NAME,
                    res.data[0].name
                  );
                  StorageService.setStorage(
                    CONFIG.HARDCODE_VALUES.HRM_SESSION.COMPANY_IMG,
                    res.data[0].image
                  );
                }
              }
            }
          })
          .catch((err) => console.error("Error fetching companies:", err));
      }
    }, [credentials])
  );

  // Handle company selection from the bottom sheet
  const handleSelectCompany = (company: any) => {
    setSelectedCompany(company);
    bottomSheetRef.current?.close();

    StorageService.setStorage(
      CONFIG.HARDCODE_VALUES.HRM_SESSION.COMPANY_ID,
      company.id.toString()
    );
    StorageService.setStorage(
      CONFIG.HARDCODE_VALUES.HRM_SESSION.COMPANY_NAME,
      company.name
    );
    // persist the image filename so we can show it in the header
    StorageService.setStorage(
      CONFIG.HARDCODE_VALUES.HRM_SESSION.COMPANY_IMG,
      company.image
    );
  };

  /**
   * If there's no company in the list or no selectedCompany,
   * we block navigation and show a "create new company" modal.
   */
  const handleCardPress = (route: string) => {
    if (!selectedCompany || companyList.length === 0) {
      setBlockedModalVisible(true);
      return;
    }
    navigation.navigate(route);
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
  ];
  const [mainItem, ...otherItems] = cardItems;

  return (
    <View style={styles.container}>
      {/* Custom Header */}
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        {/* First row: Back Arrow + Title */}
        <View style={styles.headerTopRow}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.headerIconLeft}
          >
            <MaterialIcons name="arrow-back" size={24} color={colors.title} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.title }]}>
            Employee Management
          </Text>
        </View>

        {/* Second row: Company name (left) + Plus icon (right) */}
        <View style={styles.headerBottomRow}>
          <TouchableOpacity
            style={styles.companyNameContainer}
            onPress={() => bottomSheetRef.current?.expand()}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {selectedCompany?.image && (
                <Image
                  source={{
                    uri: `${CONFIG.APP_URL}/uploads/companies/${selectedCompany.image}`,
                  }}
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    marginRight: 8,
                  }}
                />
              )}
              <Text style={[styles.companyNameText, { color: colors.text }]}>
                {selectedCompany ? selectedCompany.name : "Select Company"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom-sheet for company selection */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backgroundStyle={{ backgroundColor: colors.background }}
      >
        <BottomSheetFlatList
          data={companyList}
          style={{ backgroundColor: colors.card }}
          contentContainerStyle={{ paddingBottom: 20 }}
          keyExtractor={(item: any) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderBottomWidth: 1,
                borderBottomColor: "gray",
              }}
              onPress={() => handleSelectCompany(item)}
            >
              <Image
                source={{
                  uri: `${CONFIG.APP_URL}/uploads/companies/${item.image}`,
                }}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  marginRight: 12,
                  backgroundColor: "#eee",
                }}
              />
              <Text
                style={{ fontSize: 16, color: colors.title, flexShrink: 1 }}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      </BottomSheet>

      {/* Modal if no company is found */}
      <Modal
        visible={blockedModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setBlockedModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setBlockedModalVisible(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.blockedTitle, { color: colors.title }]}>
              No Company Found
            </Text>
            <Text style={[styles.blockedMessage, { color: colors.title }]}>
              Create a new or choose company from top to access these features.
            </Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => {
                setBlockedModalVisible(false);
                navigation.navigate("HRMAddCompany", { company: null });
              }}
            >
              <Text style={styles.createButtonText}>Create Company</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Scrollable List Section */}
      <ScrollView style={styles.content}>
        {/* Home-count row */}
        <View style={styles.countRow}>
          <View style={[styles.countCard, { backgroundColor: colors.card }]}>
            <Text style={styles.countNumber}>{homeCount.company_count}</Text>
            <Text style={[styles.countLabel, { color: colors.title }]}>
              Company
            </Text>
          </View>
          <View style={[styles.countCard, { backgroundColor: colors.card }]}>
            <Text style={styles.countNumber}>{homeCount.employee_count}</Text>
            <Text style={[styles.countLabel, { color: colors.title }]}>
              Employees
            </Text>
          </View>
          <View style={[styles.countCard, { backgroundColor: colors.card }]}>
            <Text style={styles.countNumber}>{homeCount.emp_leave_count}</Text>
            <Text style={[styles.countLabel, { color: colors.title }]}>
              Leaves Today
            </Text>
          </View>
        </View>

        {/* Main card container */}
        <View style={styles.mainCardContainer}>
          <TouchableOpacity
            onPress={() => handleCardPress(mainItem.route)}
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
              onPress={() => handleCardPress(item.route)}
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
  header: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  headerBottomRow: {
    flexDirection: "row",
  },
  headerIconLeft: {
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  companyNameContainer: {
    flex: 1,
    paddingHorizontal: 56,
  },
  companyNameText: {
    fontSize: 14,
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  blockedTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },
  blockedMessage: {
    fontSize: 14,
    marginBottom: 15,
  },
  createButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  createButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  content: {
    padding: 15,
    zIndex: -10,
  },
  countRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  countCard: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    marginHorizontal: 4,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  countNumber: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primary,
  },
  countLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#444",
    marginTop: 4,
  },
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
});
