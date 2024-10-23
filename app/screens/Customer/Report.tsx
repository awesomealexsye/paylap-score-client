import React, { useRef, useState, useCallback } from 'react';
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
import { useTheme, useFocusEffect } from '@react-navigation/native';
import { COLORS } from '../../constants/theme';
import Header from '../../layout/Header';
import DateTimePicker from '@react-native-community/datetimepicker';
import RBSheet from 'react-native-raw-bottom-sheet';
import ReportFilterOptionSheet from '../../components/BottomSheet/ReportFilterOptionSheet';
import { ApiService } from '../../lib/ApiService';




let toDateObj = new Date();
let fromDateObj = new Date();

type Transaction = {
    customer_id: string,
    amount: string,
    transaction_type: string,
    description: string,
    transaction_date: string,
    estimated_given_date: string,
    customer_info: {
        id: number,
        name: string,
        mobile: string
    },
    transaction_casual_date: string

}

type ReportDetailsScreenProps = StackScreenProps<RootStackParamList, 'Report'>
const Report = ({ navigation, route }: ReportDetailsScreenProps) => {

    const theme = useTheme();
    const { colors }: { colors: any; } = theme;

    const [searchQuery, setSearchQuery] = useState('');
    const [timeRange, setTimeRange] = useState('Today');
    const [inputDateType, setInputDateType] = useState('To Date');
    const [showCalender, setCalenderShow] = useState(false);
    const [calenderDate, setCalenderDate] = useState(new Date());
    const [toDate, setToDate] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const refRBSheet = useRef<any>(null);


    useFocusEffect(
        useCallback(() => {
            setFromAndToDate(timeRange);
            FatechApiData();

        }, [])
    );
    const FatechApiData = () => {

        ApiService.postWithToken('api/shopkeeper/transactions/view-report', { from_date: fromDate, to_date: toDate, search: searchQuery }).then(res => {
            if (res.status) {
                setTransactions(res.data);
            }
        });
    }
    const showDatepicker = (inputeDatetype: string) => {
        setInputDateType(inputeDatetype);
        setCalenderShow(true);
    };
    const onChange = (event: any, selectedDate: any) => {
        let currentDate = selectedDate || calenderDate;
        currentDate = currentDate > new Date() ? new Date() : currentDate;

        setCalenderShow(false);
        setCalenderDate(new Date());

        if (inputDateType == "To Date") {
            setToDate(`${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`);
            if (timeRange === "Custom Date") {
                showDatepicker("From Date")
            }
        } else {
            setFromDate(`${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`);
        }
    };


    const setFromAndToDate = (value: string) => {
        switch (value) {
            case "Today":
                const currentDate = new Date();
                setToDate(`${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`);
                setFromDate(`${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`);
                break;
            case "Yesterday":
                fromDateObj = new Date();
                fromDateObj.setDate(fromDateObj.getDate() - 1)
                toDateObj = new Date();
                setToDate(`${toDateObj.getFullYear()}-${toDateObj.getMonth() + 1}-${toDateObj.getDate()}`);
                setFromDate(`${fromDateObj.getFullYear()}-${fromDateObj.getMonth() + 1}-${fromDateObj.getDate()}`);
                break;
            case "This Week":
                fromDateObj = new Date();
                fromDateObj.setDate(fromDateObj.getDate() - fromDateObj.getDay());
                toDateObj = new Date();
                setToDate(`${toDateObj.getFullYear()}-${toDateObj.getMonth() + 1}-${toDateObj.getDate()}`);
                setFromDate(`${fromDateObj.getFullYear()}-${fromDateObj.getMonth() + 1}-${fromDateObj.getDate()}`);
                break;
            case "Last Week":
                fromDateObj = new Date();
                fromDateObj.setDate(fromDateObj.getDate() - fromDateObj.getDay() - 7);
                toDateObj = new Date();
                toDateObj.setDate(toDateObj.getDate() - toDateObj.getDay() - 1);
                setToDate(`${toDateObj.getFullYear()}-${toDateObj.getMonth() + 1}-${toDateObj.getDate()}`);
                setFromDate(`${fromDateObj.getFullYear()}-${fromDateObj.getMonth() + 1}-${fromDateObj.getDate()}`);
                break;
            case "This Month":
                fromDateObj = new Date();
                fromDateObj.setDate(1);
                toDateObj = new Date();
                setToDate(`${toDateObj.getFullYear()}-${toDateObj.getMonth() + 1}-${toDateObj.getDate()}`);
                setFromDate(`${fromDateObj.getFullYear()}-${fromDateObj.getMonth() + 1}-${fromDateObj.getDate()}`);
                break;
            case "Last Month":
                fromDateObj = new Date();
                fromDateObj.setMonth(fromDateObj.getMonth() - 1);
                fromDateObj.setDate(1);
                toDateObj = new Date();
                toDateObj.setDate(0);
                setToDate(`${toDateObj.getFullYear()}-${toDateObj.getMonth() + 1}-${toDateObj.getDate()}`);
                setFromDate(`${fromDateObj.getFullYear()}-${fromDateObj.getMonth() + 1}-${fromDateObj.getDate()}`);
                break;
            case "Custom Date":
                showDatepicker("To Date")
                break;
        }
    }

    const handleBottomSheet = async (value: string) => {
        setTimeRange(value);
        setFromAndToDate(value);
        await refRBSheet.current.close();
    }

    return (
        <SafeAreaView style={{ ...styles.container }}>
            <RBSheet
                ref={refRBSheet}
                closeOnDragDown={true}
                height={320}
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
                    <ReportFilterOptionSheet handleSelectedValue={handleBottomSheet} />
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
                            <Text style={{ ...styles.dateText, color: !theme.dark ? 'white' : colors.title }}>{fromDate || `${calenderDate.getFullYear()}-${calenderDate.getMonth() + 1}-${calenderDate.getDate()}`}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => showDatepicker('From Date')} style={{ flex: 1, alignItems: 'flex-end' }} >
                        <Text style={{ fontSize: 12, marginBottom: 5, color: !theme.dark ? 'white' : colors.title }}>To Date</Text>
                        <View style={styles.dateItem}>
                            <Ionicons name="calendar-outline" size={20} color={!theme.dark ? 'white' : colors.title} />
                            <Text style={{ ...styles.dateText, color: !theme.dark ? 'white' : colors.title }}>{toDate || `${calenderDate.getFullYear()}-${calenderDate.getMonth() + 1}-${calenderDate.getDate()}`}</Text>
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
                    {transactions.map((transaction, index) => (
                        <View key={index} style={styles.transactionItem}>
                            <View>
                                <Text style={{ ...styles.transactionName, color: colors.title }}>{transaction.customer_info.name}</Text>
                                <Text style={styles.transactionDate}>{transaction.transaction_date}</Text>
                                {transaction.description && (
                                    <Text style={styles.transactionDescription}>{transaction.description}</Text>
                                )}
                            </View>
                            <Text style={[
                                styles.transactionAmount,
                                transaction.transaction_type === 'CREDIT' ? styles.positiveAmount : styles.negativeAmount
                            ]}>
                                ₹ {parseInt(transaction.amount).toLocaleString()}
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