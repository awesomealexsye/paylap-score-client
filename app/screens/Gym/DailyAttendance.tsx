import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Share,
  Alert,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { Feather } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import Header from "../../layout/Header";

const generateDailyCode = () => {
  const now = new Date();
  const datePart = now.toISOString().split("T")[0]; // e.g. 2025-05-17
  return `GYM-${datePart.replace(/-/g, "")}`; // GYM-20250517
};

type DailyAttendanceProps = StackScreenProps<
  RootStackParamList,
  "DailyAttendance"
>;

export const DailyAttendance = ({ navigation }: DailyAttendanceProps) => {
  const dailyCode = generateDailyCode();

  const handleCopy = async () => {
    await Clipboard.setStringAsync(dailyCode);
    Alert.alert("Copied", "Code copied to clipboard");
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Today's Gym Attendance Code: ${dailyCode}`,
      });
    } catch (error) {
      Alert.alert("Error", "Unable to share the code");
    }
  };

  return (
    <>
      <Header title={"Daily Attendance"} leftIcon="back" />
      <View style={styles.container}>
        <Text style={styles.heading}>Attendance QR Code</Text>

        <View style={styles.qrCard}>
          <QRCode value={dailyCode} size={200} />
          <Text style={styles.qrLabel}>Scan to Mark Attendance</Text>
        </View>

        <View style={styles.codeContainer}>
          <Text style={styles.codeTitle}>Today’s Code</Text>
          <Text style={styles.codeText}>{dailyCode}</Text>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionButton} onPress={handleCopy}>
              <Feather name="copy" size={20} color="#374151" />
              <Text style={styles.actionText}>Copy</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
              <Feather name="share-2" size={20} color="#374151" />
              <Text style={styles.actionText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.footerNote}>
          Generate a new code every day for secure check-ins.
        </Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    padding: 20,
    alignItems: "center",
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
    marginVertical: 20,
    color: "#111827",
  },
  qrCard: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 16,
    elevation: 5,
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  qrLabel: {
    marginTop: 12,
    fontSize: 14,
    color: "#6B7280",
  },
  codeContainer: {
    backgroundColor: "#E5E7EB",
    padding: 16,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
  },
  codeTitle: {
    fontSize: 16,
    color: "#4B5563",
    marginBottom: 4,
  },
  codeText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  actions: {
    flexDirection: "row",
    gap: 16,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  actionText: {
    marginLeft: 6,
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
  },
  footerNote: {
    fontSize: 13,
    color: "#9CA3AF",
    marginTop: 24,
    textAlign: "center",
  },
});
