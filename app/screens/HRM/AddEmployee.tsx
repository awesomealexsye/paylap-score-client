import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
  KeyboardAvoidingView,
  Alert, // <-- Added for showing alerts
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Header from "../../layout/Header";
import { useTheme } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import StorageService from "../../lib/StorageService";
import CONFIG from "../../constants/config";
import { useCreateEmployeeMutation } from "../../redux/api/employee.api";
import { COLORS } from "../../constants/theme";
import DateTimePicker from "@react-native-community/datetimepicker"; // <-- Added for date picker

type AddEmployeeProps = StackScreenProps<RootStackParamList, "AddEmployee">;

export const AddEmployee = ({ navigation }: AddEmployeeProps) => {
  const theme = useTheme();
  const { colors }: { colors: any } = theme;

  const [createEmployee] = useCreateEmployeeMutation();

  // Combined state object for all employee fields
  const [formData, setFormData] = useState({
    joining_date: "1999-01-01",
    name: "",
    email: "",
    mobile: "",
    address: "",
    department: "",
    designation: "",
    status: "active", // default status
  });

  // For showing/hiding the DateTimePicker
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Credentials for user_id and auth_key
  const [credentials, setCredentials] = useState<{
    user_id: string | null;
    auth_key: string | null;
  } | null>(null);

  // Store company ID from local storage
  const [companyId, setCompanyId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch user credentials
      const userIdStr = await StorageService.getStorage(
        CONFIG.HARDCODE_VALUES.USER_ID
      );
      const auth_key = await StorageService.getStorage(
        CONFIG.HARDCODE_VALUES.AUTH_KEY
      );
      setCredentials({ user_id: userIdStr, auth_key });

      // Fetch company ID from storage
      const storedCompanyId = await StorageService.getStorage(
        CONFIG.HARDCODE_VALUES.HRM_SESSION.COMPANY_ID
      );
      console.log("storedCompanyId", storedCompanyId)
      setCompanyId(storedCompanyId);
    };
    fetchData();
  }, []);

  // Handle date change from DateTimePicker
  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      // Format selected date as YYYY-MM-DD (you can adjust as needed)
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const day = String(selectedDate.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;

      setFormData({ ...formData, joining_date: formattedDate });
    }
  };

  // Basic email validation regex
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSave = async () => {
    if (!credentials) return;

    // Check if we have a valid company ID
    if (!companyId) {
      Alert.alert(
        "Validation Error",
        "Company is not valid. Please select a company first."
      );
      return;
    }

    // ------------------- Client-side validations -------------------
    if (!formData.joining_date.trim()) {
      Alert.alert("Validation Error", "Joining Date is mandatory");
      return;
    }
    if (!formData.name.trim()) {
      Alert.alert("Validation Error", "Full Name is mandatory");
      return;
    }
    if (!formData.email.trim()) {
      Alert.alert("Validation Error", "Email Address is mandatory");
      return;
    }
    // Validate email
    if (!isValidEmail(formData.email.trim())) {
      Alert.alert("Validation Error", "Invalid email");
      return;
    }
    if (!formData.mobile.trim()) {
      Alert.alert("Validation Error", "Mobile Number is mandatory");
      return;
    }
    // Validate mobile number (must be exactly 10 digits)
    if (formData.mobile.trim().length !== 10) {
      Alert.alert(
        "Validation Error",
        "Invalid mobile number. Please enter a 10 digit mobile number."
      );
      return;
    }
    if (!formData.address.trim()) {
      Alert.alert("Validation Error", "Address is mandatory");
      return;
    }
    if (!formData.department.trim()) {
      Alert.alert("Validation Error", "Department is mandatory");
      return;
    }
    if (!formData.designation.trim()) {
      Alert.alert("Validation Error", "Designation is mandatory");
      return;
    }
    // -------------------------------------------------------------

    const payload = {
      user_id: credentials.user_id,
      auth_key: credentials.auth_key,
      company_id: companyId, // <-- We fetch from local storage
      ...formData,
    };

    try {
      const result = await createEmployee(payload).unwrap();
      // console.log("Employee created successfully:", result);
      navigation.navigate("EmployeeManagementScreen");
    } catch (err: any) {
      console.error("Error creating employee:", err);

      // ------------------- Handling backend error messages -------------------
      if (err.error && err.error.data && err.error.data.message) {
        const messages = err.error.data.message;
        let errorString = "";

        if (typeof messages === "object") {
          // If it's an object with fields like { name: ["error"], mobile: ["error"] }
          Object.keys(messages).forEach((key) => {
            if (Array.isArray(messages[key])) {
              messages[key].forEach((msg: string) => {
                errorString += msg + "\n";
              });
            } else {
              errorString += messages[key] + "\n";
            }
          });
        } else if (typeof messages === "string") {
          // If it's just a single string message
          errorString = messages;
        } else {
          // Fallback
          errorString = "An error occurred while creating the employee.";
        }

        Alert.alert("Error", errorString);
        console.error(
          "Validation errors:",
          JSON.stringify(err.error.data.message, null, 2)
        );
      } else {
        Alert.alert("Error", "An error occurred while creating the employee.");
      }
      // ----------------------------------------------------------------------
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Header leftIcon="back" title="Add Employee" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.formContainer}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.profileContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {formData?.name ? formData.name[0] : "E"}
              </Text>
            </View>
            <Text style={styles.role}>{formData?.name}</Text>
          </View>
          <View
            style={[
              styles.profileSection,
              { backgroundColor: colors.background },
            ]}
          >
            {/* Joining Date */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.title }]}>
                Joining Date
              </Text>
              <View style={styles.dateInputContainer}>
                <TouchableOpacity
                  style={[
                    styles.input,
                    {
                      color: colors.title,
                      backgroundColor: colors.card,
                      justifyContent: "center",
                    },
                  ]}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={{ color: colors.title }}>
                    {formData.joining_date}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.dateIcon}
                  onPress={() => setShowDatePicker(true)}
                >
                  <MaterialIcons name="date-range" size={20} color="#999" />
                </TouchableOpacity>
              </View>
              {/* Conditionally render the date picker */}
              {showDatePicker && (
                <DateTimePicker
                  value={new Date(formData.joining_date)}
                  mode="date"
                  display="default"
                  onChange={onChangeDate}
                />
              )}
            </View>
          </View>
          <View style={styles.formFields}>
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.title }]}>
                Full Name
              </Text>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: colors.card, color: colors.title },
                ]}
                placeholder="Enter Full name"
                placeholderTextColor={colors.title}
                value={formData.name}
                onChangeText={(text) =>
                  setFormData({ ...formData, name: text })
                }
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.title }]}>
                Email Address
              </Text>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: colors.card, color: colors.title },
                ]}
                value={formData.email}
                placeholder="Enter Email Address"
                placeholderTextColor={colors.title}
                onChangeText={(text) =>
                  setFormData({ ...formData, email: text })
                }
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.title }]}>
                Mobile Number
              </Text>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: colors.card, color: colors.title },
                ]}
                maxLength={10}
                placeholder="Enter Mobile number"
                placeholderTextColor={colors.title}
                value={formData.mobile}
                onChangeText={(text) =>
                  setFormData({ ...formData, mobile: text })
                }
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.title }]}>
                Address
              </Text>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: colors.card, color: colors.title },
                ]}
                placeholder="Enter Your Address"
                placeholderTextColor={colors.title}
                value={formData.address}
                onChangeText={(text) =>
                  setFormData({ ...formData, address: text })
                }
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.title }]}>
                Department
              </Text>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: colors.card, color: colors.title },
                ]}
                placeholder="Enter Department"
                placeholderTextColor={colors.title}
                value={formData.department}
                onChangeText={(text) =>
                  setFormData({ ...formData, department: text })
                }
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.title }]}>
                Designation
              </Text>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: colors.card, color: colors.title },
                ]}
                placeholder="Enter Desiganation"
                placeholderTextColor={colors.title}
                value={formData.designation}
                onChangeText={(text) =>
                  setFormData({ ...formData, designation: text })
                }
              />
            </View>

            <View style={{ padding: 20 }}>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 16,
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#5C7CFA",
  },
  cameraIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#5C7CFA",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  inputGroup: {
    marginBottom: 16,
    width: "100%",
  },
  inputLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#333",
  },
  dateInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  dateIcon: {
    position: "absolute",
    right: 12,
  },
  formFields: {
    paddingBottom: 24,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 80,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
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

export default AddEmployee;