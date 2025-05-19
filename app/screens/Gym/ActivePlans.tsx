import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import Header from "../../layout/Header";

const mockPlans = [
  {
    id: "1",
    name: "Basic Plan",
    price: 999,
    duration: "1 Month",
    members: 25,
  },
  {
    id: "2",
    name: "Standard Plan",
    price: 2499,
    duration: "3 Months",
    members: 40,
  },
  {
    id: "3",
    name: "Premium Plan",
    price: 4999,
    duration: "6 Months",
    members: 15,
  },
];

const formatCurrency = (amount) => `₹${parseFloat(amount).toFixed(2)}`;

type ActivePlansProps = StackScreenProps<RootStackParamList, "ActivePlans">;

export const ActivePlans = ({ navigation }: ActivePlansProps) => {
  const [searchText, setSearchText] = useState("");

  const filteredPlans = mockPlans.filter((plan) =>
    plan.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.planName}>{item.name}</Text>
        <Text style={styles.planPrice}>{formatCurrency(item.price)}</Text>
      </View>
      <View style={styles.cardDetails}>
        <Text style={styles.detailText}>Duration: {item.duration}</Text>
        <Text style={styles.detailText}>Members: {item.members}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <Header leftIcon="back" title="Active Plans" />

      <View style={styles.container}>
        <FlatList
          data={filteredPlans}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={
            <View style={styles.searchBox}>
              <Ionicons name="search" size={20} color="#888" />
              <TextInput
                style={styles.input}
                placeholder="Search plans"
                value={searchText}
                onChangeText={setSearchText}
              />
            </View>
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>No active plans found.</Text>
          }
          contentContainerStyle={{ paddingBottom: 20 }}
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
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    elevation: 2,
  },
  input: {
    marginLeft: 8,
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  planName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111",
  },
  planPrice: {
    fontSize: 16,
    fontWeight: "500",
    color: "#007AFF",
  },
  cardDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailText: {
    fontSize: 14,
    color: "#555",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#999",
  },
});
