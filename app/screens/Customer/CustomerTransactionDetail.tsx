import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Linking, Platform, ActivityIndicator, Modal } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { COLORS, FONTS } from '../../constants/theme';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import ButtonIcon from '../../components/Button/ButtonIcon';
import CommonService from '../../lib/CommonService';

type CustomerTransationsDetailsScreenProps = StackScreenProps<RootStackParamList, 'CustomerTransationsDetails'>;

export const CustomerTransationsDetails = ({ navigation, route }: CustomerTransationsDetailsScreenProps) => {
    const { customer } = route.params;
    const theme = useTheme();
    const { colors } = theme;
    const [modalVisible, setModalVisible] = useState(false);
    const [isImageLoading, setImageLoading] = useState(true); // Image loading state

    const handlePreview = () => {
        setModalVisible(true);
    };

    const send_sms = () => {
        CommonService.currentUserDetail().then((res) => {
            const defaultMessage = `Dear Sir / Madam, Your payment of ₹ ${customer.amount} is pending at ${res.name}(${res.mobile}). Open Paylapscore app for viewing the details and make the payment.`;
            const separator = Platform.OS === 'ios' ? '&' : '?';
            const sms = `sms:${customer.customer_mobile}${separator}body=${defaultMessage}`;
            Linking.openURL(sms);
        });
    };

    return (
        <View style={{ backgroundColor: colors.card, flex: 1 }}>
            {/* AppBar Start */}
            <View style={[styles.headerContainer, { backgroundColor: colors.card }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Feather size={24} color={colors.title} name={'arrow-left'} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.title }]}>Transaction Details</Text>
            </View>
            {/* AppBar End */}

            {/* Modal to show image in full screen */}
            <FilePreviewModal
                modalVisible={modalVisible}
                close={setModalVisible}
                image={customer?.image}
            />

            <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center', paddingBottom: 20 }}>
                {/* Customer Details Card */}
                <View style={[styles.card, { backgroundColor: colors.card }]}>
                    <View style={styles.customerItem}>
                        <View>
                            <Text style={[styles.customerName, { color: colors.title }]}>{customer.customer_name}</Text>
                            <Text style={[styles.lastInteraction, { color: colors.text }]}>{customer.last_updated_date}</Text>
                        </View>
                        <View style={styles.transactionInfo}>
                            <Text style={{ color: customer.transaction_type === "CREDIT" ? COLORS.primary : COLORS.danger, fontSize: 18, fontWeight: "900" }}>
                                ₹ {customer.amount}
                            </Text>
                            <Text style={[styles.type, { color: colors.text }]}>{customer.transaction_type}</Text>
                        </View>
                    </View>
                    <View style={styles.dateContainer}>
                        <View style={styles.dateItem}>
                            <Text style={[styles.label, { color: colors.text }]}>Given Date</Text>
                            <Text style={[styles.value, { color: colors.title }]}>{customer.estimated_given_date}</Text>
                        </View>
                        <View style={styles.dateItem}>
                            <Text style={[styles.label, { color: colors.text }]}>Taken Date</Text>
                            <Text style={[styles.value, { color: colors.title }]}>{customer.transaction_date}</Text>
                        </View>
                    </View>
                    <View style={styles.transactionIDContainer}>
                        <Text style={[styles.label, { color: colors.text }]}>Transaction ID:</Text>
                        <Text style={[styles.value, { color: colors.title }]}>{customer.transaction_id}</Text>
                    </View>
                </View>

                {/* Description Card */}
                <View style={[styles.card, { backgroundColor: colors.card, marginTop: 20 }]}>
                    <Text style={[styles.cardTitle, { color: colors.title }]}>Description</Text>
                    <Text style={[styles.cardText, { color: colors.text }]}>{customer.description}</Text>
                </View>

                {/* Attachment Section */}
                {customer?.image !== "" && (
                    <View style={[styles.card, { backgroundColor: colors.card, marginTop: 20 }]}>
                        <Text style={[styles.cardTitle, { color: colors.title }]}>Attached Bill Receipt</Text>

                        <TouchableOpacity onPress={handlePreview} style={styles.attachmentContainer}>
                            {isImageLoading && (
                                <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
                            )}
                            <Image
                                style={styles.attachmentImage}
                                source={{ uri: customer?.image }}
                                onLoadStart={() => setImageLoading(true)}
                                onLoadEnd={() => setImageLoading(false)}
                            />
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>

            {/* Share Button */}
            <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
                <ButtonIcon
                    onPress={send_sms}
                    title='Share'
                    iconDirection='right'
                    icon={<FontAwesome style={{ color: COLORS.white, marginLeft: 10 }} name={'share'} size={18} />}
                />
            </View>
        </View>
    );
};

// Modal Component to show full-screen image
const FilePreviewModal = ({ modalVisible, close, image }) => {
    const [isImageLoading, setImageLoading] = useState(true); // Image loading state for popup
    const theme = useTheme();
    const { colors } = theme;

    return (
        <Modal visible={modalVisible} transparent={true} animationType="slide">
            <View style={styles.modalContainer}>
                {/* Close button */}
                <TouchableOpacity style={styles.closeButton} onPress={() => close(false)}>
                    <Feather name="x" size={30} color={colors.primary} />
                </TouchableOpacity>

                <View style={styles.modalContent}>
                    {isImageLoading && (
                        <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
                    )}
                    <Image
                        style={styles.fullImage}
                        source={{ uri: image }}
                        onLoadStart={() => setImageLoading(true)}
                        onLoadEnd={() => setImageLoading(false)}
                    />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    backButton: {
        padding: 10,
        marginRight: 5,
        height: 45,
        width: 45,
        borderRadius: 22.5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        ...FONTS.fontSemiBold,
        fontSize: 18,
    },
    card: {
        width: "95%",
        borderRadius: 15,
        padding: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 5,
    },
    customerItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    customerName: {
        ...FONTS.fontSemiBold,
        fontSize: 22,
    },
    lastInteraction: {
        fontSize: 14,
        opacity: 0.6,
    },
    transactionInfo: {
        alignItems: 'center',
    },
    dateContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
    },
    dateItem: {
        alignItems: 'center',
    },
    label: {
        ...FONTS.fontBold,
        fontSize: 12,
    },
    value: {
        ...FONTS.fontBold,
        fontSize: 14,
    },
    transactionIDContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 20,
    },
    cardTitle: {
        ...FONTS.fontSemiBold,
        fontSize: 18,
        marginBottom: 10,
    },
    cardText: {
        ...FONTS.fontRegular,
        fontSize: 14,
        textAlign: "justify",
    },
    attachmentContainer: {
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    attachmentImage: {
        height: 110,
        width: '100%',
        borderRadius: 10,
    },
    loader: {
        position: 'absolute',
    },
    // Modal styles
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '90%',
        height: '70%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 30,
        right: 20,
        zIndex: 1, // Ensure the close button is on top of the image
    },
    fullImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
});

export default CustomerTransationsDetails;
