import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import Header from "../../layout/Header";
import { useTheme } from "@react-navigation/native";
import StorageService from "../../lib/StorageService";
import CONFIG from "../../constants/config";
import {
  useCreateAccountMutation,
  useUpdateAccountMutation,
  useGetAccountDetailsMutation,
} from "../../redux/api/bankAccount.api";
import { COLORS } from "../../constants/theme";
import { ActivityIndicator } from "react-native-paper";

type AccountInformationScreenProps = StackScreenProps<
  RootStackParamList,
  "AccountInformationScreen"
>;

export const AccountInformationScreen: React.FC<
  AccountInformationScreenProps
> = ({ navigation, route }) => {
  // We receive the employee/account ID via route params
  const employee = route.params || {};
  const { colors } = useTheme();

  // --- State Definitions ---

  // Credentials from local storage
  const [credentials, setCredentials] = useState<{
    user_id: string | null;
    auth_key: string | null;
  } | null>(null);

  // Local state for storing fetched account data
  const [accountData, setAccountData] = useState<any>(null);

  // For account type selection
  const [accountType, setAccountType] = useState<"bank" | "upi" | "none">(
    "none"
  );

  // Bank details state
  const [bankDetails, setBankDetails] = useState({
    account_number: "",
    ifsc_code: "",
    branch_name: "",
  });

  // UPI details state
  const [upiId, setUpiId] = useState("");

  // --- Endpoint Hooks ---
  // Get account details
  const [getAccountDetails, { data, isLoading, error }] =
    useGetAccountDetailsMutation();
  // Create and update account endpoints
  const [createAccount] = useCreateAccountMutation();
  const [updateAccount] = useUpdateAccountMutation();

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
      setCredentials({ user_id: userIdStr, auth_key });
    };
    fetchCredentials();
  }, [employee?.id]);

  // Fetch account details when credentials and employeeId are available
  useEffect(() => {
    if (credentials && employee?.id) {
      getAccountDetails({
        id: employee.id,
        user_id: credentials.user_id,
        auth_key: credentials.auth_key,
      })
        .unwrap()
        .then((response) => {
          console.log("Account details fetched:", response);
          setAccountData(response.data);
        })
        .catch((err) => console.error("Error fetching account details:", err));
    }
  }, [credentials, employee?.id]);

  // --- Save Account Information ---
  const handleSave = async () => {
    console.log(employee, "$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
    // Prepare payload with the fields (extend with additional fields as needed)
    const payload = {
      ...credentials,
      employee_id: employee?.id,
      account_type: accountType,
      ...bankDetails,
      upiId,
    };
    console.log("Prepared account payload:", payload);
    try {
      if (accountData) {
        // Update existing account info
        const response = await updateAccount(payload).unwrap();
        console.log("Account updated:", response);
      } else {
        // Create new account info
        const response = await createAccount(payload).unwrap();
        console.log("Account created:", response);
      }
    } catch (error) {
      console.error("Error saving account info:", error);
    }
  };

  // --- Render UI ---
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={70} color={COLORS.primary} />
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={{ color: COLORS.danger }}>
          Error loading account details.
        </Text>
      </View>
    );
  }

  return (
    <>
      <Header leftIcon="back" title="Account Information" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Optional: Display account name and ID if available */}
        <View style={styles.employeeInfo}>
          <Text style={styles.employeeName}>
            {accountData?.name || "Employee Name"}
          </Text>
          <Text style={styles.employeeId}>
            ID: {accountData?.id || "No ID"}
          </Text>
        </View>

        {/* Account Type Picker */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Account Type</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={accountType}
              onValueChange={(itemValue) => setAccountType(itemValue as any)}
            >
              <Picker.Item label="-- Choose --" value="none" />
              <Picker.Item label="Bank Information" value="bank" />
              <Picker.Item label="UPI" value="upi" />
            </Picker>
          </View>
        </View>

        {/* Bank Details Section */}
        {accountType === "bank" && (
          <View style={[styles.section, { backgroundColor: colors.card }]}>
            <Text style={[styles.sectionTitle, { color: colors.title }]}>
              Bank Details
            </Text>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Account Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Account Number"
                placeholderTextColor="#999"
                keyboardType="numeric"
                value={bankDetails.account_number}
                onChangeText={(val) =>
                  setBankDetails((prev) => ({ ...prev, account_number: val }))
                }
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>IFSC Code</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter IFSC Code"
                placeholderTextColor="#999"
                value={bankDetails.ifsc_code}
                onChangeText={(val) =>
                  setBankDetails((prev) => ({ ...prev, ifsc_code: val }))
                }
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Branch Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Branch Name"
                placeholderTextColor="#999"
                value={bankDetails.branch_name}
                onChangeText={(val) =>
                  setBankDetails((prev) => ({ ...prev, branch_name: val }))
                }
              />
            </View>
          </View>
        )}

        {/* UPI Details Section */}
        {accountType === "upi" && (
          <View style={[styles.section, { backgroundColor: colors.card }]}>
            <Text style={[styles.sectionTitle, { color: colors.title }]}>
              UPI Details
            </Text>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>UPI ID</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter UPI ID"
                placeholderTextColor="#999"
                value={upiId}
                onChangeText={setUpiId}
              />
            </View>
          </View>
        )}

        {/* Save Button */}
        {accountType !== "none" && (
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </>
  );
};

export default AccountInformationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 15,
    paddingBottom: 40,
  },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  employeeInfo: {
    alignItems: "center",
    marginVertical: 20,
  },
  employeeName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  employeeId: {
    fontSize: 12,
    color: "#777",
    marginTop: 4,
  },
  section: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    overflow: "hidden",
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    color: "#333",
  },
  saveButton: {
    backgroundColor: "#478DFF",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
