import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  Alert,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import Header from "../../layout/Header";
import { useTheme } from "@react-navigation/native";

// Sample data with avatar URLs

// Status legend component

type FeatureNotAvailableProps = StackScreenProps<
  RootStackParamList,
  "EmployeeAttendendsList"
>;

export const FeatureNotAvailable = ({
  navigation,
}: FeatureNotAvailableProps) => {
  const theme = useTheme();
  const { colors }: { colors: any } = theme;

  const [selectedTab, setSelectedTab] = useState("Request");

  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color={colors.title} />
        </TouchableOpacity>
        <View style={styles.dropdownContainer}>
          <Text style={[styles.headerTitle, { color: colors.title, fontSize: 15 }]}>
            Time Attendance
          </Text>
        </View>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.messageText}>
          This feature is not available yet, we will notify you when it's done from development side.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    overflow: "visible", // allow dropdown to be visible
  },
  dropdownContainer: {
    flex: 1,
    marginLeft: 16,
    position: "relative",
    overflow: "visible", // allow dropdown list to overflow
    zIndex: 1000,
  },
  headerTitle: {
    fontSize: 12,
    fontWeight: "500",
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: 200,
    height: 100,
    marginBottom: 20,
  },
  messageText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
  },
});