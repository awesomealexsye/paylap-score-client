import { StackScreenProps } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Switch,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import Header from "../../layout/Header";
import {
  Feather,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import { useTheme } from "@react-navigation/native";
import StorageService from "../../lib/StorageService";
import CONFIG from "../../constants/config";
import { useGetEmployeesQuery } from "../../redux/api/employee.api";

type HrmHomeScreenProps = StackScreenProps<RootStackParamList, "HrmHomeScreen">;

export const HrmHomeScreen = ({ navigation }: HrmHomeScreenProps) => {
  const theme = useTheme();
  const { colors }: { colors: any } = theme;

  return (
    <View style={styles.container}>
      {/* Header */}

      <Header leftIcon="back" title="HRM & Payroll Management" />

      {/* Main Content */}
      <ScrollView style={styles.content}>
        {/* Grid Section */}
        <View
          style={[
            styles.gridContainer,
            { backgroundColor: colors.backgroundColor },
          ]}
        >
          {[
            {
              title: "Employee Management",
              icon: "users",
              color: "#6A5ACD",
              route: "EmployeeManagementScreen",
            },
            {
              title: "Expenses Management",
              icon: "wallet",
              color: "#FF5733",
            },
            {
              title: "Payroll Management",
              icon: "credit-card",
              color: "#1E90FF",
            },
            { title: "File Management", icon: "folder", color: "#28A745" },
          ].map((item, index) => (
            <TouchableOpacity
              onPress={() => navigation.navigate(item?.route)}
              key={index}
              style={[
                styles.card,
                { borderLeftColor: item.color, backgroundColor: colors.card },
              ]}
            >
              <View
                style={[styles.iconContainer, { backgroundColor: item.color }]}
              >
                <FontAwesome5 name={item.icon} size={24} color="white" />
              </View>
              <Text style={[styles.cardText, { color: colors.title }]}>
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* List Section */}
        {[
          { title: "Client Management", icon: "briefcase", color: "#1E90FF" },
          {
            title: "NOC/Ex Certificate",
            icon: "file-alt",
            color: "#FF8C00",
          },
          {
            title: "Notice Board",
            icon: "clipboard-list",
            color: "#32CD32",
            notification: true,
          },
          { title: "Award", icon: "trophy", color: "#8A2BE2" },
        ].map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.listItem, { backgroundColor: colors.card }]}
          >
            <View
              style={[
                styles.listIconContainer,
                { backgroundColor: item.color },
              ]}
            >
              <FontAwesome5 name={item.icon} size={20} color="white" />
            </View>
            <Text style={[styles.listText, { color: colors.title }]}>
              {item.title}
            </Text>
            {item.notification && <View style={styles.notificationDot} />}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },

  // Header Styles
  header: {
    backgroundColor: "#4A90E2",
    paddingVertical: 18,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerText: { fontSize: 18, fontWeight: "bold", color: "#FFFFFF" },

  highlight: { color: "#C3E0FF" },

  bellIconContainer: { position: "relative" },

  notificationBadge: {
    width: 8,
    height: 8,
    backgroundColor: "red",
    borderRadius: 4,
    position: "absolute",
    top: 0,
    right: 0,
  },

  // Content Section
  content: { padding: 15 },

  // Grid Section
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "#FFFFFF",
    width: "48%",
    padding: 10,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 15,
    elevation: 3,
    borderLeftWidth: 4, // Colored border
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  cardText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#444",
    marginTop: 10,
    textAlign: "center",
  },

  listItem: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 4, // Colored border
  },
  listIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  listText: {
    flex: 1,
    fontSize: 12,
    fontWeight: "500",
    color: "#333",
    marginLeft: 15,
  },
  notificationDot: {
    width: 8,
    height: 8,
    backgroundColor: "red",
    borderRadius: 4,
  },
});
