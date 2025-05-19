import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { FontAwesome5, Ionicons, Feather } from "@expo/vector-icons";

import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import Header from "../../layout/Header";

// Types
type PaymentStatus = "PAID" | "PARTIAL" | "OVERDUE";
type PackageType = "BASIC" | "PREMIUM" | "PRO";

interface Transaction {
  id: string;
  gymName: string;
  totalFee: number;
  remainingFee: number;
  dueDate: string;
  joiningDate: string;
  status: PaymentStatus;
  paymentHistory: Payment[];
  gymDetails: GymDetails;
  package: PackageDetails;
}

interface Payment {
  id: string;
  amount: number;
  date: string;
  method: string;
}

interface GymDetails {
  address: string;
  phone: string;
  email: string;
  openingHours: string;
  facilities: string[];
}

interface PackageDetails {
  type: PackageType;
  duration: string;
  features: string[];
  price: number;
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
    paymentHistory: [
      { id: "p1", amount: 600, date: daysFromNow(-45), method: "Credit Card" },
      { id: "p2", amount: 600, date: daysFromNow(-30), method: "Credit Card" },
    ],
    gymDetails: {
      address: "123 Fitness Street, New York, NY 10001",
      phone: "+1 (555) 123-4567",
      email: "info@fitnessfirst.com",
      openingHours: "Mon-Sun: 6:00 AM - 10:00 PM",
      facilities: [
        "Cardio Area",
        "Weight Training",
        "Swimming Pool",
        "Sauna",
        "Group Classes",
      ],
    },
    package: {
      type: "PREMIUM",
      duration: "12 months",
      features: [
        "Unlimited Access",
        "Personal Trainer",
        "Group Classes",
        "Pool Access",
        "Sauna Access",
        "Locker Storage",
      ],
      price: 1200,
    },
  },
  // ... other transactions with similar structure
];

type CustomerDetailsProps = StackScreenProps<
  RootStackParamList,
  "CustomerDetails"
>;

