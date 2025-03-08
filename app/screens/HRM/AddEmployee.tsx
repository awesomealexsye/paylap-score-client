import React, { useState } from "react";
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

type AddEmployeeProps = StackScreenProps<RootStackParamList, "AddEmployee">;

export const AddEmployee = ({ navigation }: AddEmployeeProps) => {
  const theme = useTheme();
  const { colors }: { colors: any } = theme;

  const [joiningDate, setJoiningDate] = useState("01/10/2020");
  const [employeeId, setEmployeeId] = useState("1254");
  const [fullName, setFullName] = useState("Vishal ");
  const [mobileNumber, setMobileNumber] = useState("+1245 2458 1554 224");
  const [designation, setDesignation] = useState("Developer");
  const [workingDay, setWorkingDay] = useState("Mon, Tue, Wed, Thu, San");
  const [basicPay, setBasicPay] = useState("$00.00");
  const [paymentType, setPaymentType] = useState("Per Day");
  const [gender, setGender] = useState("Male");
  const [reference, setReference] = useState("");

  return (
    <View style={{}}>
      <Header leftIcon="back" title="Add Employee " />
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
                  value={joiningDate}
                  placeholderTextColor={colors.title}
                  onChangeText={setJoiningDate}
                />
                <TouchableOpacity style={styles.dateIcon}>
                  <MaterialIcons name="date-range" size={20} color="#999" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.title }]}>
                Employee ID
              </Text>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: colors.card, color: colors.title },
                ]}
                value={employeeId}
                placeholderTextColor={colors.title}
                onChangeText={setEmployeeId}
              />
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
                value={fullName}
                onChangeText={setFullName}
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
                value={mobileNumber}
                onChangeText={setMobileNumber}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.title }]}>
                Designation
              </Text>
              <TouchableOpacity style={styles.dropdownInput}>
                <TextInput
                  style={[
                    styles.input,
                    { backgroundColor: colors.card, color: colors.title },
                  ]}
                  value={designation}
                  onChangeText={setDesignation}
                  editable={false}
                />
                <MaterialIcons
                  name="keyboard-arrow-down"
                  size={24}
                  color="#999"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.title }]}>
                Working Day
              </Text>
              <TouchableOpacity style={styles.dropdownInput}>
                <TextInput
                  style={[
                    styles.input,
                    { backgroundColor: colors.card, color: colors.title },
                  ]}
                  value={workingDay}
                  onChangeText={setWorkingDay}
                  editable={false}
                />
                <MaterialIcons
                  name="keyboard-arrow-down"
                  size={24}
                  color="#999"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.title }]}>
                Basic Pay
              </Text>
              <View style={styles.paymentContainer}>
                <TextInput
                  style={[
                    styles.input,
                    styles.payInput,
                    { backgroundColor: colors.card, color: colors.title },
                  ]}
                  value={basicPay}
                  onChangeText={setBasicPay}
                  keyboardType="numeric"
                />
                <View style={styles.paymentTypeContainer}>
                  <TouchableOpacity
                    style={[
                      styles.paymentTypeButton,
                      paymentType === "Per Day" && styles.activePaymentType,
                    ]}
                    onPress={() => setPaymentType("Per Day")}
                  >
                    <Text
                      style={[
                        styles.paymentTypeText,
                        paymentType === "Per Day" &&
                          styles.activePaymentTypeText,
                        { color: colors.title },
                      ]}
                    >
                      Per Day
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.paymentTypeButton,
                      paymentType === "Monthly" && styles.activePaymentType,
                    ]}
                    onPress={() => setPaymentType("Monthly")}
                  >
                    <Text
                      style={[
                        styles.paymentTypeText,
                        paymentType === "Monthly" &&
                          styles.activePaymentTypeText,
                        { color: colors.title },
                      ]}
                    >
                      Monthly
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.title }]}>
                Gender
              </Text>
              <TouchableOpacity style={styles.dropdownInput}>
                <TextInput
                  style={[
                    styles.input,
                    { backgroundColor: colors.card, color: colors.title },
                  ]}
                  value={gender}
                  onChangeText={setGender}
                  editable={false}
                />
                <MaterialIcons
                  name="keyboard-arrow-down"
                  size={24}
                  color="#999"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.title }]}>
                Add Reference
              </Text>
              <TouchableOpacity style={styles.referenceInput}>
                <TextInput
                  style={[
                    styles.input,
                    { backgroundColor: colors.card, color: colors.title },
                  ]}
                  value={reference}
                  onChangeText={setReference}
                  placeholder="Enter Reference Name"
                  placeholderTextColor="#999"
                />
                <View style={styles.addIconContainer}>
                  <Ionicons name="add" size={24} color="#999" />
                </View>
              </TouchableOpacity>
            </View>

            <View style={{ padding: 20 }}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={() => navigation.navigate("EmployeeSuccessScreen")}
              >
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
  dropdownInput: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  formFields: {
    paddingBottom: 24,
  },
  paymentContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  payInput: {
    flex: 1,
    marginRight: 8,
  },
  paymentTypeContainer: {
    flexDirection: "row",
  },
  paymentTypeButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    marginLeft: 8,
  },
  activePaymentType: {
    backgroundColor: "#5C7CFA",
    borderColor: "#5C7CFA",
  },
  paymentTypeText: {
    color: "#666",
    fontSize: 14,
  },
  activePaymentTypeText: {
    color: "white",
  },
  referenceInput: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  addIconContainer: {
    position: "absolute",
    right: 12,
  },
  saveButton: {
    backgroundColor: "#5C7CFA",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    bottom: 24,
    marginBottom: 80,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default AddEmployee;
