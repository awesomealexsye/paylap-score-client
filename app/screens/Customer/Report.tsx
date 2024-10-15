import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import { useTheme } from '@react-navigation/native';
import { COLORS } from '../../constants/theme';


type ReportDetailsScreenProps = StackScreenProps<RootStackParamList, 'Report'>
const Report = ({ navigation, route }: ReportDetailsScreenProps) => {

    const theme = useTheme();
    const { colors }: { colors: any; } = theme;

    const [searchQuery, setSearchQuery] = useState('');
    const [timeRange, setTimeRange] = useState('This Month');

    const transactions = [
        { id: 1, name: 'Ajay Colleage', date: '15 Oct 24 • 01:15 PM', amount: 5450, type: 'credit' },
        { id: 2, name: 'Ajay Colleage', date: '09 Oct 24 • 09:41 AM', amount: 2550, type: 'credit', description: 'Office rent' },
        { id: 3, name: 'Sunil Sir', date: '02 Oct 24 • 06:35 PM', amount: 60000, type: 'credit' },
        { id: 4, name: 'Ajay Colleage', date: '02 Oct 24 • 09:40 AM', amount: 4500, type: 'debit', description: 'Office rent' },
    ];

    return (
        <SafeAreaView style={{ ...styles.container, backgroundColor: COLORS.primary }}>
            <StatusBar barStyle="light-content" backgroundColor="#1e40af" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => { navigation.goBack(); }}>
                    <Ionicons name="arrow-back" size={24} color={colors.title} />
                </TouchableOpacity>
                <Text style={{ ...styles.headerTitle, color: colors.title }}>View Report</Text>
            </View>

            <ScrollView style={{ ...styles.content, backgroundColor: COLORS.card }}>
                <View style={{ ...styles.dateRange, backgroundColor: COLORS.primary }}>
                    <View style={styles.dateItem}>
                        <Ionicons name="calendar-outline" size={20} color={colors.title} />
                        <Text style={{ ...styles.dateText, color: colors.title }}>Tue, 01 Oct 24</Text>
                    </View>
                    <View style={styles.dateItem}>
                        <Ionicons name="calendar-outline" size={20} color={colors.title} />
                        <Text style={{ ...styles.dateText, color: colors.title }}>Tue, 15 Oct 24</Text>
                    </View>
                </View>

                <View style={styles.searchContainer}>
                    <View style={{ ...styles.searchInputContainer, backgroundColor: COLORS.primary }}>
                        <Ionicons name="search" size={20} color={colors.title} style={styles.searchIcon} />
                        <TextInput
                            style={{ ...styles.searchInput, color: colors.title, }}
                            placeholder="Search Entries"
                            value={searchQuery}
                            placeholderTextColor={colors.title}
                            onChangeText={setSearchQuery}

                        />
                    </View>
                    <TouchableOpacity style={{ ...styles.dropdown, backgroundColor: COLORS.primary }}>
                        <Text style={{ ...styles.dropdownText, color: colors.title }}>{timeRange}</Text>
                        <Ionicons name="chevron-down" size={20} color={colors.title} />
                    </TouchableOpacity>
                </View>

                <View style={{ ...styles.balanceCard, backgroundColor: colors.card }}>
                    <Text style={styles.balanceTitle}>Net Balance</Text>
                    <Text style={{ ...styles.balanceAmount, color: COLORS.primary, }}>₹ 63,500</Text>
                </View>

                <View style={{ ...styles.entriesCard, backgroundColor: colors.card }}>
                    <View style={styles.entriesSummary}>
                        <Text style={styles.summaryLabel}>ENTRIES</Text>
                        <View style={styles.summaryAmounts}>
                            <Text style={styles.summaryLabel}>YOU GAVE</Text>
                            <Text style={styles.summaryLabel}>YOU GOT</Text>
                        </View>
                    </View>
                    <View style={styles.entriesSummary}>
                        <Text style={{ ...styles.summaryText, color: colors.title }}>4 Entries</Text>
                        <View style={styles.summaryAmounts}>
                            <Text style={[styles.summaryText, styles.negativeAmount]}>₹ 4,500</Text>
                            <Text style={[styles.summaryText, styles.positiveAmount]}>₹ 68,000</Text>
                        </View>
                    </View>
                    {transactions.map((transaction) => (
                        <View key={transaction.id} style={styles.transactionItem}>
                            <View>
                                <Text style={styles.transactionName}>{transaction.name}</Text>
                                <Text style={styles.transactionDate}>{transaction.date}</Text>
                                {transaction.description && (
                                    <Text style={styles.transactionDescription}>{transaction.description}</Text>
                                )}
                            </View>
                            <Text style={[
                                styles.transactionAmount,
                                transaction.type === 'credit' ? styles.positiveAmount : styles.negativeAmount
                            ]}>
                                ₹ {transaction.amount.toLocaleString()}
                            </Text>
                        </View>
                    ))}
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity style={[styles.footerButton, styles.downloadButton]}>
                    <Ionicons name="download-outline" size={20} color="white" />
                    <Text style={styles.footerButtonText}>Download</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.footerButton, styles.shareButton]}>
                    <Ionicons name="share-social-outline" size={20} color="white" />
                    <Text style={styles.footerButtonText}>Share</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 16,
    },
    content: {
        flex: 1,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 16,
    },
    dateRange: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
    },
    dateItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateText: {
        marginLeft: 8,
        fontSize: 14,
    },
    searchContainer: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    searchInputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 8,
        paddingHorizontal: 12,
        marginRight: 8,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        height: 40,
    },
    dropdown: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 40,
    },
    dropdownText: {
        marginRight: 8,
    },
    balanceCard: {
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
    },
    balanceTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    balanceAmount: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    entriesCard: {
        borderRadius: 8,
        padding: 16,
    },
    entriesSummary: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    summaryLabel: {
        color: '#6b7280',
        fontSize: 12,
    },
    summaryAmounts: {
        flexDirection: 'row',
        width: 150,
        justifyContent: 'space-between',
    },
    summaryText: {
        fontWeight: 'bold',
    },
    transactionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
        paddingVertical: 16,
    },
    transactionName: {
        fontWeight: 'bold',
        marginBottom: 4,
    },
    transactionDate: {
        color: '#6b7280',
        fontSize: 12,
        marginBottom: 2,
    },
    transactionDescription: {
        color: '#6b7280',
        fontSize: 12,
    },
    transactionAmount: {
        fontWeight: 'bold',
    },
    positiveAmount: {
        color: '#059669',
    },
    negativeAmount: {
        color: '#dc2626',
    },
    footer: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: '#f3f4f6',
    },
    footerButton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        marginHorizontal: 4,
    },
    downloadButton: {
        backgroundColor: '#1e40af',
    },
    shareButton: {
        backgroundColor: '#059669',
    },
    footerButtonText: {
        color: 'white',
        fontWeight: 'bold',
        marginLeft: 8,
    },
});

export default Report;