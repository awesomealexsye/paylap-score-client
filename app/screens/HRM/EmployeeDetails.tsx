import React, { useEffect, useState, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import Header from "../../layout/Header";
import { useTheme } from "@react-navigation/native";
import StorageService from "../../lib/StorageService";
import CONFIG from "../../constants/config";
import {
  useDeleteEmployeeMutation,
  useGetEmployeeDetailsQuery,
} from "../../redux/api/employee.api";
import { COLORS } from "../../constants/theme";
import { ActivityIndicator } from "react-native-paper";

type EmployeeDetailScreenProps = StackScreenProps<
  RootStackParamList,
  "EmployeeDetailScreen"
>;

const EmployeeDetailScreen: React.FC<EmployeeDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const employeeId = route.params;
  const { colors } = useTheme();

  const [credentials, setCredentials] = useState<{
    user_id: string | null;
    auth_key: string | null;
  } | null>(null);

  useEffect(() => {
    const fetchCredentials = async () => {
      const userIdStr = await StorageService.getStorage(
        CONFIG.HARDCODE_VALUES.USER_ID
      );
      const auth_key = await StorageService.getStorage(
        CONFIG.HARDCODE_VALUES.AUTH_KEY
      );
      setCredentials({ user_id: userIdStr, auth_key });
    };
    fetchCredentials();
  }, [employeeId]);

  const { data, isLoading, error } = useGetEmployeeDetailsQuery(
    {
      id: employeeId,
      user_id: credentials?.user_id,
      auth_key: credentials?.auth_key,
    },
    { skip: !credentials || !employeeId }
  );
  const employee = data?.data;

  const [deleteEmployee, { isLoading: isDeleting, error: deleteError }] =
    useDeleteEmployeeMutation();

  const handleDelete = useCallback(() => {
    if (credentials && employeeId) {
      deleteEmployee({ id: employeeId, employee: credentials }).unwrap();
      navigation.navigate("EmployeeListScreen");
    }
  }, [credentials, deleteEmployee, employeeId, navigation]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={70} color={COLORS.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={{ color: COLORS.danger }}>
          Error loading employee details.
        </Text>
      </View>
    );
  }

  return (
    <>
      <Header leftIcon="back" title="Employee Details" />
      <View style={styles.container}>
        {/* Employee Info */}
        <View style={styles.profileContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {employee?.name ? employee.name[0] : "?"}
            </Text>
          </View>
          <Text style={styles.role}>{employee?.name}</Text>
        </View>

        {/* Status & Employee ID */}
        <View style={styles.row}>
          <View style={[styles.box, { backgroundColor: colors.card }]}>
            <Text style={[styles.label, { color: colors.title }]}>
              Department
            </Text>
            <View style={styles.statusContainer}>
              <Text style={[styles.value, { color: colors.title }]}>
                {employee?.department}
              </Text>
            </View>
          </View>
          <View style={[styles.box, { backgroundColor: colors.card }]}>
            <Text style={[styles.label, { color: colors.title }]}>
              Designation
            </Text>
            <Text style={[styles.value, { color: colors.title }]}>
              {employee?.designation}
            </Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={[styles.box, { backgroundColor: colors.card }]}>
            <Text style={[styles.label, { color: colors.title }]}>
              Active Status
            </Text>
            <View style={styles.statusContainer}>
              <View
                style={[
                  styles.statusIndicator,
                  {
                    backgroundColor: employee?.status
                      ? COLORS.primary
                      : COLORS.danger,
                  },
                ]}
              />
              <Text style={[styles.value, { color: colors.title }]}>
                {employee?.status ? "Active" : "Inactive"}
              </Text>
            </View>
          </View>
          <View style={[styles.box, { backgroundColor: colors.card }]}>
            <Text style={[styles.label, { color: colors.title }]}>
              Employee ID
            </Text>
            <Text style={[styles.value, { color: colors.title }]}>
              {employee?.id}
            </Text>
          </View>
        </View>

        {/* Joining Date, Email & Contact */}
        <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Joining Date</Text>
            <Text style={styles.label}>Email Address</Text>
            <Text style={styles.label}>Contact No</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.value, { color: colors.title }]}>
              {employee?.joining_date}
            </Text>
            <Text style={[styles.value, { color: colors.title }]}>
              {employee?.email}
            </Text>
            <Text style={[styles.value, { color: colors.title }]}>
              {employee?.mobile}
            </Text>
          </View>
        </View>

        {/* Address */}
        <View style={[styles.workingCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.label, { color: colors.title }]}>Address</Text>
          <Text style={[styles.value, { color: colors.title }]}>
            {employee?.address}
          </Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}
            disabled={isDeleting}
          >
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("EditEmployee", employee)}
            style={styles.editButton}
          >
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default EmployeeDetailScreen;

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 15 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  profileContainer: { alignItems: "center", marginVertical: 15 },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#F4B183",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { fontSize: 24, color: "white", fontWeight: "bold" },
  role: { fontSize: 14, color: "#888", marginTop: 5 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  box: {
    flex: 1,
    backgroundColor: "white",
    padding: 15,
    margin: 5,
    borderRadius: 12,
    alignItems: "center",
  },
  label: { fontSize: 14, color: "#777", fontWeight: "bold" },
  value: { fontSize: 12, fontWeight: "bold", color: "#333" },
  infoCard: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 12,
    marginTop: 15,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  workingCard: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "#478DFF",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 5,
  },
  deleteText: { color: "white", fontWeight: "bold", fontSize: 16 },
  editButton: {
    flex: 1,
    backgroundColor: "#E5E7EB",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 5,
  },
  editText: { color: "#333", fontWeight: "bold", fontSize: 16 },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  statusIndicator: {
    height: 10,
    width: 10,
    borderRadius: 5,
    marginRight: 5,
  },
});
