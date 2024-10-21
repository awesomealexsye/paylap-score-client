import React, { useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import { useTheme } from '@react-navigation/native';
import { COLORS } from '../../constants/theme';
import Header from '../../layout/Header';
import DateTimePicker from '@react-native-community/datetimepicker';
import RBSheet from 'react-native-raw-bottom-sheet';
import ReportFilterOptionSheet from '../../components/BottomSheet/ReportFilterOptionSheet';


type ReportDetailsScreenProps = StackScreenProps<RootStackParamList, 'Report'>
const Report = ({ navigation, route }: ReportDetailsScreenProps) => {

    const theme = useTheme();
    const { colors }: { colors: any; } = theme;

    const [searchQuery, setSearchQuery] = useState('');
    const [timeRange, setTimeRange] = useState('This Week');
    const [inputDateType, setInputDateType] = useState('To Date');
    const [showCalender, setCalenderShow] = useState(false);
    const [calenderDate, setCalenderDate] = useState(new Date());
    const [toDate, setToDate] = useState('');
    const [fromDate, setFromDate] = useState('');
    const refRBSheet = useRef<any>(null);

    const showDatepicker = (inputeDatetype: string) => {
        setInputDateType(inputeDatetype);
        setCalenderShow(true);
    };
    const onChange = (event: any, selectedDate: any) => {
        const currentDate = selectedDate || calenderDate;
        setCalenderShow(false);
        setCalenderDate(new Date());

        if (inputDateType == "To Date") {
            setToDate(`${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`);
        } else {
            setFromDate(`${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`);
        }
    };

    const handlePress = async (value: string) => {
        setTimeRange(value);
        await refRBSheet.current.close();
    }

    const transactions = [
        { id: 1, name: 'Ajay Colleage', date: '15 Oct 24 • 01:15 PM', amount: 5450, type: 'credit' },
        { id: 2, name: 'Ajay Colleage', date: '09 Oct 24 • 09:41 AM', amount: 2550, type: 'credit', description: 'Office rent' },
        { id: 3, name: 'Sunil Sir', date: '02 Oct 24 • 06:35 PM', amount: 60000, type: 'credit' },
        { id: 4, name: 'Ajay Colleage', date: '02 Oct 24 • 09:40 AM', amount: 4500, type: 'debit', description: 'Office rent' },
    ];

    return (
        <SafeAreaView style={{ ...styles.container }}>
            <RBSheet
                ref={refRBSheet}
                closeOnDragDown={true}
                height={240}
                openDuration={100}
                customStyles={{

                    container: {
                        backgroundColor: theme.dark ? colors.background : colors.cardBg,
                    },
                    draggableIcon: {
                        marginTop: 10,
                        marginBottom: 5,
                        height: 5,
                        width: 80,
                        backgroundColor: colors.border,
                    }
                }}
            >
                {
                    <ReportFilterOptionSheet handleSelectedValue={handlePress} />
                }

            </RBSheet>
            <Header
                title={'View Report'}
                leftIcon={'back'}
                titleRight
            />
            <ScrollView style={{ ...styles.content, backgroundColor: colors.card }}>
                <View style={{ ...styles.dateRange, backgroundColor: !theme.dark ? COLORS.primary : colors.card }}>
                    <TouchableOpacity onPress={() => showDatepicker('To Date')} style={{ borderRightWidth: 1, borderRightColor: 'white', flex: 1 }} >
                        <Text style={{ fontSize: 12, marginBottom: 5, color: !theme.dark ? 'white' : colors.title }}>From Date</Text>
                        <View style={styles.dateItem}>
                            <Ionicons name="calendar-outline" size={20} color={!theme.dark ? 'white' : colors.title} />
                            <Text style={{ ...styles.dateText, color: !theme.dark ? 'white' : colors.title }}>{toDate || `${calenderDate.getFullYear()}-${calenderDate.getMonth() + 1}-${calenderDate.getDate()}`}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => showDatepicker('From Date')} style={{ flex: 1, alignItems: 'flex-end' }} >
                        <Text style={{ fontSize: 12, marginBottom: 5, color: !theme.dark ? 'white' : colors.title }}>To Date</Text>
                        <View style={styles.dateItem}>
                            <Ionicons name="calendar-outline" size={20} color={!theme.dark ? 'white' : colors.title} />
                            <Text style={{ ...styles.dateText, color: !theme.dark ? 'white' : colors.title }}>{fromDate || `${calenderDate.getFullYear()}-${calenderDate.getMonth() + 1}-${calenderDate.getDate()}`}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{ display: 'flex', justifyContent: 'center' }}>
                    {showCalender && (
                        <View style={{ alignSelf: 'center' }}>
                            <DateTimePicker
                                value={calenderDate}
                                mode="date"
                                display="default"
                                onChange={onChange}
                            />
                        </View>
                    )}
                </View>
                <View style={styles.searchContainer}>
                    <View style={{ ...styles.searchInputContainer, backgroundColor: !theme.dark ? COLORS.primary : colors.card }}>
                        <Ionicons name="search" size={20} color={!theme.dark ? 'white' : colors.title} style={styles.searchIcon} />
                        <TextInput
                            style={{ ...styles.searchInput, color: !theme.dark ? 'white' : colors.title }}
                            placeholder="Search Entries"
                            value={searchQuery}
                            placeholderTextColor={!theme.dark ? 'white' : colors.title}
                            onChangeText={setSearchQuery}

                        />
                    </View>
                    <TouchableOpacity style={{ ...styles.dropdown, backgroundColor: !theme.dark ? COLORS.primary : colors.card }} onPress={async () => { await refRBSheet.current.open(); }}>
                        <Text style={{ ...styles.dropdownText, color: !theme.dark ? 'white' : colors.title }}>{timeRange}</Text>
                        <Ionicons name="chevron-down" size={20} color={!theme.dark ? 'white' : colors.title} />
                    </TouchableOpacity>
                </View>

                <View style={{ ...styles.balanceCard, backgroundColor: !theme.dark ? COLORS.primary : colors.card }}>
                    <Text style={{ ...styles.balanceTitle, color: !theme.dark ? 'white' : colors.title }}>Net Balance</Text>
                    <Text style={{ ...styles.balanceAmount, color: !theme.dark ? COLORS.primaryLight : COLORS.primary, }}>₹ 63,500</Text>
                </View>

                <View style={{ ...styles.entriesCard, backgroundColor: colors.card }}>
                    <View style={styles.entriesSummary}>
                        <Text style={styles.summaryLabel}>ENTRIES</Text>
                        <View style={styles.summaryAmounts}>
                            <Text style={styles.summaryLabel}>DEBIT</Text>
                            <Text style={styles.summaryLabel}>CREDIT</Text>
                        </View>
                    </View>
                    {/* <View style={styles.entriesSummary}>
                        <Text style={{ ...styles.summaryText, color: colors.title }}>4 Entries</Text>
                        <View style={styles.summaryAmounts}>
                            <Text style={[styles.summaryText, styles.negativeAmount]}>₹ 4,500</Text>
                            <Text style={[styles.summaryText, styles.positiveAmount]}>₹ 68,000</Text>
                        </View>
                    </View> */}
                    {transactions.map((transaction) => (
                        <View key={transaction.id} style={styles.transactionItem}>
                            <View>
                                <Text style={{ ...styles.transactionName, color: colors.title }}>{transaction.name}</Text>
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

            <View style={{ ...styles.footer, backgroundColor: colors.card }}>
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
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 16,
    },
    content: {
        flex: 1,
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
        padding: 16
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