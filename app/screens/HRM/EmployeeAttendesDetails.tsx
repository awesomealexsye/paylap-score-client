import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";

// Bar chart component for working hours
const WorkingHoursChart = () => {
  // Sample data for the chart
  const days = ["S", "M", "T", "W", "T", "F", "S"];
  const hours = [3, 5, 7, 5, 6, 4, 5];
  const maxHours = 8; // Maximum hours for scaling

  return (
    <View style={styles.chartContainer}>
      {days.map((day, index) => (
        <View key={index} style={styles.chartColumn}>
          <View
            style={[
              styles.chartBar,
              {
                height: (hours[index] / maxHours) * 120,
                backgroundColor: index === 2 ? "#5C7CFA" : "#E8EEFF",
              },
            ]}
          />
          <Text style={styles.chartLabel}>{day}</Text>
        </View>
      ))}

      {/* Y-axis labels */}
      <View style={styles.yAxisLabels}>
        <Text style={styles.yAxisLabel}>8h</Text>
        <Text style={styles.yAxisLabel}>6h</Text>
        <Text style={styles.yAxisLabel}>3h</Text>
        <Text style={styles.yAxisLabel}>0h</Text>
      </View>
    </View>
  );
};

// Attendance stat card component
const AttendanceCard = ({ count, label, color }) => (
  <View style={[styles.attendanceCard, { borderColor: color }]}>
    <Text style={[styles.attendanceCount, { color }]}>{count}</Text>
    <Text style={styles.attendanceLabel}>{label}</Text>
  </View>
);

type EmployeeAttendanceDetailsProps = StackScreenProps<
  RootStackParamList,
  "EmployeeAttendanceDetails"
>;

export const EmployeeAttendanceDetails = ({
  navigation,
}: EmployeeAttendanceDetailsProps) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
            }}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Shaidul Islam Details</Text>
            <Text style={styles.profileRole}>Designer</Text>
          </View>
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {/* Working Hours Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Working Hours</Text>
            <View style={styles.dateContainer}>
              <Text style={styles.dateText}>Today</Text>
              <Ionicons
                name="calendar-outline"
                size={20}
                color="#666"
                style={styles.calendarIcon}
              />
            </View>
          </View>

          <Text style={styles.hoursValue}>6 h 30 m</Text>
          <Text style={styles.hoursLabel}>Today</Text>

          <WorkingHoursChart />
        </View>

        {/* Attendance Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Attendance</Text>
            <Text style={styles.dateText}>30 May 2021</Text>
          </View>

          <View style={styles.attendanceGrid}>
            <AttendanceCard count="13" label="Present" color="#5C7CFA" />
            <AttendanceCard count="0" label="Absent" color="#FF9800" />
            <AttendanceCard count="4" label="Holiday" color="#4CAF50" />
            <AttendanceCard count="6" label="Half Day" color="#FFC107" />
            <AttendanceCard count="4" label="Week Off" color="#9C27B0" />
            <AttendanceCard count="3" label="Leave" color="#03A9F4" />
          </View>
        </View>

        {/* Basic Pay Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Basic Pay</Text>
            <Text style={styles.dateText}>30 May 2021</Text>
          </View>

          <View style={styles.paymentDetails}>
            <View style={styles.paymentColumn}>
              <Text style={styles.paymentLabel}>Loan</Text>
              <Text style={styles.paymentValue}>$0.00</Text>
            </View>
            <View style={styles.paymentColumn}>
              <Text style={styles.paymentLabel}>Extra Bonus</Text>
              <Text style={styles.paymentValue}>$0.00</Text>
            </View>
            <View style={styles.paymentColumn}>
              <Text style={styles.paymentLabel}>Total</Text>
              <Text style={[styles.paymentValue, styles.totalValue]}>
                $10,000
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.deleteButton}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#5C7CFA",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "white",
  },
  profileInfo: {
    marginLeft: 15,
  },
  profileName: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  profileRole: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
  },
  content: {
    flex: 1,
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  section: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    color: "#888",
    fontSize: 14,
  },
  calendarIcon: {
    marginLeft: 5,
  },
  hoursValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  hoursLabel: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginBottom: 20,
  },
  chartContainer: {
    flexDirection: "row",
    height: 150,
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingBottom: 10,
    marginTop: 10,
    position: "relative",
  },
  chartColumn: {
    alignItems: "center",
    width: 30,
  },
  chartBar: {
    width: 20,
    borderRadius: 10,
    marginBottom: 8,
  },
  chartLabel: {
    color: "#888",
    fontSize: 14,
  },
  yAxisLabels: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: "space-between",
    paddingBottom: 25,
  },
  yAxisLabel: {
    color: "#888",
    fontSize: 12,
  },
  attendanceGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  attendanceCard: {
    width: "30%",
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "white",
  },
  attendanceCount: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  attendanceLabel: {
    fontSize: 12,
    color: "#666",
  },
  paymentDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  paymentColumn: {
    alignItems: "center",
    width: "33%",
  },
  paymentLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  paymentValue: {
    fontSize: 16,
    color: "#888",
  },
  totalValue: {
    color: "#333",
    fontWeight: "bold",
  },
  actionButtons: {
    flexDirection: "row",
    marginBottom: 30,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginRight: 8,
  },
  deleteButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
  editButton: {
    flex: 1,
    backgroundColor: "#5C7CFA",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginLeft: 8,
  },
  editButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default EmployeeAttendanceDetails;
