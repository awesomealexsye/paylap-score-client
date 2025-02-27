import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import {
  FontAwesome5,
  MaterialCommunityIcons,
  Feather,
} from "@expo/vector-icons";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import Header from "../../layout/Header";

type EmployeeManagementScreenProps = StackScreenProps<
  RootStackParamList,
  "EmployeeManagementScreen"
>;

export const EmployeeManagementScreen = ({
  navigation,
}: EmployeeManagementScreenProps) => {
  return (
    <View style={styles.container}>
      {/* Header */}

      <Header leftIcon="back" title="Employee Management " />

      {/* List Section */}
      <ScrollView style={styles.content}>
        {[
          {
            title: "Add Employee",
            icon: "user-plus",
            color: "#6A5ACD",
            route: "EmployeeListScreen",
          },
          {
            title: "Time Attendance",
            icon: "calendar-check",
            color: "#FF5733",
            route: "AddEmployeeScreen",
          },
          {
            title: "Leave Management",
            icon: "calendar-remove",
            color: "#1E90FF",
          },
          {
            title: "Employees Overtime",
            icon: "clock-outline",
            color: "#FFD700",
          },
          {
            title: "Salary Statement",
            icon: "file-invoice-dollar",
            color: "#FF1493",
          },
          { title: "Reference", icon: "users", color: "#28A745" },
        ].map((item, index) => (
          <TouchableOpacity
            onPress={() => navigation.navigate(item?.route)}
            key={index}
            style={styles.listItem}
          >
            {/* Left Colored Border */}
            <View
              style={[styles.leftBorder, { backgroundColor: item.color }]}
            />

            {/* Icon Container */}
            <View
              style={[
                styles.listIconContainer,
                { backgroundColor: item.color },
              ]}
            >
              <FontAwesome5 name={item.icon} size={18} color="white" />
            </View>

            {/* Text */}
            <Text style={styles.listText}>{item.title}</Text>

            {/* Arrow */}
            <Feather name="chevron-right" size={22} color="#999" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },

  // Header
  header: {
    backgroundColor: "#4A90E2",
    paddingVertical: 18,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  backButton: { padding: 8, marginRight: 10 },
  headerText: { fontSize: 18, fontWeight: "bold", color: "#FFFFFF" },

  // Content
  content: { padding: 15 },

  // List Items
  listItem: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    position: "relative",
  },
  leftBorder: {
    width: 4,
    height: "100%",
    borderRadius: 10,
    position: "absolute",
  },
  listIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  listText: { flex: 1, fontSize: 15, fontWeight: "500", color: "#333" },
});

export default EmployeeManagementScreen;
