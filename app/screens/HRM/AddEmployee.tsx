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
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Header from "../../layout/Header";
import { useTheme } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import StorageService from "../../lib/StorageService";
import CONFIG from "../../constants/config";
import { useCreateEmployeeMutation } from "../../redux/api/employee.api";

type AddEmployeeProps = StackScreenProps<RootStackParamList, "AddEmployee">;

export const AddEmployee = ({ navigation }: AddEmployeeProps) => {
  const theme = useTheme();
  const { colors }: { colors: any } = theme;

  const [createEmployee] = useCreateEmployeeMutation();

  // Combined state object for all employee fields
  const [formData, setFormData] = useState({
    joining_date: "2025-01-01",
    name: "",
    email: "",
    mobile: "",
    address: "",
    department: "",
    designation: "",
    status: "active", // default status
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

  const handleSave = async () => {
    if (!credentials) return;

    // // Simple regex for a 10-digit number
    // const mobileRegex = /^\d{10}$/;
    // if (!mobileRegex.test(formData.mobile)) {
    //   console.error(
    //     "Invalid mobile number format. Please enter a 10-digit number."
    //   );
    //   return;
    // }

    const payload = {
      user_id: credentials.user_id,
      auth_key: credentials.auth_key,
      ...formData,
    };

    try {
      const result = await createEmployee(payload).unwrap();
      console.log("Employee created successfully:", result);
      navigation.navigate("EmployeeSuccessScreen", payload);
    } catch (err: any) {
      console.error("Error creating employee:", err);
      if (err.error && err.error.data && err.error.data.message) {
        console.error(
          "Validation errors:",
          JSON.stringify(err.error.data.message, null, 2)
        );
      }
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
          <View
            style={[
              styles.profileSection,
              { backgroundColor: colors.background },
            ]}
          >
            <View style={styles.profileImageContainer}>
              <Image
                // source={require('../../assets/profile.png')}
                style={styles.profileImage}
              />
              <View style={styles.cameraIconContainer}>
                <Ionicons name="camera" size={16} color={colors.title} />
              </View>
            </View>
            {/* Joining Date */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.title }]}>
                Joining Date
              </Text>
              <View style={styles.dateInputContainer}>
                <TextInput
                  style={[
                    styles.input,
                    { color: colors.title, backgroundColor: colors.card },
                  ]}
                  placeholder="Enter joining Date"
                  value={formData.joining_date}
                  placeholderTextColor={colors.title}
                  onChangeText={(text) =>
                    setFormData({ ...formData, joining_date: text })
                  }
                />
                <TouchableOpacity style={styles.dateIcon}>
                  <MaterialIcons name="date-range" size={20} color="#999" />
                </TouchableOpacity>
              </View>
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
    backgroundColor: "#5C7CFA",
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
});

export default AddEmployee;
