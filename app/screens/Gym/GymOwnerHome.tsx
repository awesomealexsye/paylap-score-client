import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import {
  FontAwesome,
  MaterialCommunityIcons,
  Ionicons,
} from "@expo/vector-icons";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import Header from "../../layout/Header";

type GymOwnerHomeProps = StackScreenProps<RootStackParamList, "GymOwnerHome">;

export const GymOwnerHome = ({ navigation }: GymOwnerHomeProps) => {
  return (
    <>
      <Header title={"Gym Dashboard"} leftIcon="back" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Welcome, Gym Owner 💪</Text>

        {/* Summary Cards */}
        <View style={styles.statsRow}>
          <TouchableOpacity
            style={styles.statCard}
            onPress={() => {
              navigation.navigate("GymMembers");
            }}
          >
            <Text style={styles.statNumber}>120</Text>
            <Text style={styles.statLabel}>Members</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.statCard}
            onPress={() => {
              navigation.navigate("GymRevenue");
            }}
          >
            <Text style={styles.statNumber}>₹85K</Text>
            <Text style={styles.statLabel}>Revenue</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.statsRow}>
          <TouchableOpacity
            style={styles.statCard}
            onPress={() => {
              navigation.navigate("GymTrainers");
            }}
          >
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>Trainers</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.statCard}
            onPress={() => {
              navigation.navigate("ActivePlans");
            }}
          >
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Active Plans</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("AddMember")}
          >
            <FontAwesome name="user-plus" size={28} color="#007AFF" />
            <Text style={styles.actionLabel}>Add Member</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("DailyAttendance")}
          >
            <MaterialCommunityIcons
              name="calendar-check"
              size={28}
              color="#FF9500"
            />
            <Text style={styles.actionLabel}>Daily Attendance</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            //onPress={() => navigation.navigate("Plans")}
          >
            <Ionicons name="barbell" size={28} color="#34C759" />
            <Text style={styles.actionLabel}>Manage Plans</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: "#f2f2f2",
  },
  header: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 20,
    color: "#333",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginRight: 10,
    alignItems: "center",
    elevation: 2,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111",
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 24,
    marginBottom: 10,
    color: "#444",
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 10,
    flexWrap: "wrap",
  },
  actionButton: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 18,
    alignItems: "center",
    width: "30%",
    elevation: 2,
  },
  actionLabel: {
    fontSize: 13,
    marginTop: 6,
    textAlign: "center",
    color: "#333",
  },
});

export default GymOwnerHome;
