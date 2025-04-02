import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";

import Header from "../../layout/Header";
import { useTheme } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";

type EmployeeSuccessScreenProps = StackScreenProps<
  RootStackParamList,
  "EmployeeSuccessScreen"
>;

export const EmployeeSuccessScreen = ({
  navigation,
  route,
}: EmployeeSuccessScreenProps) => {
  const payload = route.params;
  console.log("payload:", payload);
  const theme = useTheme();
  const { colors }: { colors: any } = theme;

  return (
    <>
      <Header leftIcon="back" title="Employee Added Successfully " />
      <View style={styles.container}>
        {/* App Download Section */}
        {/* Login Details Section */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.title }]}>
            Employee details
          </Text>
          <Text style={[styles.loginText, { color: colors.title }]}>
            <Text style={[styles.bold, { color: colors.title }]}>Name:</Text>{" "}
            {payload.name}
          </Text>
          <Text style={[styles.loginText, { color: colors.title }]}>
            <Text style={[styles.bold, { color: colors.title }]}>
              Department:
            </Text>{" "}
            {payload?.department}
          </Text>
          <Text style={[styles.loginText, { color: colors.title }]}>
            <Text style={[styles.bold, { color: colors.title }]}>
              Designation:
            </Text>{" "}
            {payload?.designation}
          </Text>
        </View>

        {/* Share Button */}
        <TouchableOpacity
          style={styles.shareButton}
          onPress={() => {
            navigation.navigate("EmployeeListScreen");
          }}
        >
          <Text style={styles.shareButtonText}>
            Share Details With Employee
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default EmployeeSuccessScreen;

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },

  card: {
    borderRadius: 15,
    padding: 15,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: { fontSize: 16, fontWeight: "bold", color: "#333" },
  cardText: { fontSize: 14, color: "#555", marginTop: 5 },
  link: {
    fontSize: 14,
    color: "#478DFF",
    marginTop: 5,
    textDecorationLine: "underline",
  },
  loginText: { fontSize: 14, color: "#555", marginTop: 5 },
  bold: { fontWeight: "bold", color: "#333" },
  shareButton: {
    backgroundColor: "#478DFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  shareButtonText: { color: "white", fontSize: 16, fontWeight: "bold" },
});
