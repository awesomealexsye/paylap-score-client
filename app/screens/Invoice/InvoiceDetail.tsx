import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import * as WebBrowser from "expo-web-browser";
import { FontAwesome } from "@expo/vector-icons";

import { RootStackParamList } from "../../navigation/RootStackParamList";
import { COLORS } from "../../constants/theme";
import Header from "../../layout/Header";
import { ApiService } from "../../lib/ApiService";
import { MessagesService } from "../../lib/MessagesService";

type InvoiceDetailProps = StackScreenProps<RootStackParamList, "InvoiceDetail">;

export const InvoiceDetail = ({ navigation, route }: InvoiceDetailProps) => {
  const theme = useTheme();
  const { colors } = theme;

  const [isLoading, setIsLoading] = useState(false);

  // Get invoiceId from route parameters
  const invoiceId = route.params?.invoice_id;

  // Status colors for invoice status tag
  const statusColors: any = {
    Unpaid: COLORS.danger,
    Overdue: COLORS.primaryLight,
    Paid: COLORS.primary,
  };

  // State for invoice detail (fetched from API)
  const [invoice, setInvoice] = useState<any>(null);
  // State for received amount logs
  const [receivedLogs, setReceivedLogs] = useState<
    {
      id: number;
      amount: number;
      created_at: string;
      created_at_new: string;
      pdf_url: string;
    }[]
  >([]);
  // State for pending amount modal/input
  const [modalVisible, setModalVisible] = useState(false);
  const [pendingAmount, setPendingAmount] = useState("");
  // Loading state for invoice detail
  const [loading, setLoading] = useState(true);

  // Fetch invoice detail from API
  const fetchInvoiceDetail = async () => {
    try {
      const res = await ApiService.postWithToken(
        "api/invoice-generator/invoice/invoice-detail",
        {
          gen_user_invoice_id: invoiceId,
        }
      );
      console.log("Rsss", res.data);
      if (res.status) {
        setInvoice(res.data);
      } else {
        Alert.alert("Error", res.message || "Failed to fetch invoice detail");
      }
    } catch (error) {
      console.error("Error fetching invoice detail", error);
      Alert.alert(
        "Error",
        "Something went wrong while fetching invoice detail."
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch received-amount-log data from the API
  const fetchReceivedLogs = async () => {
    try {
      const logsRes = await ApiService.postWithToken(
        "api/invoice-generator/invoice/received-amount-log",
        {
          gen_user_invoice_id: invoiceId,
        }
      );
      if (logsRes.status) {
        setReceivedLogs(logsRes.data);
      } else {
        Alert.alert("Error", logsRes.message || "Failed to fetch logs");
      }
    } catch (error) {
      console.error("Error fetching received logs", error);
      Alert.alert("Error", "Something went wrong while fetching logs.");
    }
  };

  // Submit the pending amount via API and update logs.
  const submitPendingAmount = async () => {
    if (!pendingAmount || isNaN(parseFloat(pendingAmount))) {
      Alert.alert("Invalid Amount", "Please enter a valid amount.");
      return;
    }
    setIsLoading(true);
    ApiService.postWithToken(
      "api/invoice-generator/invoice/invoice-amount-update",
      {
        gen_user_invoice_id: invoiceId,
        amount: parseFloat(pendingAmount),
      }
    ).then((res) => {
      setIsLoading(false);
      if (res.status) {
        fetchInvoiceDetail();
        fetchReceivedLogs();
        setPendingAmount("");
        setModalVisible(false);
      }
    });
  };

  // Function to open the PDF if needed.
  const openPDF = async () => {
    navigation.replace("FinalInvoiceResult", {
      data: { pdf_url: invoice.pdf_url },
      previous_screen: "InvoiceDetail",
    });
  };

  // Parse item_info string into an array.
  const parseItems = (): any[] => {
    if (!invoice || !invoice.item_info) return [];
    try {
      return JSON.parse(invoice.item_info);
    } catch (error) {
      console.error("Error parsing item_info", error);
      return [];
    }
  };

  useEffect(() => {
    // Fetch the invoice detail when the component mounts.
    fetchInvoiceDetail();
  }, []);

  useEffect(() => {
    // When invoice detail is loaded, fetch the received logs.
    if (invoice) {
      fetchReceivedLogs();
    }
  }, [invoice]);

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!invoice) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <Text style={{ color: "#555", fontSize: 16 }}>
          Invoice detail not available.
        </Text>
      </View>
    );
  }

  const items = parseItems();
  const showPdf = (item: object) => {
    console.log("itemss", item);
    navigation.navigate("FinalInvoiceResult", {
      data: { pdf_url: item.pdf_url },
      previous_screen: "ChooseInvoiceDesign",
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Invoice Detail" leftIcon="back" titleRight />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            width: "100%",
            marginBottom: 10,
          }}
        >
          <View
            style={[
              styles.statusTag,
              { backgroundColor: statusColors[invoice.invoice_status] },
            ]}
          >
            <Text style={styles.statusText}>{invoice.invoice_status}</Text>
          </View>
          {parseFloat(invoice.full_amount_received) === 0 && (
            <View style={styles.paymentIcon}>
              <TouchableOpacity
                onPress={() => setModalVisible(true)}
                style={styles.pendingButton}
              >
                <FontAwesome name="plus" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          )}

          {/* Invoice Header */}
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Text style={styles.invoiceTitle}>Invoice #{invoice.id}</Text>
          <Text style={[styles.invoiceDate, { color: colors.title }]}>
            Date: {invoice.created_at_new}
          </Text>
        </View>
        <View style={styles.divider} />

        {/* Company and Client Info Section */}
        <View style={styles.infoRow}>
          <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.infoHeader, { color: colors.title }]}>
              Company
            </Text>
            <Image
              source={{
                uri: invoice.company_image + invoice.company_info.image,
              }}
              style={styles.infoImage}
            />
            <Text style={[styles.infoName, { color: colors.title }]}>
              {invoice.company_info.name}
            </Text>
            <Text style={[styles.infoDetail, { color: colors.title }]}>
              {invoice.company_info.email}
            </Text>
            <Text style={[styles.infoDetail, { color: colors.title }]}>
              {invoice.company_info.phone}
            </Text>
          </View>
          <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.infoHeader, { color: colors.title }]}>
              Client
            </Text>
            <Image
              source={{ uri: invoice.client_image + invoice.client_info.image }}
              style={styles.infoImage}
            />
            <Text style={[styles.infoName, { color: colors.title }]}>
              {invoice.client_info.name}
            </Text>
            <Text style={[styles.infoDetail, { color: colors.title }]}>
              {invoice.client_info.email}
            </Text>
            <Text style={[styles.infoDetail, { color: colors.title }]}>
              {invoice.client_info.phone}
            </Text>
          </View>
        </View>

        {/* Amount Details */}
        <View style={[styles.itemCard, { backgroundColor: colors.card }]}>
          <View style={styles.amountRow}>
            <Text style={[styles.label, { color: colors.title }]}>
              Grand Total:
            </Text>
            <Text style={[styles.value, { color: colors.title }]}>
              ₹ {invoice.grand_total_amount}
            </Text>
          </View>
          <View style={styles.amountRow}>
            <Text style={[styles.label, { color: colors.title }]}>
              Received:
            </Text>
            <Text style={[styles.value, { color: colors.title }]}>
              ₹ {invoice.received_amount}
            </Text>
          </View>
          <View style={styles.amountRow}>
            <Text style={[styles.label, { color: colors.title }]}>
              Pending:
            </Text>
            <Text style={[styles.value, { color: colors.title }]}>
              ₹{" "}
              {(invoice.grand_total_amount - invoice.received_amount)?.toFixed(
                2
              )}
            </Text>
          </View>
          <View style={styles.amountRow}>
            <Text style={[styles.label, { color: colors.title }]}>
              Due Date:
            </Text>
            <Text style={[styles.value, { color: colors.title }]}>
              {invoice.expected_given_data}
            </Text>
          </View>
        </View>
        <View style={styles.divider} />

        {/* Items Details */}
        <Text style={styles.sectionHeader}>Items</Text>
        {items.map((item) => (
          <View
            key={item.id}
            style={[styles.itemCard, { backgroundColor: colors.card }]}
          >
            <View style={styles.itemHeader}>
              <Text style={[styles.itemTitle, { color: colors.title }]}>
                {item.title}
              </Text>
            </View>
            <View style={styles.itemDetailsRow}>
              <Text style={[styles.itemLabel, { color: colors.title }]}>
                Quantity:
              </Text>
              <Text style={[styles.itemValue, { color: colors.title }]}>
                {item.quantity}
              </Text>
            </View>
            <View style={styles.itemDetailsRow}>
              <Text style={[styles.itemLabel, { color: colors.title }]}>
                Price:
              </Text>
              <Text style={[styles.itemValue, { color: colors.title }]}>
                ₹ {item.price}
              </Text>
            </View>
            <View style={styles.itemDetailsRow}>
              <Text style={[styles.itemLabel, { color: colors.title }]}>
                Tax:
              </Text>
              <Text style={[styles.itemValue, { color: colors.title }]}>
                {item.tax}%
              </Text>
            </View>
            <View style={styles.itemDetailsRow}>
              <Text style={[styles.itemLabel, { color: colors.title }]}>
                Discount:
              </Text>
              <Text style={[styles.itemValue, { color: colors.title }]}>
                {item.discount}%
              </Text>
            </View>
            <View style={styles.itemDetailsRow}>
              <Text style={[styles.itemLabel, { color: colors.title }]}>
                Include Tax:
              </Text>
              <Text style={[styles.itemValue, { color: colors.title }]}>
                {item.includeTax ? "Yes" : "No"}
              </Text>
            </View>
            <View style={styles.itemDetailsRow}>
              <Text style={[styles.itemLabel, { color: colors.title }]}>
                Total:
              </Text>
              <Text style={[styles.itemValue, { color: colors.title }]}>
                ₹ {item.totalPrice?.toFixed(2)}
              </Text>
            </View>
          </View>
        ))}

        {/* Received Amount Log */}
        {receivedLogs.length > 0 ? (
          <View style={[styles.logContainer, { backgroundColor: colors.card }]}>
            <Text style={styles.sectionHeader}>Received Amount Log</Text>
            {receivedLogs.map((log) => (
              <View
                key={log.id}
                style={[styles.logRow, { backgroundColor: colors.background }]}
              >
                <Text style={styles.logText}>₹ {log.amount}</Text>
                <Text style={[styles.logTimestamp, { color: colors.title }]}>
                  {log.created_at_new}
                </Text>
                <TouchableOpacity
                  onPress={() => showPdf(log)}
                  style={styles.pendingButton}
                >
                  <FontAwesome name="file-pdf-o" size={12} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.noLogsText}>
            No received amount logs available.
          </Text>
        )}
      </ScrollView>

      {/* View PDF Button at Bottom Center */}
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity style={styles.pdfButtonCentered} onPress={openPDF}>
          <FontAwesome name="file-pdf-o" size={24} color="#fff" />
          <Text style={styles.pdfButtonCenteredText}>View PDF</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for adding pending amount */}
      <Modal
        transparent
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContainer,
              { backgroundColor: colors.background },
            ]}
          >
            <Text style={styles.modalTitle}>Enter Pending Amount</Text>
            <TextInput
              style={[
                styles.modalInput,
                { color: colors.title, backgroundColor: colors.card },
              ]}
              placeholderTextColor={colors.title}
              placeholder="Enter amount"
              keyboardType="numeric"
              value={pendingAmount}
              onChangeText={setPendingAmount}
            />
            <View style={styles.modalButtons}>
              {!isLoading ? (
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={submitPendingAmount}
                >
                  <Text style={styles.modalButtonText}>Submit</Text>
                </TouchableOpacity>
              ) : (
                <ActivityIndicator color={COLORS.title} size={"large"} />
              )}
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default InvoiceDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    alignItems: "center",
    paddingBottom: 10, // Extra bottom padding for PDF button
  },
  invoiceTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  statusTag: {
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 8,
  },
  statusText: {
    alignSelf: "flex-start",
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  invoiceDate: {
    alignSelf: "flex-start",
    fontSize: 12,
    color: "#666",
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    width: "100%",
    marginVertical: 15,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  pendingButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  pendingButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  logContainer: {
    marginTop: 20,
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: COLORS.primary,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
    paddingBottom: 5,
  },
  logRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#e3f2fd",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  logText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0277bd",
  },
  logTimestamp: {
    fontSize: 14,
    color: "#555",
  },
  noLogsText: {
    fontSize: 16,
    color: "#555",
    marginTop: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 15,
    textAlign: "center",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    color: "#333",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  modalButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  modalCancelButton: {
    backgroundColor: "#e53935",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  // Additional styles for info sections
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  infoCard: {
    width: "48%",
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  infoHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: COLORS.primary,
  },
  infoImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 5,
  },
  infoName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  infoDetail: {
    fontSize: 14,
    color: "#555",
  },
  amountContainer: {
    marginVertical: 10,
    width: "100%",
  },
  amountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
    width: "100%",
  },
  label: {
    fontSize: 16,
    color: "#333",
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  itemCard: {
    backgroundColor: "#f7faff",
    borderRadius: 10,
    top: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#d0e8ff",
    width: "100%",
  },
  itemHeader: {
    marginBottom: 10,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  itemDetailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 3,
  },
  itemLabel: {
    fontSize: 14,
    color: "#555",
  },
  itemValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
  paymentIcon: {
    borderRadius: 20,
  },
  bottomButtonContainer: {
    position: "absolute",
    width: "100%",
    height: 60,
    justifyContent: "center",
    bottom: 20,
    alignItems: "center",
  },
  pdfButtonCentered: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 10,
  },
  pdfButtonCenteredText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
});
