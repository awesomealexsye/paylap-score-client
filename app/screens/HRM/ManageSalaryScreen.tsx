import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  FlatList,
  ScrollView,
} from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import Header from "../../layout/Header";
import { useTheme } from "@react-navigation/native";
import StorageService from "../../lib/StorageService";
import CONFIG from "../../constants/config";
import { Ionicons } from "@expo/vector-icons";
import {
  useCreateSalaryMutation,
  useUpdateSalaryMutation,
  useGetSalaryDetailsMutation,
} from "../../redux/api/salary.api";
import { COLORS } from "../../constants/theme";

type ManageSalaryScreenProps = StackScreenProps<
  RootStackParamList,
  "ManageSalaryScreen"
>;

// Data type for salary details from API
interface SalaryData {
  basic_salary: string;
  deduction: string;
  total_salary: string;
  salary_components?: {
    name: string;
    amount: string;
  }[];
}

export const ManageSalaryScreen: React.FC<ManageSalaryScreenProps> = ({
  navigation,
  route,
}) => {
  const { employeeDetail } = route.params || {};
  const { colors } = useTheme();

  // --- State Definitions ---
  // Credentials state
  const [credentials, setCredentials] = useState<{
    user_id: string | null;
    auth_key: string | null;
    employee_id: number;
  } | null>(null);

  // API response state for salary details
  const [resData, setResData] = useState(null);

  // Local state for salary fields
  const [salaryData, setSalaryData] = useState({
    basicSalary: "",
    deduction: "",
    totalSalary: "",
  });

  // State for user-managed salary components
  const [salaryComponents, setSalaryComponents] = useState<any[]>([]);

  // --- Mutation Hooks ---
  const [getSalary] = useGetSalaryDetailsMutation();
  const [createSalary] = useCreateSalaryMutation();
  const [updateSalary] = useUpdateSalaryMutation();

  // --- Effects ---
  // Fetch credentials from storage
  useEffect(() => {
    const fetchCredentials = async () => {
      const userIdStr = await StorageService.getStorage(
        CONFIG.HARDCODE_VALUES.USER_ID
      );
      const auth_key = await StorageService.getStorage(
        CONFIG.HARDCODE_VALUES.AUTH_KEY
      );
      setCredentials({
        user_id: userIdStr,
        auth_key,
        employee_id: employeeDetail?.id,
      });
    };
    fetchCredentials();
  }, [employeeDetail?.id]);

  // Fetch salary details when credentials become available
  useEffect(() => {
    if (credentials) {
      getSalary(credentials)
        .unwrap()
        .then((response) => {
          console.log("Salary details fetched:", response);
          setResData(response?.data);
        })
        .catch((error) => {
          console.error("Error fetching salary details:", error);
        });
    }
  }, [credentials]);

  // Update local state from API response
  useEffect(() => {
    if (resData) {
      setSalaryData({
        basicSalary: resData.basic_salary,
        deduction: resData.deduction,
        totalSalary: resData.total_salary,
      });
      if (resData.salary_components) {
        setSalaryComponents(resData.salary_components);
      }
    }
  }, [resData]);

  // Dynamically recalculate the total salary
  useEffect(() => {
    const basic = parseFloat(salaryData.basicSalary) || 0;
    let deduc = parseFloat(salaryData.deduction) || 0;
    const totalAllowances = salaryComponents.reduce(
      (sum, comp) => sum + (parseFloat(comp.amount) || 0),
      0
    );
    const maxBeforeDeduction = basic + totalAllowances;
    if (deduc > maxBeforeDeduction) {
      deduc = maxBeforeDeduction;
      setSalaryData((prev) => ({ ...prev, deduction: String(deduc) }));
    }
    let newTotal = maxBeforeDeduction - deduc;
    if (newTotal < 0) newTotal = 0;
    setSalaryData((prev) => ({ ...prev, totalSalary: newTotal.toFixed(2) }));
  }, [salaryData.basicSalary, salaryData.deduction, salaryComponents]);

  // --- Helper Functions ---
  // Add a new salary component
  const addSalaryComponent = () => {
    setSalaryComponents((prev) => [
      ...prev,
      { id: Date.now(), name: "", amount: "" },
    ]);
  };

  // Remove a salary component by id
  const removeSalaryComponent = (id: number) => {
    setSalaryComponents((prev) => prev.filter((comp) => comp.id !== id));
  };

  // Render a salary component row
  const renderSalaryComponentItem = ({ item }: { item: any }) => (
    <View style={[styles.componentRow, { backgroundColor: colors.card }]}>
      <View style={{ flex: 1, marginRight: 8 }}>
        <TextInput
          style={[styles.componentName, { color: colors.title }]}
          placeholder="Component Name"
          placeholderTextColor={colors.title}
          value={item.name}
          onChangeText={(val) =>
            setSalaryComponents((prev) =>
              prev.map((comp) =>
                comp.id === item.id ? { ...comp, name: val } : comp
              )
            )
          }
        />
      </View>
      <View style={{ flex: 1, marginRight: 8 }}>
        <TextInput
          style={[styles.componentValue, { color: colors.title }]}
          placeholder="Value"
          placeholderTextColor={colors.title}
          keyboardType="numeric"
          value={item.amount}
          onChangeText={(val) =>
            setSalaryComponents((prev) =>
              prev.map((comp) =>
                comp.id === item.id ? { ...comp, amount: val } : comp
              )
            )
          }
        />
      </View>
      <TouchableOpacity onPress={() => removeSalaryComponent(item.id)}>
        <Ionicons name="trash" size={20} color="#ff3b30" />
      </TouchableOpacity>
    </View>
  );
  // --- Save Salary Data ---
  const handleSaveSalary = async () => {
    if (!credentials) return;
    // Prepare payload with fixed values and dynamic state
    const payload = {
      user_id: credentials.user_id,
      auth_key: credentials.auth_key,
      company_id: 1,
      basic_salary: parseFloat(salaryData.basicSalary) || 0,
      deduction: parseFloat(salaryData.deduction) || 0,
      total_salary: parseFloat(salaryData.totalSalary) || 0,
      salary_components: salaryComponents,
      status: "active",
      ...(resData ? { id: resData?.id } : { employee_id: employeeDetail?.id }),
    };


    try {
      if (resData) {
        console.log("resData", resData);
        const response = await updateSalary(payload).unwrap();
        if (response?.status === true) {
          navigation.goBack();
        }
      } else {
        const response = await createSalary(payload).unwrap();
        if (response?.status === true) {
          navigation.goBack();
        }
      }
    } catch (error) {
      console.error("Error saving salary:", error);
    }
  };

  // --- Render ---
  return (
    <>
      <Header leftIcon="back" title="Manage Salary" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {employeeDetail?.name ? employeeDetail.name[0] : "?"}
            </Text>
          </View>
          <Text style={styles.role}>{employeeDetail?.name}</Text>
        </View>
        {/* Salary Details Section */}
        <View
          style={[styles.salaryContainer, { backgroundColor: colors.card }]}
        >
          <Text style={[styles.salaryTitle, { color: colors.title }]}>
            Salary Details
          </Text>

          {/* Basic Salary */}
          <View style={styles.salaryRow}>
            <Text style={[styles.salaryLabel, { color: colors.title }]}>
              Basic Salary
            </Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={[
                  styles.salaryInput,
                  {
                    backgroundColor: colors.background || "#fff",
                    color: colors.title,
                  },
                ]}
                placeholder="0"
                placeholderTextColor="#999"
                keyboardType="numeric"
                value={salaryData.basicSalary}
                onChangeText={(val) =>
                  setSalaryData((prev) => ({ ...prev, basicSalary: val }))
                }
              />
            </View>
          </View>

          {/* Deduction */}
          <View style={styles.salaryRow}>
            <Text style={[styles.salaryLabel, { color: colors.title }]}>
              Deduction
            </Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={[
                  styles.salaryInput,
                  {
                    backgroundColor: colors.background || "#fff",
                    color: colors.title,
                  },
                ]}
                placeholder="0"
                placeholderTextColor="#999"
                keyboardType="numeric"
                value={salaryData.deduction}
                onChangeText={(val) =>
                  setSalaryData((prev) => ({ ...prev, deduction: val }))
                }
              />
            </View>
          </View>

          {/* Total Salary (auto-calculated) */}
          <View style={styles.salaryRow}>
            <Text style={[styles.salaryLabel, { color: colors.title }]}>
              Total Salary
            </Text>
            <View style={[styles.inputWrapper, { backgroundColor: "#eee" }]}>
              <TextInput
                style={[
                  styles.salaryInput,
                  {
                    backgroundColor: colors.background || "#fff",
                    color: colors.title,
                  },
                ]}
                placeholder="0"
                placeholderTextColor="#999"
                keyboardType="numeric"
                value={salaryData.totalSalary}
                editable={false}
              />
            </View>
          </View>

          {/* Salary Components Section */}
          <Text
            style={[styles.salaryTitle, { color: colors.title, marginTop: 20 }]}
          >
            Salary Components
          </Text>
          <TouchableOpacity
            style={styles.addComponentBtn}
            onPress={addSalaryComponent}
          >
            <Ionicons name="add-circle-outline" size={18} color="#478DFF" />
            <Text style={styles.addComponentText}>Add Salary Component</Text>
          </TouchableOpacity>
          <FlatList
            data={salaryComponents}
            keyExtractor={(item) =>
              item.id ? item.id.toString() : Math.random().toString()
            }
            renderItem={renderSalaryComponentItem}
            style={{ marginBottom: 10 }}
            scrollEnabled={false}
          />
          {/* Save Salary Button */}
          <TouchableOpacity
            style={styles.saveSalaryButton}
            onPress={handleSaveSalary}
          >
            <Text style={styles.saveSalaryButtonText}>Save Salary</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
};

export default ManageSalaryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 15,
    paddingBottom: 40,
  },
  salaryContainer: {
    marginTop: 15,
    padding: 15,
    borderRadius: 12,
  },
  salaryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
  },
  salaryRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
    justifyContent: "space-between",
  },
  salaryLabel: {
    fontSize: 14,
    fontWeight: "600",
    width: "40%",
  },
  inputWrapper: {
    flex: 1,
    marginLeft: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#F5F5F5",
    overflow: "hidden",
  },
  salaryInput: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    textAlign: "right",
  },
  addComponentBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  addComponentText: {
    marginLeft: 6,
    fontSize: 14,
    color: "#478DFF",
    fontWeight: "600",
  },
  saveSalaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  saveSalaryButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  componentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 10,
    marginHorizontal: 20,
    marginVertical: 5,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  componentName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  componentValue: {
    fontSize: 15,
    fontWeight: "400",
    color: "#555",
    textAlign: "right",
  },
  profileContainer: { alignItems: "center", marginVertical: 15 },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { fontSize: 24, color: "white", fontWeight: "bold" },
  role: { fontSize: 14, color: "#888", marginTop: 5 },
});
