import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
  KeyboardAvoidingView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import Header from "../../layout/Header";

const MEMBERSHIP_TYPES = [
  { label: "Basic", value: "Basic", price: "$29.99/month" },
  { label: "Premium", value: "Premium", price: "$49.99/month" },
  { label: "Elite", value: "Elite", price: "$79.99/month" },
];

type AddMemberProps = StackScreenProps<RootStackParamList, "AddMember">;

export const AddMember = ({ navigation }: AddMemberProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    membershipType: "Basic",
    startDate: new Date(),
    emergencyContact: "",
    emergencyPhone: "",
    photoUrl: null,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone.replace(/\s+/g, ""))) {
      newErrors.phone = "Invalid phone number";
    }
    if (
      formData.emergencyPhone &&
      !/^\+?[\d\s-]{10,}$/.test(formData.emergencyPhone.replace(/\s+/g, ""))
    ) {
      newErrors.emergencyPhone = "Invalid emergency contact number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Please grant permission to access your photos."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setFormData((prev) => ({ ...prev, photoUrl: result.assets[0].uri }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      Alert.alert("Success", "Member added successfully!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to add member. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputFields = [
    {
      key: "name",
      label: "Full Name *",
      placeholder: "Enter full name",
      keyboardType: "default",
    },
    {
      key: "email",
      label: "Email *",
      placeholder: "Enter email address",
      keyboardType: "email-address",
      autoCapitalize: "none",
    },
    {
      key: "phone",
      label: "Phone Number *",
      placeholder: "Enter phone number",
      keyboardType: "phone-pad",
    },
  ];

  return (
    <>
      <Header title={"Add Member"} leftIcon="back" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Photo */}
          <View style={styles.photoSection}>
            <TouchableOpacity
              onPress={pickImage}
              style={styles.photoContainer}
              activeOpacity={0.8}
            >
              {formData.photoUrl ? (
                <Image
                  source={{ uri: formData.photoUrl }}
                  style={styles.photo}
                />
              ) : (
                <View style={styles.photoPlaceholder}>
                  <FontAwesome name="user" size={40} color="#94A3B8" />
                </View>
              )}
              <View style={styles.cameraButton}>
                <Feather name="camera" size={16} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
            <Text style={styles.photoText}>Add Profile Photo</Text>
          </View>

          {/* Inputs */}
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            {inputFields.map(
              ({ key, label, placeholder, keyboardType, autoCapitalize }) => (
                <View key={key} style={styles.inputGroup}>
                  <Text style={styles.label}>{label}</Text>
                  <TextInput
                    style={[styles.input, errors[key] && styles.inputError]}
                    value={formData[key]}
                    onChangeText={(text) => handleInputChange(key, text)}
                    placeholder={placeholder}
                    keyboardType={keyboardType}
                    autoCapitalize={autoCapitalize || "sentences"}
                    placeholderTextColor="#94A3B8"
                  />
                  {errors[key] && (
                    <Text style={styles.errorText}>{errors[key]}</Text>
                  )}
                </View>
              )
            )}

            {/* Address */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Address</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.address}
                onChangeText={(text) => handleInputChange("address", text)}
                placeholder="Enter address"
                multiline
                numberOfLines={3}
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>

          {/* Membership */}
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Membership Type</Text>
            <View style={styles.membershipCards}>
              {MEMBERSHIP_TYPES.map((type) => (
                <TouchableOpacity
                  key={type.value}
                  style={[
                    styles.membershipCard,
                    formData.membershipType === type.value &&
                      styles.selectedMembershipCard,
                  ]}
                  onPress={() =>
                    handleInputChange("membershipType", type.value)
                  }
                >
                  <Text
                    style={[
                      styles.membershipTitle,
                      formData.membershipType === type.value &&
                        styles.selectedMembershipTitle,
                    ]}
                  >
                    {type.label}
                  </Text>
                  <Text
                    style={[
                      styles.membershipPrice,
                      formData.membershipType === type.value &&
                        styles.selectedMembershipPrice,
                    ]}
                  >
                    {type.price}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Emergency */}
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Emergency Contact</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Contact Name</Text>
              <TextInput
                style={styles.input}
                value={formData.emergencyContact}
                onChangeText={(text) =>
                  handleInputChange("emergencyContact", text)
                }
                placeholder="Enter emergency contact name"
                placeholderTextColor="#94A3B8"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Contact Phone</Text>
              <TextInput
                style={[
                  styles.input,
                  errors.emergencyPhone && styles.inputError,
                ]}
                value={formData.emergencyPhone}
                onChangeText={(text) =>
                  handleInputChange("emergencyPhone", text)
                }
                placeholder="Enter emergency contact phone"
                keyboardType="phone-pad"
                placeholderTextColor="#94A3B8"
              />
              {errors.emergencyPhone && (
                <Text style={styles.errorText}>{errors.emergencyPhone}</Text>
              )}
            </View>
          </View>

          {/* Submit */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              isSubmitting && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitButtonText}>Add Member</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 100 },
  photoSection: { alignItems: "center", marginVertical: 24 },
  photoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 4,
  },
  photo: { width: 100, height: 100, borderRadius: 50 },
  photoPlaceholder: { justifyContent: "center", alignItems: "center" },
  cameraButton: {
    position: "absolute",
    bottom: 4,
    right: 4,
    backgroundColor: "#5E17EB",
    borderRadius: 12,
    padding: 4,
  },
  photoText: { marginTop: 8, fontSize: 14, color: "#475569" },
  formSection: { marginVertical: 16 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 10,
  },
  inputGroup: { marginBottom: 12 },
  label: { fontSize: 14, color: "#334155", marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: "#FFFFFF",
  },
  inputError: { borderColor: "#DC2626" },
  textArea: { minHeight: 80, textAlignVertical: "top" },
  errorText: { fontSize: 12, color: "#DC2626", marginTop: 4 },
  membershipCards: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  membershipCard: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    width: "30%",
    backgroundColor: "#F1F5F9",
  },
  selectedMembershipCard: {
    borderColor: "#5E17EB",
    backgroundColor: "#EDE9FE",
  },
  membershipTitle: { fontWeight: "600", color: "#334155", textAlign: "center" },
  selectedMembershipTitle: { color: "#5E17EB" },
  membershipPrice: {
    fontSize: 12,
    color: "#64748B",
    textAlign: "center",
    marginTop: 4,
  },
  selectedMembershipPrice: { color: "#5E17EB" },
  submitButton: {
    backgroundColor: "#5E17EB",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 24,
  },
  submitButtonDisabled: { opacity: 0.6 },
  submitButtonText: { color: "#FFFFFF", fontWeight: "600", fontSize: 16 },
});
