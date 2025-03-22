import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Modal,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import Header from "../../layout/Header";
import DateTimePicker from "@react-native-community/datetimepicker";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";

// Type for employee data
type Employee = {
  id: number;
  name: string;
  salary: string; // salary as string for simplicity
  profileImage: string;
};

// Adjust this to your actual route name if needed
type Props = StackScreenProps<RootStackParamList, "GenerateEmployeeSalariesListScreen">;

const staticEmployees: Employee[] = [
  { id: 1, name: "Alice Johnson", salary: "12000", profileImage: "https://placehold.co/200/jpg" },
  { id: 2, name: "Bob Smith", salary: "15000", profileImage: "https://placehold.co/200/jpg" },
  { id: 3, name: "Charlie Brown", salary: "13000", profileImage: "https://placehold.co/200/jpg" },
  { id: 4, name: "Diana Ross", salary: "14000", profileImage: "https://placehold.co/200/jpg" },
  { id: 5, name: "Ethan Hunt", salary: "16000", profileImage: "https://placehold.co/200/jpg" },
  { id: 6, name: "Fiona Apple", salary: "12500", profileImage: "https://placehold.co/200/jpg" },
  { id: 7, name: "George Martin", salary: "13500", profileImage: "https://placehold.co/200/jpg" },
  { id: 8, name: "Hannah Montana", salary: "14500", profileImage: "https://placehold.co/200/jpg" },
  { id: 9, name: "Ian Somerhalder", salary: "15500", profileImage: "https://placehold.co/200/jpg" },
  { id: 10, name: "Julia Roberts", salary: "16500", profileImage: "https://placehold.co/200/jpg" },
];

const GenerateEmployeeSalariesListScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();

  // For selecting which month-year we generate salary
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tempDate, setTempDate] = useState(new Date()); // temp date for the picker
  const [showPicker, setShowPicker] = useState(false);

  // Limit to minDate = 1 year before this month, maxDate = current month
  const now = new Date();
  const minDate = new Date(now.getFullYear() - 1, now.getMonth(), 1); // 1 year before
  const maxDate = new Date(now.getFullYear(), now.getMonth(), 1);     // current month

  // State for selected employee IDs
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  // Global "select all" state
  const [selectAll, setSelectAll] = useState<boolean>(false);

  // Toggle the global "All" checkbox
  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([]);
      setSelectAll(false);
    } else {
      setSelectedIds(staticEmployees.map((emp) => emp.id));
      setSelectAll(true);
    }
  };

  // Toggle individual employee selection
  const toggleSelectEmployee = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
      setSelectAll(false);
    } else {
      const newSelected = [...selectedIds, id];
      setSelectedIds(newSelected);
      if (newSelected.length === staticEmployees.length) {
        setSelectAll(true);
      }
    }
  };

  // Render each employee row
  const renderEmployeeItem = ({ item }: { item: Employee }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.profileImage }} style={styles.profileImage} />
      <View style={styles.infoContainer}>
        <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
      </View>
      <View style={styles.salaryContainer}>
        <Text style={[styles.salary, { color: colors.text }]}>{item.salary}</Text>
      </View>
      <TouchableOpacity onPress={() => toggleSelectEmployee(item.id)}>
        {selectedIds.includes(item.id) ? (
          <Ionicons name="checkbox" size={24} color="#4CAF50" />
        ) : (
          <Ionicons name="square-outline" size={24} color="#ccc" />
        )}
      </TouchableOpacity>
    </View>
  );

  // Helper to format only month-year
  const formatMonthYear = (date: Date) => {
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    return `${month} ${year}`;
  };

  // Show the modal date picker
  const onPressDate = () => {
    setTempDate(selectedDate);
    setShowPicker(true);
  };

  // Called when date changes in the picker
  const onChangeDate = (event: any, newDate?: Date) => {
    if (newDate) {
      // Force day to 1 so we effectively only store month-year
      newDate.setDate(1);
      setTempDate(newDate);
    }
  };

  // Press "OK" to confirm
  const onPressOk = () => {
    setSelectedDate(tempDate);
    setShowPicker(false);
  };

  // Press "Cancel" to discard changes
  const onPressCancel = () => {
    setShowPicker(false);
  };

  // Generate Salary -> navigate to PDF list
  const handleGenerateSalary = () => {
    navigation.navigate("GenerateEmployeePdfListScreen");
  };

  return (
    <View style={styles.wrapper}>
      {/* Header */}
      <Header leftIcon="back" title="Generate Salaries" />

      {/* Scrollable container */}
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Date picker row */}
        <View style={styles.dateRow}>
          <Text style={styles.dateLabel}>Select Month-Year:</Text>
          <TouchableOpacity style={styles.dateButton} onPress={onPressDate}>
            <Text style={styles.dateButtonText}>{formatMonthYear(selectedDate)}</Text>
          </TouchableOpacity>
        </View>

        {/* Global "All" checkbox */}
        <View style={styles.selectAllContainer}>
          <TouchableOpacity onPress={toggleSelectAll}>
            {selectAll ? (
              <Ionicons name="checkbox" size={24} color="#4CAF50" />
            ) : (
              <Ionicons name="square-outline" size={24} color="#ccc" />
            )}
          </TouchableOpacity>
          <Text style={[styles.selectAllText, { color: colors.text }]}>All</Text>
        </View>

        {/* Employee list */}
        <FlatList
          data={staticEmployees}
          renderItem={renderEmployeeItem}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
        />
      </ScrollView>

      {/* Fixed Generate Salary button */}
      <View style={styles.generateButtonContainer}>
        <TouchableOpacity style={styles.generateButton} onPress={handleGenerateSalary}>
          <Text style={styles.generateButtonText}>Generate Salary</Text>
        </TouchableOpacity>
      </View>

      {/* Modal with custom date/time picker */}
      <Modal
        visible={showPicker}
        transparent
        animationType="fade"
        onRequestClose={onPressCancel}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select Month-Year</Text>
            <DateTimePicker
              value={tempDate}
              mode="date"
              display="spinner"
              onChange={onChangeDate}
              minimumDate={minDate}
              maximumDate={maxDate}
            />
            <View style={styles.modalButtonRow}>
              <TouchableOpacity style={styles.modalButtonCancel} onPress={onPressCancel}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButtonOk} onPress={onPressOk}>
                <Text style={styles.modalButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default GenerateEmployeeSalariesListScreen;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    padding: 15,
    paddingBottom: 100, // Extra bottom padding for fixed button
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginRight: 8,
  },
  dateButton: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  dateButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  selectAllContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  selectAllText: {
    fontSize: 16,
    marginLeft: 8,
    fontWeight: "bold",
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
  salaryContainer: {
    marginRight: 12,
  },
  salary: {
    fontSize: 16,
    fontWeight: "600",
  },
  generateButtonContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  generateButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  generateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  // Modal
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "60%",
    marginTop: 10,
  },
  modalButtonCancel: {
    backgroundColor: "#E57373",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  modalButtonOk: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});
