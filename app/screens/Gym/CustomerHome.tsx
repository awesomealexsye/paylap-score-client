import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Platform,
  FlatList,
} from "react-native";
import Animated, {
  FadeInDown,
  FadeInRight,
  FadeIn,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import { useNavigation } from "@react-navigation/native";

// Types
type PaymentStatus = "PAID" | "PARTIAL" | "OVERDUE";

interface Transaction {
  id: string;
  gymName: string;
  totalFee: number;
  remainingFee: number;
  dueDate: string;
  joiningDate: string;
  status: PaymentStatus;
}

// Utility Functions
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

const getDaysRemaining = (dateString: string): number => {
  const dueDate = new Date(dateString);
  const today = new Date();
  dueDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const differenceInTime = dueDate.getTime() - today.getTime();
  return Math.ceil(differenceInTime / (1000 * 3600 * 24));
};

// Mock Data
const daysFromNow = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
};

const transactionData: Transaction[] = [
  {
    id: "1",
    gymName: "Fitness First",
    totalFee: 1200,
    remainingFee: 0,
    dueDate: daysFromNow(15),
    joiningDate: daysFromNow(-60),
    status: "PAID",
  },
  {
    id: "2",
    gymName: "Gold's Gym",
    totalFee: 1500,
    remainingFee: 500,
    dueDate: daysFromNow(5),
    joiningDate: daysFromNow(-30),
    status: "PARTIAL",
  },
  {
    id: "3",
    gymName: "Planet Fitness",
    totalFee: 800,
    remainingFee: 800,
    dueDate: daysFromNow(-3),
    joiningDate: daysFromNow(-15),
    status: "OVERDUE",
  },
  {
    id: "4",
    gymName: "Anytime Fitness",
    totalFee: 1000,
    remainingFee: 200,
    dueDate: daysFromNow(20),
    joiningDate: daysFromNow(-45),
    status: "PARTIAL",
  },
];

// Header Component
function Header({ title }: { title: string }) {
  return (
    <Animated.View entering={FadeIn.duration(300)}>
      <View style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{title}</Text>
        </View>
      </View>
    </Animated.View>
  );
}

// Search Bar Component
function SearchBar({
  value,
  onChangeText,
}: {
  value: string;
  onChangeText: (text: string) => void;
}) {
  return (
    <Animated.View
      style={styles.searchContainer}
      entering={FadeInDown.duration(400).delay(100)}
    >
      <View style={styles.searchInputContainer}>
        <Ionicons
          name="search-outline"
          size={20}
          color="#8E8E93"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search gyms..."
          placeholderTextColor="#A1A1A6"
          value={value}
          onChangeText={onChangeText}
        />
      </View>
    </Animated.View>
  );
}

// Status Badge Component
function StatusBadge({ status }: { status: PaymentStatus }) {
  const getStatusColor = () => {
    switch (status) {
      case "PAID":
        return { bg: "#E5FFF0", text: "#30D158" };
      case "PARTIAL":
        return { bg: "#FFF8E5", text: "#FF9F0A" };
      case "OVERDUE":
        return { bg: "#FFE5E5", text: "#FF453A" };
      default:
        return { bg: "#E5E5EA", text: "#8E8E93" };
    }
  };

  const statusColors = getStatusColor();

  return (
    <View style={[styles.badgeContainer, { backgroundColor: statusColors.bg }]}>
      <Text style={[styles.badgeText, { color: statusColors.text }]}>
        {status}
      </Text>
    </View>
  );
}