export const CustomerDetails = ({ navigation }: CustomerDetailsProps) => {
  const transaction = transactionData.find((t) => t.id === "1");

  if (!transaction) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            //onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#0A84FF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Gym Details</Text>
        </View>
        <Text style={styles.errorText}>Transaction not found</Text>
      </View>
    );
  }

  const daysRemaining = getDaysRemaining(transaction.dueDate);
  const isPastDue = daysRemaining < 0;
  const totalPaid = transaction.paymentHistory.reduce(
    (sum, payment) => sum + payment.amount,
    0
  );

  return (
    <View style={styles.container}>
      {/* <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#0A84FF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gym Details</Text>
      </View> */}
      <Header leftIcon="back" title="Gym Details" />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={styles.detailsCard}
          entering={FadeInDown.duration(400)}
        >
          <Text style={styles.gymName}>{transaction.gymName}</Text>

          {/* Gym Details Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <FontAwesome5 name="dumbbell" size={20} color="#0A84FF" />
              <Text style={styles.sectionTitle}>Gym Information</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoText}>
                {transaction.gymDetails.address}
              </Text>
              <Text style={styles.infoText}>
                {transaction.gymDetails.phone}
              </Text>
              <Text style={styles.infoText}>
                {transaction.gymDetails.email}
              </Text>
              <Text style={styles.infoText}>
                {transaction.gymDetails.openingHours}
              </Text>
              <View style={styles.facilitiesList}>
                <Text style={styles.facilitiesTitle}>Facilities:</Text>
                {transaction.gymDetails.facilities.map((facility, index) => (
                  <Text key={index} style={styles.facilityItem}>
                    • {facility}
                  </Text>
                ))}
              </View>
            </View>
          </View>

          {/* Package Details Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Feather name="package" size={20} color="#0A84FF" />
              <Text style={styles.sectionTitle}>Package Details</Text>
            </View>
            <View style={styles.packageCard}>
              <View style={styles.packageHeader}>
                <Text style={styles.packageType}>
                  {transaction.package.type}
                </Text>
                <Text style={styles.packageDuration}>
                  {transaction.package.duration}
                </Text>
              </View>
              <View style={styles.packageFeatures}>
                {transaction.package.features.map((feature, index) => (
                  <Text key={index} style={styles.featureItem}>
                    • {feature}
                  </Text>
                ))}
              </View>
              <Text style={styles.packagePrice}>
                {formatCurrency(transaction.package.price)}
              </Text>
            </View>
          </View>

          {/* Payment Summary */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Amount</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(transaction.totalFee)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Paid</Text>
              <Text style={[styles.summaryValue, { color: "#30D158" }]}>
                {formatCurrency(totalPaid)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Remaining Balance</Text>
              <Text style={[styles.summaryValue, { color: "#FF453A" }]}>
                {formatCurrency(transaction.remainingFee)}
              </Text>
            </View>
          </View>

          {/* Payment History */}
          <View style={styles.paymentHistorySection}>
            <Text style={styles.sectionTitle}>Payment History</Text>
            {transaction.paymentHistory.length > 0 ? (
              transaction.paymentHistory.map((payment) => (
                <View key={payment.id} style={styles.paymentItem}>
                  <View style={styles.paymentLeft}>
                    <Feather name="credit-card" size={20} color="#0A84FF" />
                    <View style={styles.paymentInfo}>
                      <Text style={styles.paymentMethod}>{payment.method}</Text>
                      <Text style={styles.paymentDate}>
                        {formatDate(payment.date)}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.paymentAmount}>
                    {formatCurrency(payment.amount)}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.noPayments}>
                No payment history available
              </Text>
            )}
          </View>
        </Animated.View>
      </ScrollView>

      <Animated.View style={styles.bottomBar} entering={FadeIn.duration(300)}>
        <TouchableOpacity style={styles.downloadButton}>
          <Feather name="download" size={24} color="white" />
          <Text style={styles.downloadButtonText}>Download Invoice</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  header: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    height: 60,
    paddingHorizontal: 16,
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
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  scrollView: {
    flex: 1,
  },
  detailsCard: {
    backgroundColor: "white",
    borderRadius: 16,
    margin: 16,
    padding: 20,
    marginBottom: 100,
  },
  gymName: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1C1C1E",
    marginLeft: 8,
  },
  infoCard: {
    backgroundColor: "#F9F9FB",
    borderRadius: 12,
    padding: 16,
  },
  infoText: {
    fontSize: 15,
    color: "#3C3C43",
    marginBottom: 8,
  },
  facilitiesList: {
    marginTop: 8,
  },
  facilitiesTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#3C3C43",
    marginBottom: 8,
  },
  facilityItem: {
    fontSize: 15,
    color: "#3C3C43",
    marginLeft: 8,
    marginBottom: 4,
  },
  packageCard: {
    backgroundColor: "#F9F9FB",
    borderRadius: 12,
    padding: 16,
  },
  packageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  packageType: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0A84FF",
  },
  packageDuration: {
    fontSize: 14,
    color: "#8E8E93",
  },
  packageFeatures: {
    marginBottom: 12,
  },
  featureItem: {
    fontSize: 15,
    color: "#3C3C43",
    marginBottom: 4,
  },
  packagePrice: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1C1C1E",
    textAlign: "right",
  },
  summaryCard: {
    backgroundColor: "#F9F9FB",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: "#8E8E93",
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  paymentHistorySection: {
    borderTopWidth: 1,
    borderTopColor: "#F2F2F7",
    paddingTop: 20,
  },
  paymentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },
  paymentLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  paymentInfo: {
    marginLeft: 12,
  },
  paymentMethod: {
    fontSize: 16,
    color: "#1C1C1E",
    marginBottom: 4,
  },
  paymentDate: {
    fontSize: 14,
    color: "#8E8E93",
  },
  paymentAmount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#30D158",
  },
  noPayments: {
    fontSize: 16,
    color: "#8E8E93",
    textAlign: "center",
    fontStyle: "italic",
    marginTop: 12,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#F2F2F7",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: "0 -2px 3px rgba(0, 0, 0, 0.1)",
      },
    }),
  },
  downloadButton: {
    backgroundColor: "#0A84FF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
  },
  downloadButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  errorText: {
    fontSize: 16,
    color: "#FF453A",
    textAlign: "center",
    marginTop: 20,
  },
});
