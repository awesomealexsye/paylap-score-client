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
import { COLORS } from "../../constants/theme";

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
              title: "Salary Management",
              icon: "credit-card",
              color: "#1E90FF",
              route: "GenerateEmployeeSalariesListScreen",
            },
          ].map((item, index) => (
            <TouchableOpacity
              onPress={() => navigation.navigate(item?.route)}
              key={index}
              style={[styles.card, { backgroundColor: COLORS.primary }]}
            >
              <View style={[styles.iconContainer]}>
                <FontAwesome5 name={item.icon} size={24} color="white" />
              </View>
              <Text style={[styles.cardText, { color: "white" }]}>
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {[
          {
            title: " Employee List",
            icon: "user-plus",
            color: "#6A5ACD",
            route: "EmployeeListScreen",
          },
          {
            title: "Time Attendance",
            icon: "calendar-check",
            color: "#FF5733",
            route: "EmployeeAttendendsList",
          },
          // {
          //   title: "Leave Management",
          //   icon: "calendar-minus",
          //   color: "#1E90FF",
          //   route: "EmployeeListScreen",
          // },

          {
            title: "Salary Statement",
            icon: "file-invoice-dollar",
            color: "#FF1493",
            route: "EmployeeAttendanceDetails",
          },
        ].map((item, index) => (
          <TouchableOpacity
            onPress={() => navigation.navigate(item?.route)}
            key={index}
            style={[
              styles.listItem,
              { borderColor: item.color, backgroundColor: colors.card },
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

  // List Items
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1, // Colored border
    position: "relative",
  },
  listIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  listText: { flex: 1, fontSize: 12, fontWeight: "500" },
});

export default EmployeeManagementScreen;