// Transaction Item Component
function TransactionItem({
  transaction,
  index,
  onApplyCoupon,
}: {
  transaction: Transaction;
  index: number;
  onApplyCoupon: (gymName: string) => void;
}) {
  const daysRemaining = getDaysRemaining(transaction.dueDate);
  const isPastDue = daysRemaining < 0;

  const navigation = useNavigation();
  return (
    <Animated.View
      style={styles.transactionItem}
      entering={FadeInRight.duration(300).delay(100 + index * 100)}
    >
      <TouchableOpacity onPress={() => navigation.navigate("CustomerDetails")}>
        <View style={styles.transactionRow}>
          <Text style={styles.gymName}>{transaction.gymName}</Text>
          <StatusBadge status={transaction.status} />
        </View>

        <View style={styles.transactionRow}>
          <View style={styles.transactionCol}>
            <Text style={styles.label}>Total Fee</Text>
            <Text style={styles.value}>
              {formatCurrency(transaction.totalFee)}
            </Text>
          </View>
          <View style={styles.transactionCol}>
            <Text style={styles.label}>Remaining</Text>
            <Text style={styles.value}>
              {formatCurrency(transaction.remainingFee)}
            </Text>
          </View>
        </View>

        <View style={styles.transactionRow}>
          <View style={styles.transactionCol}>
            <Text style={styles.label}>Joining Date</Text>
            <Text style={styles.value}>
              {formatDate(transaction.joiningDate)}
            </Text>
          </View>
          <View style={styles.transactionCol}>
            <Text style={styles.label}>Due Date</Text>
            <Text
              style={[
                styles.value,
                isPastDue
                  ? styles.pastDue
                  : daysRemaining <= 5
                  ? styles.nearDue
                  : null,
              ]}
            >
              {formatDate(transaction.dueDate)}
              {daysRemaining > 0 && (
                <Text style={styles.daysRemaining}>
                  {" "}
                  ({daysRemaining} days left)
                </Text>
              )}
              {daysRemaining < 0 && (
                <Text style={styles.pastDue}> (Overdue)</Text>
              )}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.couponButton}
        onPress={() => onApplyCoupon(transaction.gymName)}
      >
        <Ionicons name="calendar-outline" size={16} color="#0A84FF" />
        <Text style={styles.couponButtonText}>Attendence</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

// Transaction List Component
function TransactionList({
  transactions,
  onApplyCoupon,
}: {
  transactions: Transaction[];
  onApplyCoupon: (gymName: string) => void;
}) {
  return (
    <Animated.View
      style={styles.listContainer}
      entering={FadeInDown.duration(400).delay(200)}
    >
      <View style={styles.listHeader}>
        <View style={styles.listHeaderLeft}>
          <Ionicons name="card-outline" size={20} color="#0A84FF" />
          <Text style={styles.listTitle}>Transactions</Text>
        </View>
        <Text style={styles.viewAll}>View All</Text>
      </View>

      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <TransactionItem
            transaction={item}
            index={index}
            onApplyCoupon={onApplyCoupon}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      />
    </Animated.View>
  );
}

// Coupon Modal Component
function CouponModal({
  visible,
  onClose,
  gymName,
}: {
  visible: boolean;
  onClose: () => void;
  gymName: string;
}) {
  const [couponCode, setCouponCode] = useState("");

  const handleSubmit = () => {
    console.log("Submitting coupon:", couponCode, "for gym:", gymName);
    setCouponCode("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Apply Coupon</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close-outline" size={24} color="#8E8E93" />
            </TouchableOpacity>
          </View>

          <Text style={styles.modalGymName}>{gymName}</Text>

          <View style={styles.modalInputContainer}>
            <Ionicons
              name="pricetag-outline"
              size={20}
              color="#8E8E93"
              style={styles.modalIcon}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Enter coupon code"
              placeholderTextColor="#A1A1A6"
              value={couponCode}
              onChangeText={setCouponCode}
              autoCapitalize="characters"
            />
          </View>

          <TouchableOpacity
            style={[
              styles.modalButton,
              !couponCode && styles.modalButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={!couponCode}
          >
            <Text style={styles.modalButtonText}>APPLY COUPON</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// Main Screen Component
type CustomerHomeProps = StackScreenProps<RootStackParamList, "CustomerHome">;

export const CustomerHome = ({ navigation }: CustomerHomeProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGym, setSelectedGym] = useState("");

  const filteredTransactions = transactionData.filter((transaction) =>
    transaction.gymName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleApplyCoupon = (gymName: string) => {
    setSelectedGym(gymName);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Header title="Gym Management" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
        <TransactionList
          transactions={filteredTransactions}
          onApplyCoupon={handleApplyCoupon}
        />
      </ScrollView>
      <CouponModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        gymName={selectedGym}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  safeArea: {
    backgroundColor: "white",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: "0 2px 3px rgba(0, 0, 0, 0.1)",
      },
    }),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 60,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  searchContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    margin: 16,
    marginBottom: 8,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: "0 2px 3px rgba(0, 0, 0, 0.1)",
      },
    }),
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F9FB",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D1D6",
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: "#1C1C1E",
  },
  listContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    margin: 16,
    marginTop: 8,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: "0 2px 3px rgba(0, 0, 0, 0.1)",
      },
    }),
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },
  listHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  listTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
    color: "#1C1C1E",
  },
  viewAll: {
    fontSize: 14,
    color: "#0A84FF",
    fontWeight: "500",
  },
  separator: {
    height: 1,
    backgroundColor: "#F2F2F7",
    marginHorizontal: 16,
  },
  transactionItem: {
    padding: 16,
  },
  transactionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  transactionCol: {
    flex: 1,
  },
  gymName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    color: "#8E8E93",
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    fontWeight: "500",
    color: "#3C3C43",
  },
  pastDue: {
    color: "#FF453A",
  },
  nearDue: {
    color: "#FF9F0A",
  },
  daysRemaining: {
    fontSize: 12,
    color: "#8E8E93",
  },
  badgeContainer: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  couponButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F2F2F7",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 12,
  },
  couponButtonText: {
    color: "#0A84FF",
    fontWeight: "500",
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    width: "90%",
    maxWidth: 400,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
      web: {
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.25)",
      },
    }),
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  closeButton: {
    padding: 4,
  },
  modalGymName: {
    fontSize: 16,
    color: "#3C3C43",
    marginBottom: 24,
  },
  modalInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F9FB",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D1D6",
    paddingHorizontal: 12,
    marginBottom: 24,
  },
  modalIcon: {
    marginRight: 8,
  },
  modalInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: "#1C1C1E",
  },
  modalButton: {
    height: 48,
    borderRadius: 8,
    backgroundColor: "#0A84FF",
    justifyContent: "center",
    alignItems: "center",
  },
  modalButtonDisabled: {
    backgroundColor: "#0A84FF80",
  },
  modalButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
});
