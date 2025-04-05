import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Header from "../../layout/Header";
import { useTheme } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import StorageService from "../../lib/StorageService";
import CONFIG from "../../constants/config";
import {
  useUpdateEmployeeMutation,
  useGetEmployeeDetailsQuery,
} from "../../redux/api/employee.api";
import { COLORS } from "../../constants/theme";
import DateTimePicker from "@react-native-community/datetimepicker"; // For date picker
import { Picker } from "@react-native-picker/picker"; // For status dropdown

type EditEmployeeProps = StackScreenProps<RootStackParamList, "EditEmployee">;

export const EditEmployee = ({ navigation, route }: EditEmployeeProps) => {
  const theme = useTheme();
  const { colors } = theme;

  // Assume employeeId is passed via route.params
  const employee = route.params;

  // RTK hook for updating employee details
  const [updateEmployee] = useUpdateEmployeeMutation();

  // State for showing/hiding DateTimePicker
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Combined state object for all employee fields
  const [formData, setFormData] = useState({
    joining_date: "",
    name: "",
    email: "",
    mobile: "",
    address: "",
    department: "",
    designation: "",
    status: "active", // default status set to active
  });

  // Credentials for user_id and auth_key
  const [credentials, setCredentials] = useState<{
    user_id: string | null;
    auth_key: string | null;
  } | null>(null);

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

  // Fetch employee details using employeeId and credentials
  const { data, isLoading, error } = useGetEmployeeDetailsQuery(
    {
      id: employee?.id,
      user_id: credentials?.user_id,
      auth_key: credentials?.auth_key,
    },
    { skip: !credentials || !employee?.id }
  );

  // When data is loaded, update formData with the fetched employee details
  useEffect(() => {
    if (data?.data) {
      const empData = data.data;
      setFormData({
        joining_date: empData.joining_date || "",
        name: empData.name || "",
        email: empData.email || "",
        mobile: empData.mobile || "",
        address: empData.address || "",
        department: empData.department || "",
        designation: empData.designation || "",
        status: empData.status || "active",
      });
    }
  }, [data]);

  // Handle date change from DateTimePicker
  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      // Format selected date as YYYY-MM-DD
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const day = String(selectedDate.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;

      setFormData({ ...formData, joining_date: formattedDate });
    }
  };

  // Basic email validation
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSave = async () => {
    if (!credentials || !employee?.id) return;

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
    if (!formData.status.trim()) {
      Alert.alert("Validation Error", "Status is mandatory");
      return;
    }
    // -------------------------------------------------------------

    const payload = {
      user_id: credentials.user_id,
      auth_key: credentials.auth_key,
      id: employee?.id,
      ...formData,
    };

    try {
      const result = await updateEmployee(payload).unwrap();
      console.log("Employee updated successfully:", result);
      navigation.navigate("EmployeeManagementScreen");
    } catch (err: any) {
      console.error("Error updating employee:", err);
      if (err.error && err.error.data && err.error.data.message) {
        console.error(
          "Validation errors:",
          JSON.stringify(err.error.data.message, null, 2)
        );
      }
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading employee details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={{ color: "red" }}>Error loading employee details.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Header leftIcon="back" title="Edit Employee" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.formContainer}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.profileContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {employee?.name ? employee.name[0] : "?"}
              </Text>
            </View>
            <Text style={styles.role}>{employee?.name}</Text>
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
                {/* Similar to AddEmployee: Replace text input with a touchable to open the date picker */}
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
                  style={styles.dateTimePicker}
                  value={
                    formData.joining_date
                      ? new Date(formData.joining_date)
                      : new Date()
                  }
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
                placeholder="Enter full name"
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
                placeholder="Enter email address"
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
                placeholder="Enter mobile number"
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
                placeholder="Enter address"
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
                placeholder="Enter department"
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
                placeholder="Enter designation"
                placeholderTextColor={colors.title}
                value={formData.designation}
                onChangeText={(text) =>
                  setFormData({ ...formData, designation: text })
                }
              />
            </View>

            {/* Status Dropdown */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.title }]}>
                Status
              </Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.status}
                  onValueChange={(itemValue) =>
                    setFormData({ ...formData, status: itemValue })
                  }
                  style={[
                    styles.input,
                    { backgroundColor: colors.card, color: colors.title },
                  ]}
                  dropdownIconColor={colors.title}
                >
                  <Picker.Item label="Active" value="active" />
                  <Picker.Item label="Inactive" value="inactive" />
                </Picker>
              </View>
            </View>

            <View style={{ padding: 20 }}>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Update</Text>
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
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 80,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
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
  dateTimePicker: {
    backgroundColor: "#fff",
    borderRadius: 8,
  },
});

export default EditEmployee;
