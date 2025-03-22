import React, { useEffect, useState, useCallback } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    FlatList,
    ScrollView,
} from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import Header from "../../layout/Header";
import { useTheme } from "@react-navigation/native";
import StorageService from "../../lib/StorageService";
import CONFIG from "../../constants/config";
import {
    useGetEmployeeDetailsQuery,
    useDeleteEmployeeMutation,
} from "../../redux/api/employee.api";
import { COLORS } from "../../constants/theme";
import { ActivityIndicator } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

// If you have an update mutation for salary or employee data, import it here:
// import { useUpdateEmployeeMutation } from "../../redux/api/employee.api";

type ManageSalaryScreenProps = StackScreenProps<
    RootStackParamList,
    "ManageSalaryScreen"
>;

// Allowance item type
type AllowanceItem = {
    id: number;
    name: string;
    amount: string; // stored as string for easy TextInput binding
};

export const ManageSalaryScreen: React.FC<ManageSalaryScreenProps> = ({
    navigation,
    route,
}) => {
    // We receive the employee ID via route params
    const { employeeId } = route.params || {};
    const { colors } = useTheme();

    // Keep track of user credentials for API calls
    const [credentials, setCredentials] = useState<{
        user_id: string | null;
        auth_key: string | null;
    } | null>(null);

    // Fetch and store user credentials
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

    // Query employee details
    const { data, isLoading, error } = useGetEmployeeDetailsQuery(
        {
            id: employeeId,
            user_id: credentials?.user_id,
            auth_key: credentials?.auth_key,
        },
        { skip: !credentials || !employeeId }
    );

    // The employee data from the API
    const employee = data?.data;

    // OPTIONAL: If you have an update mutation for employee/salary, uncomment & use below:
    // const [updateEmployee] = useUpdateEmployeeMutation();

    // If you still want a delete function from here, you can keep it:
    const [deleteEmployee, { isLoading: isDeleting }] = useDeleteEmployeeMutation();

    // Salary state (editable). Basic, Deduction, and Total are fixed fields
    const [salaryData, setSalaryData] = useState({
        basicSalary: "",
        deduction: "",
        totalSalary: "",
    });

    // Dynamic allowances array
    const [allowances, setAllowances] = useState<AllowanceItem[]>([]);

    // Load existing salary data from API (if any)
    useEffect(() => {
        if (employee) {
            const loadedBasic = employee.basicSalary
                ? String(employee.basicSalary)
                : "";
            const loadedDeduction = employee.deduction
                ? String(employee.deduction)
                : "";

            // If your backend has custom allowances, you'd parse them here.
            // For demonstration, if there's a "bonus" field, treat it as a default allowance:
            const loadedAllowances: AllowanceItem[] = [];
            if (employee.bonus) {
                loadedAllowances.push({
                    id: Date.now(),
                    name: "Bonus",
                    amount: String(employee.bonus),
                });
            }

            // Initialize state
            setSalaryData({
                basicSalary: loadedBasic,
                deduction: loadedDeduction,
                totalSalary: "0", // will recalc below
            });
            setAllowances(loadedAllowances);
        }
    }, [employee]);

    // Recalculate total salary whenever Basic, Deduction, or allowances change
    useEffect(() => {
        const basic = parseFloat(salaryData.basicSalary) || 0;
        let deduc = parseFloat(salaryData.deduction) || 0;

        // Sum all allowances
        const totalAllowances = allowances.reduce((sum, item) => {
            return sum + (parseFloat(item.amount) || 0);
        }, 0);

        // If deduction is more than (basic + totalAllowances), clamp it
        const maxBeforeDeduction = basic + totalAllowances;
        if (deduc > maxBeforeDeduction) {
            deduc = maxBeforeDeduction;
            // Update deduction field
            setSalaryData((prev) => ({ ...prev, deduction: String(deduc) }));
        }

        // newTotal = (basic + allowances) - deduction
        let newTotal = maxBeforeDeduction - deduc;
        if (newTotal < 0) {
            newTotal = 0;
        }

        setSalaryData((prev) => ({
            ...prev,
            totalSalary: String(newTotal.toFixed(2)),
        }));
    }, [salaryData.basicSalary, salaryData.deduction, allowances]);

    // If you want to handle saving salary updates via an API, you can do so here:
    const handleSaveSalary = async () => {
        // if (!credentials || !employeeId) return;

        // Example payload (adjust to match your API):
        // const payload = {
        //   user_id: credentials.user_id,
        //   auth_key: credentials.auth_key,
        //   id: employeeId,
        //   basicSalary: salaryData.basicSalary,
        //   deduction: salaryData.deduction,
        //   totalSalary: salaryData.totalSalary,
        //   allowances: allowances.map((a) => ({
        //     name: a.name,
        //     amount: a.amount,
        //   })),
        // };

        // try {
        //   await updateEmployee(payload).unwrap();
        //   console.log("Salary updated successfully");
        // } catch (err) {
        //   console.log("Error updating salary:", err);
        // }

        console.log("Saving salary data:", { salaryData, allowances });
    };

    // Add a new dynamic allowance
    const addAllowance = () => {
        setAllowances((prev) => [
            ...prev,
            { id: Date.now(), name: "", amount: "" },
        ]);
    };

    // Remove an allowance
    const removeAllowance = (id: number) => {
        setAllowances((prev) => prev.filter((item) => item.id !== id));
    };

    // (Optional) If you still want to handle delete from here:
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

    // Render each allowance row
    const renderAllowanceItem = ({ item }: { item: AllowanceItem }) => {
        return (
            <View style={styles.allowanceRow}>
                {/* Allowance Name */}
                <TextInput
                    style={[
                        styles.allowanceNameInput,
                        { backgroundColor: colors.background || "#fff" },
                    ]}
                    placeholder="Allowance Name"
                    placeholderTextColor="#999"
                    value={item.name}
                    onChangeText={(val) =>
                        setAllowances((prev) =>
                            prev.map((obj) =>
                                obj.id === item.id ? { ...obj, name: val } : obj
                            )
                        )
                    }
                />

                {/* Allowance Amount */}
                <TextInput
                    style={[
                        styles.allowanceAmountInput,
                        { backgroundColor: colors.background || "#fff" },
                    ]}
                    placeholder="0"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                    value={item.amount}
                    onChangeText={(val) =>
                        setAllowances((prev) =>
                            prev.map((obj) =>
                                obj.id === item.id ? { ...obj, amount: val } : obj
                            )
                        )
                    }
                />

                {/* Delete Allowance Button */}
                <TouchableOpacity
                    style={styles.removeAllowanceBtn}
                    onPress={() => removeAllowance(item.id)}
                >
                    <Ionicons name="trash" size={20} color="#ff3b30" />
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <>
            <Header
                leftIcon="back"
                title="Manage Salary"
            // Optional: If you want top-right buttons, define a rightComponent prop here
            // rightComponent={...}
            />

            {/* Scrollable container */}
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Employee Basic Info (Optional) */}
                <View style={styles.employeeInfo}>
                    <Text style={styles.employeeName}>
                        {employee?.name || "Employee Name"}
                    </Text>
                    <Text style={styles.employeeId}>
                        ID: {employee?.id || "No ID"}
                    </Text>
                </View>

                {/* Salary Section */}
                <View style={[styles.salaryContainer, { backgroundColor: colors.card }]}>
                    <Text style={[styles.salaryTitle, { color: colors.title }]}>
                        Salary Details
                    </Text>

                    {/* Basic Salary */}
                    <View style={styles.salaryRow}>
                        <Text style={[styles.salaryLabel, { color: colors.title }]}>
                            Basic Salary
                        </Text>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={[
                                    styles.salaryInput,
                                    { backgroundColor: colors.background || "#fff" },
                                ]}
                                placeholder="0"
                                placeholderTextColor="#999"
                                keyboardType="numeric"
                                value={salaryData.basicSalary}
                                onChangeText={(val) =>
                                    setSalaryData((prev) => ({ ...prev, basicSalary: val }))
                                }
                            />
                        </View>
                    </View>

                    {/* ADD COMPONENT BUTTON */}
                    <TouchableOpacity style={styles.addComponentBtn} onPress={addAllowance}>
                        <Ionicons name="add-circle-outline" size={18} color="#478DFF" />
                        <Text style={styles.addComponentText}>Add Component</Text>
                    </TouchableOpacity>

                    {/* Dynamic Allowances List */}
                    <FlatList
                        data={allowances}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderAllowanceItem}
                        style={{ marginBottom: 10 }}
                        scrollEnabled={false} // parent ScrollView handles scrolling
                    />

                    {/* Deduction */}
                    <View style={styles.salaryRow}>
                        <Text style={[styles.salaryLabel, { color: colors.title }]}>
                            Deduction
                        </Text>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={[
                                    styles.salaryInput,
                                    { backgroundColor: colors.background || "#fff" },
                                ]}
                                placeholder="0"
                                placeholderTextColor="#999"
                                keyboardType="numeric"
                                value={salaryData.deduction}
                                onChangeText={(val) =>
                                    setSalaryData((prev) => ({ ...prev, deduction: val }))
                                }
                            />
                        </View>
                    </View>

                    {/* Total Salary (auto-calculated) */}
                    <View style={styles.salaryRow}>
                        <Text style={[styles.salaryLabel, { color: colors.title }]}>
                            Total Salary
                        </Text>
                        <View style={[styles.inputWrapper, { backgroundColor: "#eee" }]}>
                            <TextInput
                                style={[styles.salaryInput, { backgroundColor: "#eee" }]}
                                placeholder="0"
                                placeholderTextColor="#999"
                                keyboardType="numeric"
                                value={salaryData.totalSalary}
                                editable={false} // read-only
                            />
                        </View>
                    </View>

                    {/* Button to save Salary data */}
                    <TouchableOpacity style={styles.saveSalaryButton} onPress={handleSaveSalary}>
                        <Text style={styles.saveSalaryButtonText}>Save Salary</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </>
    );
};

