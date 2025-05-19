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

const mockTrainers = [
  {
    id: "1",
    name: "Rahul Verma",
    phone: "9876543210",
    specialization: "Strength Training",
    status: "Available",
  },
  {
    id: "2",
    name: "Anjali Sharma",
    phone: "9123456780",
    specialization: "Yoga",
    status: "Busy",
  },
  {
    id: "3",
    name: "Vikram Singh",
    phone: "9012345678",
    specialization: "CrossFit",
    status: "Available",
  },
  {
    id: "4",
    name: "Pooja Patel",
    phone: "9321654987",
    specialization: "Zumba",
    status: "On Leave",
  },
];

type GymTrainersProps = StackScreenProps<RootStackParamList, "GymTrainers">;

export const GymTrainers = ({ navigation }: GymTrainersProps) => {
  const [searchText, setSearchText] = useState("");

  const filteredTrainers = mockTrainers.filter((trainer) =>
    trainer.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <View style={styles.cardContent}>
        <View>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.phone}>{item.phone}</Text>
          <Text style={styles.specialization}>{item.specialization}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            item.status === "Available"
              ? styles.available
              : item.status === "Busy"
              ? styles.busy
              : styles.leave,
          ]}
        >
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <Header title={"Trainers"} leftIcon="back" />
      <View style={styles.container}>
        <FlatList
          data={filteredTrainers}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListHeaderComponent={
            <View style={styles.searchBox}>
              <Ionicons name="search" size={20} color="#888" />
              <TextInput
                placeholder="Search trainers"
                style={styles.input}
                value={searchText}
                onChangeText={setSearchText}
              />
            </View>
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>No trainers found.</Text>
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
    backgroundColor: "#F8FAFC",
    padding: 16,
  },
  searchBox: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: "center",
    elevation: 2,
    marginBottom: 16,
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
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontSize: 17,
    fontWeight: "600",
    color: "#111",
  },
  phone: {
    fontSize: 14,
    color: "#666",
    marginVertical: 4,
  },
  specialization: {
    fontSize: 13,
    color: "#888",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  available: {
    backgroundColor: "#34C759",
  },
  busy: {
    backgroundColor: "#FF9500",
  },
  leave: {
    backgroundColor: "#FF3B30",
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#999",
  },
});
