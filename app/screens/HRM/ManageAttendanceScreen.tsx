import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import Header from "../../layout/Header";
import { useTheme } from "@react-navigation/native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import { ApiService } from "../../lib/ApiService";
import { COLORS } from "../../constants/theme";

type ManageAttendanceScreenProps = StackScreenProps<
  RootStackParamList,
  "ManageAttendanceScreen"
>;

// Define possible leave types
type LeaveType = "planned" | "sick" | "halfDay";

// Extended day status including record id from API
interface DayStatus {
  id?: number;
  leaveType: LeaveType;
}

// Colors for each leave type
const LEAVE_COLORS: Record<LeaveType, string> = {
  planned: "#4E88FF", // Blue
  sick: "#FF4E4E", // Red
  halfDay: "#FFD700", // Yellow
};

export const ManageAttendanceScreen: React.FC<ManageAttendanceScreenProps> = ({
  navigation,
  route,
}) => {
  const employee = route.params || {};

  const { colors } = useTheme();

  // The date used to show the month’s days (full date; we only care about month/year)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  // Controls whether the date picker modal is visible
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  // The list of days for the selected month
  const [daysInMonth, setDaysInMonth] = useState<number[]>([]);
  // Which day was tapped?
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  // Store day statuses: day -> DayStatus
  const [dayStatuses, setDayStatuses] = useState<Record<number, DayStatus>>({});
  // Control the leave-type modal
  const [leaveModalVisible, setLeaveModalVisible] = useState(false);
  // Loading state for API calls (any call: store, update, destroy)
  const [isLoading, setIsLoading] = useState(false);

  // For demonstration, assume a constant employee id
  const employeeId = employee?.id || 0;

  // Restrict min/max date for date picker: 4 months in the past, 3 months in the future
  const minDate = moment().subtract(4, "months").toDate();
  const maxDate = moment().add(3, "months").toDate();

  // ----- Fetch Leaves -----
  const fetchEmployeeLeaves = async () => {
    setIsLoading(true);
    try {
      const response = await ApiService.postWithToken(
        "api/hrm/employee-leaves/index",
        {
          employee_id: employeeId,
          month: moment(selectedDate).format("YYYY-MM"),
        }
      );
      const newDayStatuses: Record<number, DayStatus> = {};
      if (response && response.data && Array.isArray(response.data)) {
        response.data.forEach((record: any) => {
          // Extract the day from leave_date (format: "YYYY-MM-DD")
          const day = moment(record.leave_date).date();
          newDayStatuses[day] = { id: record.id, leaveType: record.leave_type };
        });
      }
      setDayStatuses(newDayStatuses);
    } catch (error) {
      console.error("Error fetching leaves", error);
    }
    setIsLoading(false);
  };

  // Recompute days + fetch leaves whenever selectedDate changes
  useEffect(() => {
    const daysCount = moment(selectedDate).daysInMonth();
    const newDays = Array.from({ length: daysCount }, (_, i) => i + 1);
    setDaysInMonth(newDays);

    // Clear any previously selected day so we don't mix data from different months
    setSelectedDay(null);

    // Fetch leaves for the new month
    fetchEmployeeLeaves();
  }, [selectedDate]);

  // ----- DATE PICKER HANDLERS -----
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirmDate = (date: Date) => {
    setSelectedDate(date);
    hideDatePicker();
  };

  const handleCancelDate = () => {
    hideDatePicker();
  };

  // ----- DAY GRID HANDLERS -----
  const onPressDay = (day: number) => {
    setSelectedDay(day);
    setLeaveModalVisible(true);
  };

  // Handle creating/updating a leave for the selected day
  const handleSetLeaveForDay = async (type: LeaveType) => {
    if (selectedDay == null) return;
    const leave_date = moment(selectedDate)
      .date(selectedDay)
      .format("YYYY-MM-DD");
    const payload: any = {
      employee_id: employeeId,
      leave_date,
      leave_type: type,
    };
    setIsLoading(true); // Show loader while calling API
    setLeaveModalVisible(false);
    try {
      if (dayStatuses[selectedDay]?.id) {
        // Update existing record
        payload.id = dayStatuses[selectedDay].id;
        await ApiService.postWithToken(
          "api/hrm/employee-leaves/update",
          payload
        );
      } else {
        // Create a new leave record
        await ApiService.postWithToken(
          "api/hrm/employee-leaves/store",
          payload
        );
      }
      // Refresh leaves
      await fetchEmployeeLeaves();
    } catch (error) {
      console.error("Error setting leave", error);
    }
    setIsLoading(false);
    // setLeaveModalVisible(false);
  };

  // ----- REMOVE LEAVE -----
  // Called when tapping the minus icon on a day that already has a leave
  const handleRemoveLeave = async (day: number) => {
    const leaveInfo = dayStatuses[day];
    if (!leaveInfo?.id) return; // No ID means no existing record
    setIsLoading(true);
    try {
      await ApiService.postWithToken("api/hrm/employee-leaves/destroy", {
        id: leaveInfo.id,
      });
      // Refresh leaves
      await fetchEmployeeLeaves();
    } catch (error) {
      console.error("Error removing leave", error);
    }
    setIsLoading(false);
  };

  return (
    <>
      <Header leftIcon="back" title="Manage Attendance" />
      <View style={styles.container}>
        {/* Month-Year Display (Date Picker Trigger) */}
        <TouchableOpacity
          style={styles.monthYearButton}
          onPress={showDatePicker}
        >
          <Text style={styles.monthYearText}>
            {moment(selectedDate).format("MMMM YYYY")}
          </Text>
        </TouchableOpacity>

        {/* Date Picker Modal */}
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          date={selectedDate}
          onConfirm={handleConfirmDate}
          onCancel={handleCancelDate}
          minimumDate={minDate}
          maximumDate={maxDate}
        />

        {/* Legend Row (Planned, Sick/Unplanned, Half-Day) */}
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View
              style={[
                styles.legendBox,
                { backgroundColor: LEAVE_COLORS.planned },
              ]}
            />
            <Text style={[styles.legendLabel, { color: colors.title }]}>
              Planned Leave
            </Text>
          </View>
          <View style={styles.legendItem}>
            <View
              style={[styles.legendBox, { backgroundColor: LEAVE_COLORS.sick }]}
            />
            <Text style={[styles.legendLabel, { color: colors.title }]}>
              Sick / Unplanned
            </Text>
          </View>
          <View style={styles.legendItem}>
            <View
              style={[
                styles.legendBox,
                { backgroundColor: LEAVE_COLORS.halfDay },
              ]}
            />
            <Text style={[styles.legendLabel, { color: colors.title }]}>
              Half-Day Leave
            </Text>
          </View>
        </View>

        {/* Spacing */}
        <View style={{ height: 30 }} />

        {/* Days Grid */}
        <View style={styles.daysContainerWrapper}>
          <FlatList
            data={daysInMonth}
            keyExtractor={(item) => item.toString()}
            numColumns={5}
            contentContainerStyle={styles.daysContainer}
            renderItem={({ item }) => {
              const status = dayStatuses[item];
              const circleColor = status
                ? LEAVE_COLORS[status.leaveType]
                : "#f3f3f3";
              return (
                <View style={styles.dayItemWrapper}>
                  {/* Day circle */}
                  <TouchableOpacity
                    style={[styles.dayItem, { backgroundColor: circleColor }]}
                    onPress={() => onPressDay(item)}
                  >
                    <Text style={styles.dayText}>{item}</Text>
                  </TouchableOpacity>

                  {/* Minus icon if a leave is assigned */}
                  {status?.id && (
                    <TouchableOpacity
                      style={styles.removeIcon}
                      onPress={() => handleRemoveLeave(item)}
                    >
                      <Text style={styles.removeIconText}>-</Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            }}
          />
        </View>

        {/* Leave-Type Selection Modal */}
        <Modal
          visible={leaveModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setLeaveModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.leaveModalContent,
                { backgroundColor: colors.background },
              ]}
            >
              <Text style={[styles.modalTitle, { color: colors.title }]}>
                Day {selectedDay} – {moment(selectedDate).format("MMMM YYYY")}
              </Text>
              <Text style={[styles.modalSubtitle, { color: colors.text }]}>
                Select leave type:
              </Text>

              <Pressable
                style={[
                  styles.leaveOptionButton,
                  { backgroundColor: colors.card },
                ]}
                onPress={() => handleSetLeaveForDay("planned")}
              >
                <Text style={[styles.leaveOptionText, { color: colors.title }]}>
                  Planned Leave
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.leaveOptionButton,
                  { backgroundColor: colors.card },
                ]}
                onPress={() => handleSetLeaveForDay("sick")}
              >
                <Text style={[styles.leaveOptionText, { color: colors.title }]}>
                  Sick / Unplanned
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.leaveOptionButton,
                  { backgroundColor: colors.card },
                ]}
                onPress={() => handleSetLeaveForDay("halfDay")}
              >
                <Text style={[styles.leaveOptionText, { color: colors.title }]}>
                  Half-Day Leave
                </Text>
              </Pressable>

              <Pressable
                style={styles.closeModalButton}
                onPress={() => setLeaveModalVisible(false)}
              >
                <Text style={{ color: "#fff" }}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        {/* Loader Overlay (full screen) */}
        {isLoading && (
          <View style={styles.loaderOverlay}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}
      </View>
    </>
  );
};

export default ManageAttendanceScreen;

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
});
