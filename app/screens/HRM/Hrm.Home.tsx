import { StackScreenProps } from "@react-navigation/stack";
import React, { useState } from "react";
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

type HrmHomeScreenProps = StackScreenProps<RootStackParamList, "HrmHomeScreen">;

export const HrmHomeScreen = ({ navigation }: HrmHomeScreenProps) => {
  return (
    <View style={styles.container}>
      {/* Header */}

      <Header leftIcon="back" title="HRM & Payroll Management" />

      {/* Main Content */}
      <ScrollView style={styles.content}>
        {/* Grid Section */}
        <View style={styles.gridContainer}>
          {[
            {
              title: "Employee Management",
              icon: "user-tie",
              color: "#6A5ACD",
              route: "EmployeeManagementScreen",
            },
            {
              title: "Expenses Management",
              icon: "cash-multiple",
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
              style={[styles.card, { borderLeftColor: item.color }]}
            >
              <View
                style={[styles.iconContainer, { backgroundColor: item.color }]}
              >
                <MaterialCommunityIcons
                  name={item.icon}
                  size={30}
                  color="white"
                />
              </View>
              <Text style={styles.cardText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* List Section */}
        {[
          { title: "Client Management", icon: "briefcase", color: "#1E90FF" },
          {
            title: "NOC/Ex Certificate",
            icon: "file-certificate",
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
          <TouchableOpacity key={index} style={styles.listItem}>
            <View
              style={[
                styles.listIconContainer,
                { backgroundColor: item.color },
              ]}
            >
              <FontAwesome5 name={item.icon} size={20} color="white" />
            </View>
            <Text style={styles.listText}>{item.title}</Text>
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
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4, // Colored border
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cardText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#444",
    marginTop: 10,
    textAlign: "center",
  },

  listItem: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  listIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  listText: {
    flex: 1,
    fontSize: 15,
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
