import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
} from "react-native";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import { useFocusEffect, useTheme } from "@react-navigation/native";
import StorageService from "../../lib/StorageService";
import CONFIG from "../../constants/config";
import { useGetCompanyListMutation } from "../../redux/api/company.api";
import { COLORS, FONTS } from "../../constants/theme";

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
  const [modalVisible, setModalVisible] = useState(false);

  // Blocking modal if no company is available
  const [blockedModalVisible, setBlockedModalVisible] = useState(false);

  const [getCompanyList] = useGetCompanyListMutation();

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
  useFocusEffect(
    useCallback(() => {
      if (credentials && credentials.user_id && credentials.auth_key) {
        getCompanyList({
          user_id: credentials.user_id,
          auth_key: credentials.auth_key,
        })
          .unwrap()
          .then((data) => {
            setCompanyList(data.data || []);
            // Check if stored company is still valid
            if (data.data && data.data.length > 0) {
              if (selectedCompany && selectedCompany.id) {
                const found = data.data.find(
                  (c: any) => c.id == selectedCompany.id
                );
                if (!found) {
                  // If stored company not found in new list, fallback to first
                  setSelectedCompany(data.data[0]);
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
                // No previously selected, use the first
                setSelectedCompany(data.data[0]);
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
    }, [credentials])
  );

  // Handle company selection from the modal
  const handleSelectCompany = (company: any) => {
    setSelectedCompany(company);
    setModalVisible(false);

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

  /**
   * If there's no company in the list or no selectedCompany,
   * we block navigation and show a "create new company" modal.
   */
  const handleCardPress = (route: string) => {
    if (!selectedCompany || companyList.length === 0) {
      // Show the blocked modal
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
    // {
    //   title: "Time Attendance",
    //   icon: "calendar-check",
    //   color: "#FF5733",
    //   route: "NotAvailable",
    // },
    // {
    //   title: "Salary Statement",
    //   icon: "file-invoice-dollar",
    //   color: "#FF1493",
    //   route: "NotAvailable",
    // },
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
            onPress={() => setModalVisible(true)}
          >
            <Text style={[styles.companyNameText, { color: colors.text }]}>
              {selectedCompany ? selectedCompany.name : "Select Company"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal for selecting company */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={[styles.modalOverlay, { backgroundColor: colors.background }]}
          activeOpacity={0.1}
          onPress={() => setModalVisible(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
                navigation.navigate("HRMAddCompany", { company: null });
              }}
              style={styles.plusIconContainer}
            >
              <MaterialIcons
                name="add"
                size={20}
                color={colors.title}
                style={{ marginTop: 0 }}
              />
              <Text style={[{ color: colors.title, ...FONTS.fontSemiBold }]}>
                Add New Company
              </Text>
            </TouchableOpacity>
            {companyList?.map((company, index) => (
              <>
                <TouchableOpacity
                  key={index}
                  style={styles.modalItem}
                  onPress={() => handleSelectCompany(company)}
                >
                  <Text style={[styles.modalItemText, { color: colors.title }]}>
                    {company.name}
                  </Text>
                </TouchableOpacity>
              </>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

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

  /* Header */
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
  plusIconContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
  },

  /* Modal */
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
  modalItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  modalItemText: {
    fontSize: 14,
  },

  /* Blocked Modal */
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
});
