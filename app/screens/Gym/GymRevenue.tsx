import { StackScreenProps } from "@react-navigation/stack";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import Header from "../../layout/Header";

const invoices = [
  {
    id: "INV001",
    member: "Rohit Sharma",
    plan: "Gold Membership",
    amount: 2000,
    status: "Overdue",
    pendingAmount: 1000,
    date: "2025-05-10 10:30",
  },
  {
    id: "INV002",
    member: "Anjali Mehta",
    plan: "FitPro Plan",
    amount: 1500,
    status: "Paid",
    date: "2025-05-01 14:00",
  },
  {
    id: "INV003",
    member: "Sahil Khan",
    plan: "Strength Booster",
    amount: 1800,
    status: "Unpaid",
    pendingAmount: 1800,
    date: "2025-04-20 17:45",
  },
  {
    id: "INV004",
    member: "Sneha Patel",
    plan: "Gold Membership",
    amount: 2000,
    status: "Paid",
    date: "2025-04-10 11:15",
  },
];

const tabs = ["All", "Paid", "Unpaid", "Overdue"];

type GymRevenueProps = StackScreenProps<RootStackParamList, "GymRevenue">;

export const GymRevenue = ({ navigation }: GymRevenueProps) => {
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesTab =
      activeTab === "All" ||
      invoice.status.toLowerCase() === activeTab.toLowerCase();
    const matchesSearch =
      invoice.member.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return "#10B981"; // green
      case "Overdue":
        return "#EF4444"; // red
      case "Unpaid":
        return "#F59E0B"; // amber
      default:
        return "#6B7280"; // gray
    }
  };

  return (
    <>
      <Header title={"Gym Revenue"} leftIcon="back" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>Total Revenue</Text>
            <Text style={styles.summaryValue}>₹ 7300</Text>
          </View>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>Pending Payments</Text>
            <Text style={styles.summaryValue}>₹ 2800</Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          {tabs.map((tab) => (
            <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
                ]}
              >
                {tab}
              </Text>
              {activeTab === tab && <View style={styles.tabUnderline} />}
            </TouchableOpacity>
          ))}
        </View>

        {/* Search */}
        <TextInput
          placeholder="Search by name or invoice ID"
          placeholderTextColor="#888"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {/* Invoice List */}
        <FlatList
          data={filteredInvoices}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.name}>{item.member}</Text>
                <Text
                  style={[
                    styles.status,
                    { backgroundColor: getStatusColor(item.status) },
                  ]}
                >
                  {item.status}
                </Text>
              </View>
              <Text style={styles.plan}>
                {item.plan} • #{item.id}
              </Text>
              {item.pendingAmount && item.status !== "Paid" && (
                <Text style={styles.pending}>
                  Pending: ₹{item.pendingAmount}
                </Text>
              )}
              <View style={styles.row}>
                <Text style={styles.date}>{item.date}</Text>
                <Text style={styles.amount}>₹ {item.amount.toFixed(2)}</Text>
              </View>
            </View>
          )}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 16,
  },
  summaryCard: {
    flexDirection: "row",
    backgroundColor: "#1E3A8A",
    borderRadius: 12,
    padding: 16,
    justifyContent: "space-between",
    marginBottom: 16,
  },
  summaryBox: {
    alignItems: "center",
    flex: 1,
  },
  summaryLabel: {
    color: "#BFDBFE",
    fontSize: 14,
    marginBottom: 4,
  },
  summaryValue: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 12,
  },
  tabText: {
    fontSize: 15,
    color: "#6B7280",
  },
  activeTabText: {
    color: "#1E3A8A",
    fontWeight: "600",
  },
  tabUnderline: {
    height: 2,
    backgroundColor: "#1E3A8A",
    marginTop: 4,
  },
  searchInput: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    borderColor: "#E5E7EB",
    borderWidth: 1,
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  plan: {
    fontSize: 13,
    color: "#6B7280",
    marginVertical: 4,
  },
  pending: {
    fontSize: 13,
    color: "#DC2626",
    marginBottom: 4,
    fontWeight: "500",
  },
  date: {
    fontSize: 13,
    color: "#6B7280",
  },
  amount: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  status: {
    color: "#fff",
    fontSize: 12,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 12,
    overflow: "hidden",
  },
});
