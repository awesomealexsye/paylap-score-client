import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Share, Platform, ActivityIndicator, Modal, Alert, FlatList } from 'react-native';
import { useTheme, useFocusEffect } from '@react-navigation/native';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import ButtonIcon from '../../components/Button/ButtonIcon';
import CommonService from '../../lib/CommonService';
import CONFIG from '../../constants/config';
import HeaderStyle1 from '../../components/Headers/HeaderStyle1';
import Header from '../../layout/Header';
import CustomerTransactionTable from './CustomerTransactionTable';
import { ApiService } from '../../lib/ApiService';
import { useTranslation } from 'react-i18next';
import { MessagesService } from '../../lib/MessagesService';

type CustomerTransationsDetailsScreenProps = StackScreenProps<RootStackParamList, 'CustomerTransationsDetails'>;

export const CustomerTransationsDetails = ({ navigation, route }: CustomerTransationsDetailsScreenProps) => {
    const { customer } = route.params;
    const theme = useTheme();
    const { colors } = theme;
    const [modalVisible, setModalVisible] = useState(false);
    const [isImageLoading, setImageLoading] = useState(true); // Image loading state
    const [transactionData, setTransationsData] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(false)

    const { t } = useTranslation();

    interface Transaction {
        transaction_id: string;
        transaction_type: string;
        amount: number;
        total_debit_amount: number;
        created_at: Date;
        latest_updated_at: string;
        normal_date: string;
    }
    const showPayButton = customer.transaction_type === "CREDIT" ? 'DEBIT' : 'CREDIT';
    const handlePreview = () => {
        setModalVisible(true);
    };

    useFocusEffect(useCallback(() => {
        fetchTransaction();
    }, []))

    const fetchTransaction = async () => {
        setIsLoading(true)
        const res = await ApiService.postWithToken("api/shopkeeper/transactions/list-user-transaction", { transaction_id: customer.transaction_id });
        if (res.status) {
            setTransationsData(res.data);
        }
        setIsLoading(false)
    };
    const sendReminder = async () => {
        setIsLoading(true)
        const res = await ApiService.postWithToken("api/reminder/paylapscore", { received_id: customer.customer_id, pending_date: customer.estimated_given_date, amount: customer.amount, record_id: customer.id });
        if (res.status) {
            MessagesService.commonMessage(res.message, res.status ? 'SUCCESS' : 'ERROR');
        }
        setIsLoading(false)

    };
    const handlePayment = async () => {
        navigation.navigate("AddPayment", { item: customer, transaction_type: showPayButton, existPayment: true });

    }

    const shareTransaction = async () => {
        const PLAY_STORE_URL = CONFIG.APP_BUILD.ANDROID.APP_URL;
        const APP_STORE_URL = CONFIG.APP_BUILD.IOS.APP_URL;
        let message = `✨✨ *Transaction Details* ✨✨
        
        ━━━━━━━━━━━━━━━━━━━━━━━
        👤 *Customer Name*: ${customer.customer_name}
        📞 *Mobile*: ${customer.customer_mobile}
        ━━━━━━━━━━━━━━━━━━━━━━━

        💳 *Transaction Type*: ${customer.transaction_type === "CREDIT" ? "🟢 Credit" : "🔴 Debit"}
        💰 *Total ${customer.transaction_type} Amount*: ₹ ${customer.total_debit_amount}
        💰 *Pending Amount*: ₹ ${customer.amount}
        ━━━━━━━━━━━━━━━━━━━━━━━

        📅 *Transaction Date*: ${customer.transaction_date}
        ⏳ *Estimated End Date*: ${customer.estimated_given_date}
        ━━━━━━━━━━━━━━━━━━━━━━━

        🆔 *Transaction ID*: 
        ${customer.transaction_id}
        ━━━━━━━━━━━━━━━━━━━━━━━

        📝 *Description*:
        ${customer.description}

        ━━━━━━━━━━━━━━━━━━━━━━━
        🔗 *Shared via PayLap App* 🚀

        📲 *Download the PayLap app now*:

        ▶️ [*Play Store*](${PLAY_STORE_URL})
        🍏 [*App Store*](${APP_STORE_URL})
        ━━━━━━━━━━━━━━━━━━━━━━━`;

        try {
            await Share.share({
                message: message
            });
        } catch (error) {
            Alert.alert("Something Went Wrong");
        }
    };

    const renderCustomer = ({ item }: { item: Transaction }) => (
        <View style={[{ flexDirection: 'row', backgroundColor: colors.card, justifyContent: 'space-between', alignItems: 'center', flex: 1, borderBottomColor: colors.border, borderBottomWidth: 1, marginBottom: 10 }]}>
            <View style={{ flexDirection: 'column' }}>
                {/* <Text style={{ ...styles.lastInteraction, color: !theme.dark ? "black" : 'white' }}>{item.transaction_id}</Text> */}
                <Text style={{ color: colors.text, fontSize: 12, fontWeight: "900" }}>{item.latest_updated_at}</Text>
                <Text style={{ color: colors.text, fontSize: 12, fontWeight: "500" }}>{item.normal_date}</Text>
            </View>

            <View style={{ flexDirection: "column", alignItems: "flex-end", justifyContent: 'center' }}>
                <Text style={{ color: item.transaction_type === "CREDIT" ? COLORS.primaryLight : COLORS.danger, fontSize: 15, fontWeight: "900" }}>₹ {parseInt(`${item.amount}`).toLocaleString()}</Text>
                <Text style={[styles.type, { color: item.transaction_type === "CREDIT" ? COLORS.primary : COLORS.danger, }]}>{item.transaction_type == 'CREDIT' ? t('credit') : t('debit')}</Text>
            </View>
        </View>
        // <TouchableOpacity onPress={() => { }}>
        // </TouchableOpacity>
    );

    return (
        <View style={{ backgroundColor: colors.card, flex: 1 }}>


            {/* AppBar Start */}

            <Header
                title={t('transactionDetail')}
                leftIcon={'back'}
            // rightIcon2={'Edit'}
            />


            {/* <View style={[styles.headerContainer, { backgroundColor: colors.card }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Feather size={24} color={colors.title} name={'arrow-left'} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.title }]}>Transaction Details</Text>
            </View> */}

            {/* AppBar End */}

            {/* Modal to show image in full screen */}
            <FilePreviewModal
                modalVisible={modalVisible}
                close={setModalVisible}
                image={customer?.image}
            />

            <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center', paddingVertical: 20 }}>

                {/* Customer Details Card */}
                <View style={[styles.card, { backgroundColor: colors.card }]}>
                    <View style={styles.customerItem}>
                        <View>
                            <Text style={[styles.customerName, { color: colors.title }]}>{customer.customer_name}</Text>
                            <Text style={[styles.lastInteraction, { color: colors.text }]}>{customer.last_updated_date}</Text>
                        </View>
                        <View style={styles.transactionInfo}>
                            <Text style={{ color: customer.transaction_type === "CREDIT" ? COLORS.primary : COLORS.danger, fontSize: SIZES.font, fontWeight: "900" }}>
                                ₹ {customer.amount}
                            </Text>
                            <Text style={{
                                color: colors.title, fontSize: SIZES.fontSm, ...FONTS.fontSemiBold,
                            }}>{customer.transaction_type}</Text>
                        </View>
                    </View>
                    <View style={{
                        borderBottomColor: colors.text,
                        borderBottomWidth: 0.4
                    }} />
                    <View style={styles.dateContainer}>

                        <View style={styles.dateItem}>
                            <Text style={[styles.label, { color: colors.text, }]}>{t('takenDate')}</Text>
                            <Text style={[styles.value, { color: colors.title, }]}>{customer.transaction_date}</Text>
                        </View>
                        <View style={styles.dateItem}>
                            <Text style={[styles.label, { color: colors.text, }]}>{t('endDate')}</Text>
                            <Text style={[styles.value, { color: colors.title }]}>{customer.estimated_given_date}</Text>
                        </View>
                    </View>
                    <View style={{
                        borderBottomColor: colors.text,
                        borderBottomWidth: 0.4
                    }} />
                    <View style={[styles.transactionIDContainer, { flexDirection: "row", justifyContent: "space-around", alignItems: "center" }]}>
                        <Text style={[styles.label, { color: colors.text }]}>{t('transactionId')}                       : </Text>
                        <Text style={[styles.value, { color: colors.title }]}>{customer.transaction_id}</Text>
                    </View>
                    <View style={[styles.transactionIDContainer, { flexDirection: "row", justifyContent: "space-around", alignItems: "center" }]}>
                        <Text style={[styles.label, { color: colors.text }]}> {customer.transaction_type == 'DEBIT' ? t('debitAmount') : t('creditAmount')}               :                   </Text>
                        <Text style={[styles.value, { color: colors.title }]}>₹ {customer.total_debit_amount}</Text>
                    </View>
                </View>

                {/* Description Card */}
                <View style={[styles.card, { backgroundColor: colors.card, marginTop: 20 }]}>
                    <Text style={[styles.cardTitle, { color: colors.title }]}>{t('description')}</Text>
                    <Text style={[styles.cardText, { color: colors.text }]}>{customer.description}</Text>
                </View>

                <View style={{ width: 400, marginTop: 20, paddingHorizontal: 30 }}>
                    {isLoading == false ?
                        <FlatList scrollEnabled={false}
                            data={transactionData}
                            renderItem={renderCustomer}
                            keyExtractor={(item) => item.id}
                            contentContainerStyle={{ flex: 1 }}
                        />
                        :
                        <ActivityIndicator color={colors.title} size={'large'}></ActivityIndicator>
                    }
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
            {customer.amount > 0 && customer.transaction_type !== "CREDIT" &&
                <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
                    <ButtonIcon
                        color={'red'}
                        onPress={sendReminder}
                        title={'Send Reminder'}
                        iconDirection='left'
                        icon={<FontAwesome style={{ color: COLORS.white, marginLeft: 10 }} name={'bell'} size={18} />}
                    />
                </View>
            }


            {customer.amount > 0 &&
                <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
                    <ButtonIcon
                        color={showPayButton == 'DEBIT' ? 'red' : 'green'}
                        onPress={handlePayment}
                        title={showPayButton == 'CREDIT' ? t('credit') : t('debit')}
                        iconDirection='left'
                        icon={<FontAwesome style={{ color: COLORS.white, marginLeft: 10 }} name={'rupee'} size={18} />}
                    />
                </View>}
            <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
                <ButtonIcon
                    onPress={shareTransaction}
                    title={t('share')}
                    iconDirection='left'
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
        <Modal
            visible={modalVisible}
            transparent={true}
            animationType="slide">

            <View style={styles.modalContainer}>
                {/* Close button */}
                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => close(false)}>
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
        fontSize: SIZES.font,
    },
    card: {
        width: "90%",
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
        marginVertical: 10,

    },
    customerName: {
        ...FONTS.fontSemiBold,
        fontSize: SIZES.fontLg,
    },
    lastInteraction: {
        fontSize: SIZES.fontSm,
        opacity: 0.6,
    },
    transactionInfo: {
        alignItems: 'center',
    },
    dateContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 10,

    },
    type: {
        color: COLORS.title,
        fontSize: SIZES.fontXs,
        ...FONTS.fontSemiBold,
    },

    dateItem: {
        alignItems: 'center',
    },
    label: {
        ...FONTS.fontRe,
        fontSize: SIZES.fontSm,
    },
    value: {
        ...FONTS.fontBold,
        fontSize: SIZES.fontSm,
    },
    transactionIDContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 20,
    },
    cardTitle: {
        ...FONTS.fontSemiBold,
        fontSize: SIZES.fontLg,
        marginBottom: 10,
    },
    cardText: {
        ...FONTS.fontRegular,
        fontSize: SIZES.fontSm,
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
