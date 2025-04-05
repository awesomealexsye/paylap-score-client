import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
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
        employee_id: employee.id,
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

  // Sync local state with fetched account data
  useEffect(() => {
    if (accountData) {
      // If accountData has account_type, set the accountType accordingly
      if (accountData.account_type === "bank") {
        setAccountType("bank");
        setBankDetails({
          account_number: accountData.account_number || "",
          ifsc_code: accountData.ifsc_code || "",
          branch_name: accountData.branch_name || "",
        });
      } else if (accountData.account_type === "upi") {
        setAccountType("upi");
        setUpiId(accountData.upi_id || "");
      } else {
        setAccountType("none");
      }
    } else {
      setAccountType("none");
    }
  }, [accountData]);

  // --- Save Account Information ---
  const handleSave = async () => {
    if (!credentials) return;

    // Validate details based on account type
    if (accountType === "bank") {
      if (
        !bankDetails.account_number ||
        !bankDetails.ifsc_code ||
        !bankDetails.branch_name
      ) {
        Alert.alert("Incomplete Details", "Details are not filled to save");
        return;
      }
    }
    if (accountType === "upi") {
      if (!upiId.trim()) {
        Alert.alert("Incomplete Details", "Details are not filled to save");
        return;
      }
    }

    // Determine if we are creating or updating
    const isUpdate = !!accountData?.id;

    // Prepare payload
    const payload: any = {
      user_id: credentials.user_id,
      auth_key: credentials.auth_key,
      employee_id: employee?.id,
      account_type: accountType,
      status: "active", // or from user input if needed
    };

    // If it's bank
    if (accountType === "bank") {
      payload.account_number = bankDetails.account_number;
      payload.ifsc_code = bankDetails.ifsc_code;
      payload.branch_name = bankDetails.branch_name;
    }

    // If it's UPI
    if (accountType === "upi") {
      payload.upi_id = upiId;
    }

    // If updating, include the existing account id
    if (isUpdate) {
      payload.id = accountData.id;
    }

    console.log("Prepared account payload:", payload);

    try {
      if (isUpdate) {
        // Update existing account info
        const response = await updateAccount(payload).unwrap();
        navigation.goBack();
      } else {
        // Create new account info
        const response = await createAccount(payload).unwrap();
        navigation.goBack();
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
          <Text style={[styles.employeeName, { color: colors.title }]}>
            {accountData?.name || "Employee Name"}
          </Text>
          <Text style={styles.employeeId}>
            ID: {accountData?.id || "No ID"}
          </Text>
        </View>

        {/* Account Type Picker */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.title }]}>
            Select Account Type
          </Text>
          <View
            style={[styles.pickerContainer, { backgroundColor: colors.card }]}
          >
            <Picker
              style={styles.accountTypePicker}
              textColor={colors.text}
              selectedValue={accountType}
              onValueChange={(itemValue) => setAccountType(itemValue as any)}
            >
              <Picker.Item
                color={colors.title}
                label="-- Choose --"
                value="none"
              />
              <Picker.Item
                color={colors.title}
                label="Bank Information"
                value="bank"
              />
              <Picker.Item color={colors.title} label="UPI" value="upi" />
            </Picker>
          </View>
        </View>

        {/* Bank Details Section */}
        {accountType === "bank" && (
          <View style={[styles.section, { backgroundColor: colors.card }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Bank Details
            </Text>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.title }]}>
                Account Number
              </Text>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: colors.card, color: colors.title },
                ]}
                placeholder="Enter Account Number"
                placeholderTextColor={colors.title}
                keyboardType="numeric"
                value={bankDetails.account_number}
                onChangeText={(val) =>
                  setBankDetails((prev) => ({ ...prev, account_number: val }))
                }
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.title }]}>
                IFSC Code
              </Text>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: colors.card, color: colors.title },
                ]}
                placeholder="Enter IFSC Code"
                placeholderTextColor={colors.title}
                value={bankDetails.ifsc_code}
                onChangeText={(val) =>
                  setBankDetails((prev) => ({ ...prev, ifsc_code: val }))
                }
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.title }]}>
                Branch Name
              </Text>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: colors.card, color: colors.title },
                ]}
                placeholder="Enter Branch Name"
                placeholderTextColor={colors.title}
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
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              UPI Details
            </Text>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.title }]}>
                UPI ID
              </Text>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: colors.card, color: colors.title },
                ]}
                placeholder="Enter UPI ID"
                placeholderTextColor={colors.title}
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
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
    // color: "#333",
  },
  pickerContainer: {
    borderRadius: 8,
    overflow: "hidden",
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
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
  accountTypePicker: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});
