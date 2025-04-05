import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Modal,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import Header from "../../layout/Header";
import DateTimePicker from "@react-native-community/datetimepicker";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import { ActivityIndicator } from "react-native-paper";
import { ApiService } from "../../lib/ApiService";
import { COLORS } from "../../constants/theme";

type Props = StackScreenProps<
  RootStackParamList,
  "GenerateEmployeeSalariesListScreen"
>;

/** The shape of each employee item from the API */
type Employee = {
  id: number;
  name: string;
  total_salary: string; // from API
};

const GenerateEmployeeSalariesListScreen: React.FC<Props> = ({
  navigation,
}) => {
  const { colors } = useTheme();

  // For selecting which month-year we generate salary
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tempDate, setTempDate] = useState(new Date()); // temp date for the picker
  const [showPicker, setShowPicker] = useState(false);

  // For storing the employees from the API
  const [employeeList, setEmployeeList] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // State for selected employee IDs
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  // Global "select all" state
  const [selectAll, setSelectAll] = useState<boolean>(false);

  // Limit date to minDate = 1 year before this month, maxDate = current month
  const now = new Date();
  const minDate = new Date(now.getFullYear() - 1, now.getMonth(), 1); // 1 year before
  const maxDate = new Date(now.getFullYear(), now.getMonth(), 1); // current month

  /** Fetch employees from API using ApiService.postWithToken */
  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const response = await ApiService.postWithToken(
        "api/employee/all-list",
        {}
      );

      if (response?.data) {
        setEmployeeList(response.data);
      }
    } catch (error) {
      console.error("Error fetching employee list:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Toggle the global "All" checkbox
  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([]);
      setSelectAll(false);
    } else {
      setSelectedIds(employeeList.map((emp) => emp.id));
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
      if (newSelected.length === employeeList.length) {
        setSelectAll(true);
      }
    }
  };

  // Render each employee row
  const renderEmployeeItem = ({ item }: { item: Employee }) => (
    <View style={[styles.itemContainer, { backgroundColor: colors.card }]}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.name ? item.name[0] : "E"}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={[styles.name, { color: colors.title }]}>{item.name}</Text>
      </View>
      <View style={styles.salaryContainer}>
        <Text style={[styles.salary, { color: colors.text }]}>
          {item.total_salary}
        </Text>
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
  const formatMonthYear = (date: Date, monthInNum = false) => {
    let month;
    if (monthInNum) {
      month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${month}-${year}`;
    } else {
      month = date.toLocaleString("default", { month: "short" });
      const year = date.getFullYear();
      return `${month} ${year}`;
    }
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

  // // Generate Salary -> navigate to PDF list (or handle as needed)
  // const handleGenerateSalary = () => {
  //   // console.log("GenerateEmployeePdfListScreen", selectedIds, selectedDate);
  //   const salary_date = formatMonthYear(selectedDate, true);
  //   navigation.navigate("GenerateEmployeePdfListScreen", { data: { employees_ids: selectedIds, salary_date: salary_date } });
  // };
  // Updated handleGenerateSalary function with the requested validations.
  // 1. Must have at least one selected employee (selectedIds.length >= 1).
  // 2. The salary date must match the "MM-YYYY" format (e.g., "01-2025").
  // If any check fails, show an alert message.

  const handleGenerateSalary = () => {
    // Check if at least one employee is selected
    if (!selectedIds || selectedIds.length < 1) {
      Alert.alert("Validation Error", "Please select at least one employee.");
      return;
    }

    // Format the date as "MM-YYYY"
    const salary_date = formatMonthYear(selectedDate, true); // e.g. "02-2025"

    // Validate the "MM-YYYY" format
    const dateRegex = /^\d{2}-\d{4}$/;
    if (!dateRegex.test(salary_date)) {
      Alert.alert(
        "Validation Error",
        "Salary date is invalid. Please select a valid month-year."
      );
      return;
    }

    // If all validations pass, navigate to the next screen
    navigation.navigate("GenerateEmployeePdfListScreen", {
      data: { employees_ids: selectedIds, salary_date },
    });
  };
  return (
    <View style={styles.wrapper}>
      {/* Header */}
      <Header leftIcon="back" title="Generate Salaries" />

      {/* Loading state */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size={50} color="#4CAF50" />
        </View>
      ) : (
        <>
          {/* Scrollable container */}
          <ScrollView
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
          >
            {/* Date picker row */}
            <View style={styles.dateRow}>
              <Text style={[styles.dateLabel, { color: colors.title }]}>
                Select Month-Year:
              </Text>
              <TouchableOpacity
                style={[styles.dateButton, { backgroundColor: colors.card }]}
                onPress={onPressDate}
              >
                <Text style={[styles.dateButtonText, { color: colors.title }]}>
                  {formatMonthYear(selectedDate)}
                </Text>
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
              <Text style={[styles.selectAllText, { color: colors.text }]}>
                All
              </Text>
            </View>

            {/* Employee list */}
            <FlatList
              data={employeeList}
              renderItem={renderEmployeeItem}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
            />
          </ScrollView>

          {/* Fixed Generate Salary button */}
          <View style={styles.generateButtonContainer}>
            <TouchableOpacity
              style={styles.generateButton}
              onPress={handleGenerateSalary}
            >
              <Text style={styles.generateButtonText}>Generate Salary</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* Modal with custom date/time picker */}
      <Modal
        visible={showPicker}
        transparent
        animationType="fade"
        onRequestClose={onPressCancel}
      >
        <View style={styles.modalBackground}>
          <View
            style={[
              styles.modalContainer,
              { backgroundColor: colors.background },
            ]}
          >
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Select Month-Year
            </Text>
            <DateTimePicker
              style={[
                styles.dateTimePicker,
                { backgroundColor: colors.background },
              ]}
              textColor={colors.title}
              value={tempDate}
              mode="date"
              display="spinner"
              onChange={onChangeDate}
              minimumDate={minDate}
              maximumDate={maxDate}
            />
            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={styles.modalButtonCancel}
                onPress={onPressCancel}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButtonOk}
                onPress={onPressOk}
              >
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  // Optional image style if you want an avatar
  profileImage: {
    width: 40,
    height: 40,
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
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    paddingHorizontal: 100,
    borderRadius: 15,
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
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { fontSize: 24, color: "white", fontWeight: "bold" },
  dateTimePicker: {
    width: "100%",
    borderRadius: 8,
    marginVertical: 10,
  },
});
