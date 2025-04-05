import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import Header from "../../layout/Header";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import { ApiService } from "../../lib/ApiService"; // <-- Import your API service
import { COLORS } from "../../constants/theme";

type Props = StackScreenProps<
  RootStackParamList,
  "GenerateEmployeePdfListScreen"
>;

type EmployeeSalary = {
  id: number;
  name: string;
  total_salary: string; // from the new API
  salary_pdf_url: string; // from the new API
};

const GenerateEmployeePdfListScreen: React.FC<Props> = ({
  navigation,
  route,
}) => {
  const { colors } = useTheme();

  // We get the user_ids and salary_date from route params
  const dataParam = route.params?.data;
  const employees_ids = dataParam?.employees_ids || [];
  const salary_date = dataParam?.salary_date || "";

  // State to hold the API data
  const [employeeList, setEmployeeList] = useState<EmployeeSalary[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch data from the new API
  const fetchEmployeeSalaryList = async () => {
    setIsLoading(true);
    console.log({
      salary_date: salary_date,
      user_ids: employees_ids,
    });
    try {
      const response = await ApiService.postWithToken(
        "api/employee/employee-salary-list",
        {
          salary_date: salary_date,
          user_ids: employees_ids,
        }
      );
      if (response?.data) {
        setEmployeeList(response.data);
      }
    } catch (error) {
      console.error("Error fetching employee salaries:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployeeSalaryList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Render each employee row
  const renderEmployeeItem = ({ item }: { item: EmployeeSalary }) => (
    <View style={[styles.itemContainer, { backgroundColor: colors.card }]}>
      {/* We keep the placeholder image from previous logic */}
      {/* <Image
        source={{ uri: "https://placehold.co/200/jpg" }}
        style={styles.profileImage}
      /> */}
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.name ? item.name[0] : "E"}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
        <Text style={[styles.salary, { color: colors.text }]}>
          {item.total_salary}
        </Text>
      </View>
      {/* PDF icon on the right - existing functionality */}
      <TouchableOpacity
        onPress={() => {
          console.log("itemss", item);
          // Hardcoded pdf_url example; adapt as needed
          navigation.navigate("FinalInvoiceResult", {
            data: {
              pdf_url:
                item.salary_pdf_url ||
                "https://paynest.co.in/api/invoice?invoice_id=MTAwMDUz",
            },
            previous_screen: "GenerateEmployeePdfListScreen",
          });
        }}
      >
        <MaterialCommunityIcons
          name="file-pdf-box"
          size={28}
          color={COLORS.danger}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.wrapper}>
      {/* Header */}
      <Header leftIcon="back" title="PDF Salaries" />

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size={50} color="#4CAF50" />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <FlatList
            data={employeeList}
            renderItem={renderEmployeeItem}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
          />
        </ScrollView>
      )}
    </View>
  );
};

export default GenerateEmployeePdfListScreen;

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
    paddingBottom: 30,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 10,
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
  salary: {
    fontSize: 14,
    fontWeight: "400",
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { fontSize: 22, color: "white", fontWeight: "bold" },
});
