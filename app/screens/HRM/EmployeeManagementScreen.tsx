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
import { useTheme } from "@react-navigation/native";

type EmployeeManagementScreenProps = StackScreenProps<
  RootStackParamList,
  "EmployeeManagementScreen"
>;

export const EmployeeManagementScreen = ({
  navigation,
}: EmployeeManagementScreenProps) => {
  const theme = useTheme();
  const { colors }: { colors: any } = theme;

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
            icon: "calendar-minus",
            color: "#1E90FF",
          },
          {
            title: "Employees Overtime",
            icon: "business-time",
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
            style={[
              styles.listItem,
              { borderLeftColor: item.color, backgroundColor: colors.card },
            ]}
          >
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
            <Text style={[styles.listText, { color: colors.title }]}>
              {item.title}
            </Text>

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

  // Content
  content: { padding: 15 },

  // List Items
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 12,
    marginBottom: 10,
    borderLeftWidth: 4, // Colored border
    position: "relative",
  },
  listIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  listText: { flex: 1, fontSize: 12, fontWeight: "500" },
});

export default EmployeeManagementScreen;
