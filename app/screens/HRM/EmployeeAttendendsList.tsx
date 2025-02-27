import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
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
const employees = [
  {
    id: "1",
    name: "Arbaz",
    role: "Designer",
    status: "P",
    time: "09:00 AM - 05:00 PM",
    approved: true,
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
  },
  {
    id: "2",
    name: "Ajay",
    role: "Designer",
    status: "A",
    time: "09:00 AM - 05:00 PM",
    approved: true,
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
  },
  {
    id: "3",
    name: "Neeraj",
    role: "Designer",
    status: "H/D",
    time: "09:00 AM - 05:30 PM",
    approved: false,
    avatar:
      "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
  },
  {
    id: "4",
    name: "Vishal",
    role: "Designer",
    status: "H",
    time: "09:00 AM - 05:00 PM",
    approved: false,
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
  },
  {
    id: "5",
    name: "Nitin",
    role: "Developer",
    status: "P",
    time: "08:30 AM - 04:30 PM",
    approved: true,
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
  },
  {
    id: "6",
    name: "Luffy",
    role: "Product Manager",
    status: "A",
    time: "09:00 AM - 05:00 PM",
    approved: false,
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
  },
];

// Status legend component
const StatusLegend = () => (
  <View style={styles.legendContainer}>
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: "#4CAF50" }]} />
      <Text style={styles.legendText}>Present</Text>
    </View>
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: "#FF9800" }]} />
      <Text style={styles.legendText}>Absent</Text>
    </View>
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: "#FFC107" }]} />
      <Text style={styles.legendText}>Half Day</Text>
    </View>
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: "#2196F3" }]} />
      <Text style={styles.legendText}>Holiday</Text>
    </View>
  </View>
);

// Employee card component
const EmployeeCard = ({ employee, onApprove, onReject, showActions }) => {
  const getStatusLabel = (status) => {
    switch (status) {
      case "P":
        return "Present";
      case "A":
        return "Absent";
      case "H/D":
        return "Half Day";
      case "H":
        return "Holiday";
      default:
        return status;
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.employeeInfo}>
          <Image source={{ uri: employee.avatar }} style={styles.avatar} />
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{employee.name}</Text>
            <Text style={styles.role}>{employee.role}</Text>
          </View>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(employee.status) },
          ]}
        >
          <Text style={styles.statusText}>
            {getStatusLabel(employee.status)}
          </Text>
        </View>
      </View>

      <View style={styles.timeContainer}>
        <Ionicons name="time-outline" size={16} color="#666" />
        <Text style={styles.time}>{employee.time}</Text>
      </View>

      {showActions && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.approveButton}
            onPress={() => onApprove(employee)}
          >
            <Ionicons name="checkmark-circle" size={16} color="#fff" />
            <Text style={styles.buttonText}>Approve</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.rejectButton}
            onPress={() => onReject(employee)}
          >
            <Ionicons name="close-circle" size={16} color="#fff" />
            <Text style={styles.buttonText}>Reject</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

type EmployeeAttendendsListProps = StackScreenProps<
  RootStackParamList,
  "EmployeeAttendendsList"
>;

export const EmployeeAttendendsList = ({
  navigation,
}: EmployeeAttendendsListProps) => {
  const [selectedTab, setSelectedTab] = useState("Request");
  const [employeeData, setEmployeeData] = useState(employees);

  const handleApprove = (employee: any) => {
    Alert.alert(
      "Approve Attendance",
      `Are you sure you want to approve ${employee.name}'s attendance?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Approve",
          onPress: () => {
            const updatedEmployees = employeeData.map((emp) =>
              emp.id === employee.id ? { ...emp, approved: true } : emp
            );
            setEmployeeData(updatedEmployees);
          },
        },
      ]
    );
  };

  const handleReject = (employee: any) => {
    Alert.alert(
      "Reject Attendance",
      `Are you sure you want to reject ${employee.name}'s attendance?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reject",
          onPress: () => {
            // In a real app, you might want to remove the employee from the list
            // or mark them as rejected instead of just changing approved status
            const updatedEmployees = employeeData.map((emp) =>
              emp.id === employee.id ? { ...emp, approved: false } : emp
            );
            setEmployeeData(updatedEmployees);
          },
        },
      ]
    );
  };

  const filteredEmployees = employeeData.filter((emp) =>
    selectedTab === "Approve" ? emp.approved : !emp.approved
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4A6EF5" />
      {/* Header */}

      <Header leftIcon="back" title="Employee Attend List " />

      {/* Date display */}
      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Text>
      </View>

      {/* Status legend */}
      <StatusLegend />

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "Request" && styles.activeTab]}
          onPress={() => {
            setSelectedTab("Request");
            navigation.navigate("EmployeeAttendanceDetails");
          }}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "Request" && styles.activeTabText,
            ]}
          >
            Request
          </Text>
          {selectedTab === "Request" && <View style={styles.activeIndicator} />}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "Approve" && styles.activeTab]}
          onPress={() => setSelectedTab("Approve")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "Approve" && styles.activeTabText,
            ]}
          >
            Approve
          </Text>
          {selectedTab === "Approve" && <View style={styles.activeIndicator} />}
        </TouchableOpacity>
      </View>

      {/* Employee List */}
      {filteredEmployees.length > 0 ? (
        <FlatList
          data={filteredEmployees}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <EmployeeCard
              employee={item}
              onApprove={handleApprove}
              onReject={handleReject}
              showActions={selectedTab === "Request"}
            />
          )}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="event-busy" size={64} color="#ccc" />
          <Text style={styles.emptyText}>
            No {selectedTab.toLowerCase()} records found
          </Text>
        </View>
      )}
    </View>
  );
};

const getStatusColor = (status: any) => {
  switch (status) {
    case "P":
      return "#4CAF50"; // Green for Present
    case "A":
      return "#FF9800"; // Orange for Absent
    case "H/D":
      return "#FFC107"; // Yellow for Half Day
    case "H":
      return "#2196F3"; // Blue for Holiday
    default:
      return "#E0E0E0"; // Grey for unknown
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FD",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#4A6EF5",
    padding: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  dateContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  dateText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  legendContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#fff",
    marginBottom: 8,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
    marginBottom: 4,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 4,
  },
  legendText: {
    fontSize: 12,
    color: "#666",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  tab: {
    flex: 1,
    padding: 16,
    alignItems: "center",
    position: "relative",
  },
  activeTab: {
    backgroundColor: "#fff",
  },
  activeIndicator: {
    position: "absolute",
    bottom: 0,
    height: 3,
    width: "50%",
    backgroundColor: "#4A6EF5",
    borderRadius: 1.5,
  },
  tabText: {
    color: "#777",
    fontSize: 16,
    fontWeight: "500",
  },
  activeTabText: {
    color: "#4A6EF5",
    fontWeight: "bold",
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  employeeInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  nameContainer: {
    justifyContent: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  role: {
    color: "#777",
    fontSize: 14,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    minWidth: 80,
    alignItems: "center",
  },
  statusText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  time: {
    color: "#666",
    marginLeft: 6,
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: "row",
    marginTop: 8,
    justifyContent: "space-between",
  },
  approveButton: {
    flex: 1,
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 8,
    flexDirection: "row",
    justifyContent: "center",
  },
  rejectButton: {
    flex: 1,
    backgroundColor: "#F44336",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginLeft: 8,
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 6,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: "#999",
    textAlign: "center",
  },
});
