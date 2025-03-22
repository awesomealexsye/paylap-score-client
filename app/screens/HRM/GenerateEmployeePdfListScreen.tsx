import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import Header from "../../layout/Header";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";

// Type for employee data
type Employee = {
  id: number;
  name: string;
  profileImage: string;
};

// Static list of 10 employee items
const staticEmployees: Employee[] = [
  { id: 1, name: "Alice Johnson", profileImage: "https://placehold.co/200/jpg" },
  { id: 2, name: "Bob Smith", profileImage: "https://placehold.co/200/jpg" },
  { id: 3, name: "Charlie Brown", profileImage: "https://placehold.co/200/jpg" },
  { id: 4, name: "Diana Ross", profileImage: "https://placehold.co/200/jpg" },
  { id: 5, name: "Ethan Hunt", profileImage: "https://placehold.co/200/jpg" },
  { id: 6, name: "Fiona Apple", profileImage: "https://placehold.co/200/jpg" },
  { id: 7, name: "George Martin", profileImage: "https://placehold.co/200/jpg" },
  { id: 8, name: "Hannah Montana", profileImage: "https://placehold.co/200/jpg" },
  { id: 9, name: "Ian Somerhalder", profileImage: "https://placehold.co/200/jpg" },
  { id: 10, name: "Julia Roberts", profileImage: "https://placehold.co/200/jpg" },
];

type Props = StackScreenProps<RootStackParamList, "GenerateEmployeePdfListScreen">;

const GenerateEmployeePdfListScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();

  // We'll skip the checkboxes for this screen.
  // Just show name, profile, and a PDF icon on the right.
  const renderEmployeeItem = ({ item }: { item: Employee }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.profileImage }} style={styles.profileImage} />
      <View style={styles.infoContainer}>
        <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
      </View>
      {/* PDF icon on the right */}
      <TouchableOpacity onPress={() => {
        navigation.navigate('FinalInvoiceResult', { data: { pdf_url: "https://paynest.co.in/api/invoice?invoice_id=MTAwMDUz" }, previous_screen: "GenerateEmployeePdfListScreen" });

      }}>
        <MaterialCommunityIcons name="file-pdf-box" size={28} color="#f44336" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.wrapper}>
      {/* Header */}
      <Header leftIcon="back" title="PDF Salaries" />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <FlatList
          data={staticEmployees}
          renderItem={renderEmployeeItem}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
        />
      </ScrollView>
    </View>
  );
};

export default GenerateEmployeePdfListScreen;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    padding: 15,
    paddingBottom: 30,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
});
