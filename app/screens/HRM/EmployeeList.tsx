import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
} from "react-native";
import { Feather, AntDesign, FontAwesome } from "@expo/vector-icons";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import Header from "../../layout/Header";
import { useTheme } from "@react-navigation/native";

type EmployeeListScreenProps = StackScreenProps<
  RootStackParamList,
  "EmployeeListScreen"
>;

export const EmployeeListScreen = ({ navigation }: EmployeeListScreenProps) => {
  const theme = useTheme();
  const { colors }: { colors: any } = theme;

  const employees = [
    { id: "1", name: "Shaidul Islam", role: "Designer", color: "#F4B183" },
    { id: "2", name: "Mehedii Mohammad", role: "Designer", color: "#5DADE2" },
    { id: "3", name: "Ibne Riead", role: "Designer", color: "#52BE80" },
    { id: "4", name: "Emily", role: "Designer", color: "#AF7AC5" },
  ];

  const [selectedId, setSelectedId] = useState("1");

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header leftIcon="back" title=" Employee List" />
      {/* Empty State Illustration */}
      {employees === null ? (
        <View style={styles.content}>
          <Image
            src={"assets/images/card.png"} // Replace with actual image
            style={styles.illustration}
            resizeMode="contain"
          />
          <Text style={[styles.noDataText, { color: colors.title }]}>
            No Data
          </Text>
          <Text style={[styles.subText, { color: colors.title }]}>
            Add your employee
          </Text>
        </View>
      ) : (
        <FlatList
          data={employees}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => {
                setSelectedId(item.id);
                navigation.navigate("EmployeeDetailScreen");
              }}
            >
              <View style={[styles.avatar, { backgroundColor: item.color }]}>
                <Text style={styles.avatarText}>{item.name[0]}</Text>
              </View>
              <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.role}>{item.role}</Text>
              </View>
              {selectedId === item.id && (
                <FontAwesome name="dot-circle-o" size={20} color="#478DFF" />
              )}
            </TouchableOpacity>
          )}
        />
      )}
      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("AddEmployee")}
      >
        <AntDesign name="plus" size={26} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },

  // Header
  header: {
    backgroundColor: "#4A90E2",
    paddingVertical: 18,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  backButton: { padding: 8, marginRight: 10 },
  headerText: { fontSize: 18, fontWeight: "bold", color: "#FFFFFF" },

  // Content
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  illustration: { width: 250, height: 200, marginBottom: 20 },
  noDataText: { fontSize: 20, fontWeight: "bold", color: "#333" },
  subText: { fontSize: 14, color: "#666", marginTop: 5 },

  // Floating Button
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#4A90E2",
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 15,
    marginVertical: 5,
    marginHorizontal: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    top: 15,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { color: "white", fontSize: 16, fontWeight: "bold" },
  info: { flex: 1, marginLeft: 15 },
  name: { fontSize: 16, fontWeight: "bold", color: "#333" },
  role: { fontSize: 14, color: "#777" },
});

export default EmployeeListScreen;
