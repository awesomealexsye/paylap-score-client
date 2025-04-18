import React, { useCallback, useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Alert,
    Image,
} from "react-native";
import { useFocusEffect, useTheme } from "@react-navigation/native";
import {
    useGetCompanyListMutation,
    useDeleteCompanyMutation,
} from "../../redux/api/company.api";
import StorageService from "../../lib/StorageService";
import CONFIG from "../../constants/config";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { COLORS } from "../../constants/theme";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import { ApiService } from "../../lib/ApiService";

type HRMCompanyListScreenProps = StackScreenProps<
    RootStackParamList,
    "HRMCompanyListScreen"
>;

const HRMCompanyListScreen = ({ navigation }: HRMCompanyListScreenProps) => {
    const theme = useTheme();
    const { colors }: { colors: any } = theme;

    const [getCompanyList] = useGetCompanyListMutation();
    const [deleteCompany] = useDeleteCompanyMutation();

    // Store user credentials from AsyncStorage
    const [credentials, setCredentials] = useState<{
        user_id: string | null;
        auth_key: string | null;
    } | null>(null);

    // State for the list of companies
    const [companyData, setCompanyData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [otpInfo, setOtpInfo] = useState('');

    // State for form validation errors
    const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string }>({});

    // Fetch credentials on mount
    useEffect(() => {
        const fetchCredentials = async () => {
            const user_id = await StorageService.getStorage(
                CONFIG.HARDCODE_VALUES.USER_ID
            );
            const auth_key = await StorageService.getStorage(
                CONFIG.HARDCODE_VALUES.AUTH_KEY
            );
            setCredentials({ user_id, auth_key });
        };
        fetchCredentials();
    }, []);

    // Fetch companies once we have credentials
    // useEffect(() => {
    //     if (credentials?.user_id && credentials?.auth_key) {
    //         fetchCompanies();
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [credentials]);

    useFocusEffect(
        useCallback(() => {
            if (credentials?.user_id && credentials?.auth_key) {
                fetchCompanies();
            }
        }, [credentials])
    );



    // Fetch companies from the API
    const fetchCompanies = async () => {
        setLoading(true);
        try {
            const payload = {
                user_id: credentials?.user_id,
                auth_key: credentials?.auth_key,
            };
            const response = await getCompanyList(payload).unwrap();
            // Adjust based on your API’s actual response structure
            if (response?.data) {
                setCompanyData(response.data);
            } else {
                setCompanyData([]);
            }
        } catch (error) {
            console.error("Error fetching companies:", error);
        } finally {
            setLoading(false);
        }
    };

    // Validate form fields
    const validateForm = (name: string, email: string, phone: string) => {
        const newErrors: { name?: string; email?: string; phone?: string } = {};
        if (!name) newErrors.name = "Company name is required.";
        if (!email) newErrors.email = "Email is required.";
        if (!phone) newErrors.phone = "Phone number is required.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle creating a company
    const handleCreateCompany = async (name: string, email: string, phone: string) => {
        if (!validateForm(name, email, phone)) return;

        // Existing logic to create a company...
    };

    const sentOtp = async () => {
        const res = await ApiService.postWithToken(
            `api/hrm/companies/sent-otp-to-delete`, {})
        console.log("res", res);
        if (res.status === 200) {
            Alert.alert("Success", "OTP sent to your mobile number.");
        }
    }

    // Handle deleting a company
    const handleDelete = (companyId: number) => {
        console.log("Deleting company with ID:", companyId);
        if (!credentials) return;
        sentOtp()
        Alert.prompt(
            "OTP Verification",
            "Enter the OTP sent to your mobile number",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async (otp) => {
                        if (!otp) {
                            Alert.alert("Error", "OTP is required to delete the company.");
                            return;
                        }
                        setOtpInfo(otp);
                        try {
                            await ApiService.postWithToken(
                                `api/hrm/companies/delete/${companyId}`, {
                                otp: otp,
                            })
                            // Refresh the list
                            fetchCompanies();
                        } catch (err) {
                            console.error("Error deleting company:", err);
                            Alert.alert("Error", "Failed to delete company. Please try again.");
                        }
                    },
                },
            ],
            "plain-text"
        );
    };

    // Render each company item
    const renderCompanyItem = ({ item }: { item: any }) => {
        // Grab first letter of company name, default to 'C'
        const firstLetter = item?.name?.[0]?.toUpperCase() || "C";

        return (
            <View style={[styles.card, { backgroundColor: colors.card }]}>
                {/* Avatar on the left */}
                <View style={styles.avatar}>
                    {/* <Text style={{}}>{JSON.stringify(item.image)}</Text> */}
                    <Image style={{ height: 40, width: 40, borderRadius: 50 }}
                        src={`${CONFIG.APP_URL}/uploads/companies/${item.image}`} />

                </View>

                {/* Main content */}
                <View style={styles.cardContent}>
                    <Text style={[styles.companyName, { color: colors.title }]}>
                        {item?.name || "N/A"}
                    </Text>
                    <Text style={[styles.companyInfo, { color: colors.title }]}>
                        {item?.email || "N/A"}
                    </Text>
                    <Text style={[styles.companyInfo, { color: colors.title }]}>
                        {item?.phone || "N/A"}
                    </Text>
                </View>

                {/* Delete button on the far right */}
                <TouchableOpacity
                    style={[styles.deleteButton, { backgroundColor: "blue" }]}
                    onPress={() => navigation.navigate("HRMAddCompany", { company: item })}
                >
                    <FontAwesome5 name="edit" size={16} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.deleteButton, { backgroundColor: "red" }]}
                    onPress={() => handleDelete(item.id)}
                >
                    <FontAwesome5 name="trash" size={16} color="#fff" />
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {/* Header with back button */}
            <View style={[styles.header, { backgroundColor: colors.card }]}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <MaterialIcons name="arrow-back" size={24} color={colors.title} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.title }]}>
                    Company List
                </Text>
            </View>

            {/* Scrollable list of companies */}
            {companyData.length !== 0 ? (
                <FlatList
                    data={companyData}
                    keyExtractor={(item, index) =>
                        item?.id?.toString() || index.toString()
                    }
                    renderItem={renderCompanyItem}
                    onRefresh={fetchCompanies}
                    refreshing={loading}
                    contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 16 }}
                />

            ) : <>
                <Text style={{ textAlign: 'center', fontSize: 14 }} >No Company List...</Text>
            </>
            }

            {/* Floating 'Create New Company' button (moved to right side) */}
            <TouchableOpacity
                style={styles.floatingButton}
                onPress={() => navigation.navigate("HRMAddCompany", { company: null })}
            >
                <FontAwesome5 name="plus" size={20} color="#fff" />
            </TouchableOpacity>
        </View>
    );
};

export default HRMCompanyListScreen;

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        elevation: 2,
    },
    backButton: {
        position: "absolute",
        left: 16,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginRight: 40,
    },
    card: {
        flexDirection: "row",
        borderRadius: 8,
        marginVertical: 8,
        padding: 12,
        alignItems: "center",
        elevation: 2,
        justifyContent: "flex-start",
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: COLORS.primary,
        justifyContent: "center",
        alignItems: "center",
    },
    avatarText: { fontSize: 18, color: "white", fontWeight: "bold" },
    cardContent: {
        flex: 1,
        paddingRight: 15, // extra spacing before the delete button
        paddingLeft: 19, // extra spacing before the delete button
    },
    companyName: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 4,
    },
    companyInfo: {
        fontSize: 14,
        opacity: 0.7,
    },
    deleteButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    floatingButton: {
        position: "absolute",
        bottom: 20,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: COLORS.primary,
        alignItems: "center",
        justifyContent: "center",
        elevation: 4,
    },

});