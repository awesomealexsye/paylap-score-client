import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Image,
  Animated,
  Dimensions,
} from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Header from "../../layout/Header";
import { useTheme } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import StorageService from "../../lib/StorageService";
import CONFIG from "../../constants/config";
import { useCreateEmployeeMutation } from "../../redux/api/employee.api";
import { useCreateCompanyMutation } from "../../redux/api/company.api";
import { COLORS } from "../../constants/theme";

const { width } = Dimensions.get("window");
const inputWidth = width - 40;

type HRMAddCompanyProps = StackScreenProps<RootStackParamList, "HRMAddCompany">;

export const HRMAddCompany = ({ navigation }: HRMAddCompanyProps) => {
  const theme = useTheme();
  const { colors }: { colors: any } = theme;

  const [createCompany] = useCreateCompanyMutation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    website: "",
    gst: "",
    company_address: "",
    city: "",
    district: "",
    state: "",
    zipcode: "",
  });

  const handleInputChange = (fieldName: string, value: string) => {
    setFormData({ ...formData, [fieldName]: value });
  };

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

  const handleSubmit = async () => {
    if (!credentials) return;

    const payload = {
      user_id: credentials.user_id,
      auth_key: credentials.auth_key,
      ...formData,
    };

    try {
      const result = await createCompany(payload).unwrap();
      console.log("Employee created successfully:", result);
      navigation.navigate("EmployeeManagementScreen", payload);
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
    <>
      <Header leftIcon="back" title="Add Company" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Basic Information Section */}
        <View style={styles.profileContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {formData.name ? formData.name[0] : "C"}
            </Text>
          </View>
          <Text style={styles.role}>{formData?.name}</Text>
        </View>
        <Text style={[styles.sectionTitle, { color: colors.title }]}>
          Basic Information
        </Text>

        <View style={styles.card}>
          {/* Company Name */}
          <View style={styles.inputContainer}>
            <MaterialIcons
              name="business"
              size={20}
              color={colors.title}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Company Name"
              placeholderTextColor={colors.title}
              value={formData.name}
              onChangeText={(text) => handleInputChange("name", text)}
            />
          </View>

          {/* Email */}
          <View style={styles.inputContainer}>
            <MaterialIcons
              name="email"
              size={20}
              color={colors.title}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor={colors.title}
              keyboardType="email-address"
              value={formData.email}
              onChangeText={(text) => handleInputChange("email", text)}
            />
          </View>

          {/* Phone Number */}
          <View style={styles.inputContainer}>
            <MaterialIcons
              name="phone"
              size={20}
              color={colors.title}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              placeholderTextColor={colors.title}
              keyboardType="phone-pad"
              value={formData.phone}
              onChangeText={(text) => handleInputChange("phone", text)}
            />
          </View>

          {/* Website URL */}
          <View style={styles.inputContainer}>
            <MaterialIcons
              name="public"
              size={20}
              color={colors.title}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Website URL"
              placeholderTextColor={colors.title}
              keyboardType="url"
              value={formData.website}
              onChangeText={(text) => handleInputChange("website", text)}
            />
          </View>

          {/* GST Number */}
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name="file-document-outline"
              size={20}
              color={colors.title}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="GST Number"
              placeholderTextColor={colors.title}
              value={formData.gst}
              onChangeText={(text) => handleInputChange("gst", text)}
            />
          </View>
        </View>

        {/* Location Details Section */}
        <Text style={[styles.sectionTitle, { color: colors.title }]}>
          Location Details
        </Text>
        <View style={styles.card}>
          {/* Company Address */}
          <View style={styles.inputContainer}>
            <MaterialIcons
              name="location-on"
              size={20}
              color={colors.title}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Company Address"
              placeholderTextColor={colors.title}
              multiline
              value={formData.company_address}
              onChangeText={(text) =>
                handleInputChange("company_address", text)
              }
            />
          </View>

          {/* City & District Row */}
          <View style={styles.row}>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <MaterialCommunityIcons
                name="office-building"
                size={20}
                color={colors.title}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="City"
                placeholderTextColor={colors.title}
                value={formData.city}
                onChangeText={(text) => handleInputChange("city", text)}
              />
            </View>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <MaterialIcons
                name="map"
                size={20}
                color={colors.title}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="District"
                placeholderTextColor={colors.title}
                value={formData.district}
                onChangeText={(text) => handleInputChange("district", text)}
              />
            </View>
          </View>

          {/* State & Pin Code Row */}
          <View style={styles.row}>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <MaterialIcons
                name="navigation"
                size={20}
                color={colors.title}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="State"
                placeholderTextColor={colors.title}
                value={formData.state}
                onChangeText={(text) => handleInputChange("state", text)}
              />
            </View>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <MaterialCommunityIcons
                name="dialpad"
                size={20}
                color={colors.title}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Pin code"
                placeholderTextColor={colors.title}
                keyboardType="numeric"
                value={formData.zipcode}
                onChangeText={(text) => handleInputChange("zipcode", text)}
              />
            </View>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: COLORS.primary }]}
          onPress={handleSubmit}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Create Company</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
};

// Example styling for a design similar to your screenshot
const styles = StyleSheet.create({
  container: {
    flex: 1,

    paddingTop: 40, // or use SafeAreaView for iOS
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
  headerTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1E293B",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  card: {
    // backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 16,
    marginHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: "#F1F5F9",
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  inputIcon: {
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#1E293B",
    paddingVertical: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfWidth: {
    width: "48%",
  },
  button: {
    marginHorizontal: 20,
    marginTop: 8,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: "#0EA5E9",
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#0EA5E9",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default HRMAddCompany;
