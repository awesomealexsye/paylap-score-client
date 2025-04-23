import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import Header from "../../layout/Header";
import { useTheme, useFocusEffect } from "@react-navigation/native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import { ApiService } from "../../lib/ApiService";
import { COLORS } from "../../constants/theme";

type ManageAdvanceAmountScreenProps = StackScreenProps<
  RootStackParamList,
  "ManageAdvanceAmountScreen"
>;


export const ManageAdvanceAmountScreen: React.FC<ManageAdvanceAmountScreenProps> = ({
  navigation,
  route,
}) => {
  const employee = route.params || {};

  const { colors } = useTheme();

  const [isLoading, setIsLoading] = useState(false);

  // For demonstration, assume a constant employee id
  const employeeId = employee?.id || 0;

  const [advances, setAdvances] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  /* ADD modal */
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [amount, setAmount] = useState<string>("");
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(moment().format("YYYY-MM-DD"));

  const fetchAdvances = async () => {
    setRefreshing(true);
    const res: any = await ApiService.postWithToken(
      "api/hrm/employee-advance-amount/list",
      { employee_id: employeeId }
    );
    if (res?.status) {
      setAdvances(res.data);
    }
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchAdvances();
    }, [employeeId])
  );

  const handleAddAdvance = async () => {
    if (!amount) return;
    setIsLoading(true);
    const res: any = await ApiService.postWithToken(
      "api/hrm/employee-advance-amount/add",
      {
        employee_id: employeeId,
        amount: Number(amount),
        amount_taken_date: selectedDate,
      }
    );
    setIsLoading(false);
    if (res?.status) {
      setAddModalVisible(false);
      setAmount("");
      fetchAdvances();
    }
  };

  const handleDeleteAdvance = async (id: number) => {
    setIsLoading(true);
    const res: any = await ApiService.postWithToken(
      "api/hrm/employee-advance-amount/delete",
      { id }
    );
    setIsLoading(false);
    if (res?.status) {
      fetchAdvances();
    }
  };

  return (
    <>
      <Header leftIcon="back" title="Advance Amount" />
      <View style={styles.container}>
        {/* List */}
        <FlatList
          data={advances}
          keyExtractor={(item) => item.id.toString()}
          refreshing={refreshing}
          onRefresh={fetchAdvances}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 20, color: colors.text }}>
              No advance amount found
            </Text>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View>
                <Text style={styles.cardAmount}>₹ {item.amount}</Text>
                <Text style={styles.cardDate}>
                  {moment(item.amount_taken_date).format("DD MMM YYYY")}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => handleDeleteAdvance(item.id)}
              >
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        />

        {/* Floating add button */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setAddModalVisible(true)}
        >
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      </View>
      {/* Add Advance Modal */}
      <Modal
        visible={addModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setAddModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.leaveModalContent, { width: "90%" }]}>
            <Text style={styles.modalTitle}>Add Advance</Text>

            <TextInput
              placeholder="Amount"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              style={styles.input}
            />

            <TouchableOpacity
              style={styles.dateBtn}
              onPress={() => setDatePickerVisible(true)}
            >
              <Text style={styles.dateBtnText}>
                {moment(selectedDate).format("DD MMM YYYY")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.leaveOptionButton, { backgroundColor: COLORS.primary }]}
              onPress={handleAddAdvance}
            >
              <Text style={[styles.leaveOptionText, { color: "#fff" }]}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => setAddModalVisible(false)}
            >
              <Text style={{ color: "#fff" }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>

        <DateTimePickerModal
          isVisible={datePickerVisible}
          mode="date"
          minimumDate={moment().subtract(6, "months").startOf("day").toDate()}
          maximumDate={moment().endOf("day").toDate()}
          date={moment(selectedDate).toDate()}
          onConfirm={(date) => {
            setSelectedDate(moment(date).format("YYYY-MM-DD"));
            setDatePickerVisible(false);
          }}
          onCancel={() => setDatePickerVisible(false)}
        />
      </Modal>
      {isLoading && (
        <View style={styles.loaderOverlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
    </>
  );
};

export default ManageAdvanceAmountScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  monthYearButton: {
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#ddd",
    borderRadius: 8,
    marginTop: 16,
  },
  monthYearText: {
    fontSize: 18,
    fontWeight: "600",
  },

  /* Legend Row */
  legendContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginTop: 12,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 6,
  },
  legendLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#333",
  },

  daysContainerWrapper: {
    flex: 1,
    justifyContent: "center", // center vertically
    alignItems: "center", // center horizontally
  },
  daysContainer: {
    // Additional spacing around the grid
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  dayItemWrapper: {
    margin: 6,
    width: 50,
    height: 50,
    position: "relative",
  },
  dayItem: {
    width: "100%",
    height: "100%",
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  dayText: {
    fontSize: 15,
    color: "#000",
  },
  removeIcon: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#000",
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  removeIconText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  leaveModalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 6,
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: 14,
    marginBottom: 16,
    textAlign: "center",
  },
  leaveOptionButton: {
    backgroundColor: "#eee",
    padding: 12,
    borderRadius: 6,
    marginVertical: 6,
  },
  leaveOptionText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
  closeModalButton: {
    backgroundColor: COLORS.danger,
    padding: 12,
    borderRadius: 6,
    marginTop: 12,
    alignItems: "center",
  },
  loaderOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    marginVertical: 6,
    borderRadius: 8,
    backgroundColor: "#fff",
    elevation: 2,
  },
  cardAmount: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primary,
  },
  cardDate: {
    fontSize: 12,
    color: "#555",
    marginTop: 2,
  },
  deleteBtn: {
    backgroundColor: COLORS.danger,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  deleteText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: COLORS.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  fabText: { color: "#fff", fontSize: 32, marginTop: -2 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
  },
  dateBtn: {
    padding: 12,
    backgroundColor: "#eee",
    borderRadius: 6,
    marginBottom: 16,
    alignItems: "center",
  },
  dateBtnText: { fontSize: 14, color: "#333" },
});