export default ManageSalaryScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 15,
        paddingBottom: 40,
    },

    loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
    errorContainer: { flex: 1, justifyContent: "center", alignItems: "center" },

    // Employee Info (optional)
    employeeInfo: {
        alignItems: "center",
        marginTop: 20,
        marginBottom: 10,
    },
    employeeName: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    employeeId: {
        fontSize: 12,
        color: "#777",
        marginTop: 4,
    },

    // Salary Section
    salaryContainer: {
        marginTop: 15,
        padding: 15,
        borderRadius: 12,
    },
    salaryTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 15,
    },
    salaryRow: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 8,
        justifyContent: "space-between",
    },
    salaryLabel: {
        fontSize: 14,
        fontWeight: "600",
        width: "40%",
    },
    inputWrapper: {
        flex: 1,
        marginLeft: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#E0E0E0",
        backgroundColor: "#F5F5F5",
        overflow: "hidden",
    },
    salaryInput: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        fontSize: 14,
        textAlign: "right",
    },
    addComponentBtn: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 10,
    },
    addComponentText: {
        marginLeft: 6,
        fontSize: 14,
        color: "#478DFF",
        fontWeight: "600",
    },
    saveSalaryButton: {
        backgroundColor: "#478DFF",
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: "center",
        marginTop: 20,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    saveSalaryButtonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },

    // Dynamic Allowances
    allowanceRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    allowanceNameInput: {
        flex: 2,
        borderWidth: 1,
        borderColor: "#E0E0E0",
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 8,
        marginRight: 8,
    },
    allowanceAmountInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#E0E0E0",
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 8,
        textAlign: "right",
        marginRight: 8,
    },
    removeAllowanceBtn: {
        padding: 6,
    },
});