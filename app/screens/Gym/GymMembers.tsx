import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import Header from "../../layout/Header";

const mockMembers = [
  { id: "1", name: "Amit Sharma", phone: "9876543210", status: "Active" },
  { id: "2", name: "Priya Singh", phone: "9123456780", status: "Inactive" },
  { id: "3", name: "Ravi Mehta", phone: "9012345678", status: "Active" },
  { id: "4", name: "Sneha Patel", phone: "9321654987", status: "Active" },
  { id: "5", name: "John Doe", phone: "9871234567", status: "Inactive" },
];

type GymMembersProps = StackScreenProps<RootStackParamList, "GymMembers">;

export const GymMembers = ({ navigation }: GymMembersProps) => {
  const [searchText, setSearchText] = useState("");

  const filteredMembers = mockMembers.filter((member) =>
    member.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.memberCard}>
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{item.name}</Text>
        <Text style={styles.memberPhone}>{item.phone}</Text>
      </View>
      <View
        style={[
          styles.statusBadge,
          item.status === "Active" ? styles.active : styles.inactive,
        ]}
      >
        <Text style={styles.statusText}>{item.status}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <Header title={"Members"} leftIcon="back" />
      <View style={styles.container}>
        {/* FlatList with search input as ListHeaderComponent */}
        <FlatList
          data={filteredMembers}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          ListHeaderComponent={
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color="#666" />
              <TextInput
                placeholder="Search members"
                style={styles.input}
                value={searchText}
                onChangeText={setSearchText}
              />
            </View>
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>No members found.</Text>
          }
          keyboardShouldPersistTaps="handled"
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
    padding: 16,
  },
  searchContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: "center",
    elevation: 3,
    marginBottom: 16,
  },
  input: {
    marginLeft: 8,
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  listContainer: {
    paddingBottom: 24,
  },
  memberCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
  },
  memberPhone: {
    fontSize: 14,
    color: "#777",
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
  },
  active: {
    backgroundColor: "#34C759",
  },
  inactive: {
    backgroundColor: "#FF3B30",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 32,
    fontSize: 16,
    color: "#888",
  },
});
