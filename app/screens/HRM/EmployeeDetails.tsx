import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";

import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import Header from "../../layout/Header";
import { useTheme } from "@react-navigation/native";

type EmployeeDetailScreenProps = StackScreenProps<
  RootStackParamList,
  "EmployeeDetailScreen"
>;

export const EmployeeDetailScreen = ({
  navigation,
}: EmployeeDetailScreenProps) => {
  const theme = useTheme();
  const { colors }: { colors: any } = theme;
  return (
    <>
      <Header leftIcon="back" title=" Employee Details" />
      <View style={styles.container}>
        {/* Employee Info */}
        <View style={styles.profileContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>S</Text>
          </View>
          <Text style={styles.role}>Designer</Text>
        </View>

        {/* Salary & Employee ID */}
        <View style={styles.row}>
          <View style={[styles.box, { backgroundColor: colors.card }]}>
            <Text style={[styles.label, { color: colors.title }]}>Per Day</Text>
            <Text style={[styles.value, { color: colors.title }]}>$570.00</Text>
          </View>
          <View style={[styles.box, { backgroundColor: colors.card }]}>
            <Text style={[styles.label, { color: colors.title }]}>
              Employee ID
            </Text>
            <Text style={[styles.value, , { color: colors.title }]}>1234</Text>
          </View>
        </View>

        {/* Joining Date, Reference & Contact */}
        <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Joining Date</Text>
            <Text style={styles.label}>Reference</Text>
            <Text style={styles.label}>Contact No</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.value, { color: colors.title }]}>
              10-06-2021
            </Text>
            <Text style={[styles.value, { color: colors.title }]}>
              Ibne Riead
            </Text>
            <Text style={[styles.value, { color: colors.title }]}>
              +1254 2415 156
            </Text>
          </View>
        </View>

        {/* Working Days */}
        <View style={[styles.workingCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.label, { color: colors.title }]}>
            Working day
          </Text>
          <Text style={[styles.value, { color: colors.title }]}>
            Mon, Tue, Wed, Thu, San
          </Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.deleteButton}>
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("EmployeeAttendendsList");
            }}
            style={styles.editButton}
          >
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default EmployeeDetailScreen;

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 15 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#478DFF",
    padding: 15,
    paddingTop: 40,
  },
  headerTitle: { fontSize: 18, color: "white", fontWeight: "bold" },
  profileContainer: { alignItems: "center", marginVertical: 15 },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#F4B183",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { fontSize: 24, color: "white", fontWeight: "bold" },
  role: { fontSize: 14, color: "#888", marginTop: 5 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  box: {
    flex: 1,
    backgroundColor: "white",
    padding: 15,
    margin: 5,
    borderRadius: 12,
    alignItems: "center",
  },
  label: { fontSize: 14, color: "#777", fontWeight: "bold" },
  value: { fontSize: 12, fontWeight: "bold", color: "#333", marginTop: 5 },
  infoCard: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 12,
    marginVertical: 10,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  workingCard: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "#478DFF",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 5,
  },
  deleteText: { color: "white", fontWeight: "bold", fontSize: 16 },
  editButton: {
    flex: 1,
    backgroundColor: "#E5E7EB",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 5,
  },
  editText: { color: "#333", fontWeight: "bold", fontSize: 16 },
});
