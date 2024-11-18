import React, { useRef, useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    SafeAreaView,
    ActivityIndicator,
    Platform
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
import Button from '../../components/Button/Button';
import { MessagesService } from '../../lib/MessagesService';
// import * as FileSystem from 'expo-file-system';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';


let toDateObj = new Date();
let fromDateObj = new Date();

type Transaction = {
    customer_id: string,
    amount: string,
    transaction_type: "CREDIT" | "DEBIT",
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

    const [timeRange, setTimeRange] = useState('Today');
    const [inputDateType, setInputDateType] = useState('To Date');
    const [showCalender, setCalenderShow] = useState(false);
    const [calenderDate, setCalenderDate] = useState(new Date());
    const todayDate = `${toDateObj.getFullYear()}-${toDateObj.getMonth() + 1}-${toDateObj.getDate()}`;
    const [toDate, setToDate] = useState(todayDate);
    const [fromDate, setFromDate] = useState(todayDate);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [debounceTimer, setDebounceTimer] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [sheettype, setSheetType] = useState('Date');

    const refRBSheet = useRef<any>(null);


    useFocusEffect(
        useCallback(() => {
            setFromAndToDate(timeRange);
            FatechApiData();

        }, [])
    );
    const FatechApiData = () => {
        setIsLoading(true);
        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }
        const timer = setTimeout(async () => {
            ApiService.postWithToken('api/shopkeeper/transactions/view-report', { from_date: fromDate, to_date: toDate }).then(res => {
                if (res.status) {
                    setTransactions(res.data);
                }
                setIsLoading(false);
            });
        }, 1000);
        setDebounceTimer(timer);
    }
    const showDatepicker = (inputeDatetype: string) => {
        setInputDateType(inputeDatetype);
        setCalenderShow(true);
    };
    const onChange = (event: any, selectedDate: any) => {
        let currentDate = selectedDate || calenderDate;
        currentDate = currentDate > new Date() ? new Date() : currentDate;

        if (event.type == 'set') {
            if (Platform.OS === 'android') {
                setCalenderShow(false);
                setCalenderDate(new Date());
            } else {
                setCalenderShow(true);
            }
            if (inputDateType == "To Date") {

                toDateObj = currentDate;
            } else {
                fromDateObj = currentDate;
            }
            if (fromDateObj < toDateObj) {
                if (inputDateType == "To Date") {
                    setToDate(`${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`);
                    if (timeRange === "Custom Date") {
                        showDatepicker("From Date")
                    }
                    toDateObj = currentDate;
                } else {
                    setFromDate(`${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`);
                    fromDateObj = currentDate;
                }
                FatechApiData();
            } else {
                MessagesService.commonMessage("To Date Should Not be less than From Date.");
                // setToDate(`${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`);

            }
        }
    };


    const setFromAndToDate = (value: string) => {
        FatechApiData();
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
    const handelDateInput = async (value: string) => {
        showDatepicker(value)
        if (Platform.OS === 'ios') {
            await refRBSheet.current.open();
            setSheetType('Date');
        }
    }
    const handleBottomSheet = async (value: string) => {
        setTimeRange(value);
        setFromAndToDate(value);
        await refRBSheet.current.close();
    }
    const GeneratePDF = async () => {
        const totalDebit = transactions.reduce((total, transaction) => total + (transaction.transaction_type === 'DEBIT' ? parseInt(transaction.amount) : 0), 0)
        const totalCredit = transactions.reduce((total, transaction) => total + (transaction.transaction_type === 'CREDIT' ? parseInt(transaction.amount) : 0), 0)

        const HTMLData = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Statement - Paylap Score</title>
    <style>
        body {
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.5;
        }

        .header {
            background-color: green;
            color: white;
            padding: 12px 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .phone {
            font-size: 16px;
        }

        .logo {
            font-size: 20px;
            font-weight: bold;
        }

        .container {
            max-width: 1000px;
            margin: 20px auto;
            padding: 0 20px;
        }

        .title {
            text-align: center;
            margin-bottom: 30px;
        }

        .date-range {
            text-align: center;
            color: #666;
            margin-bottom: 30px;
        }

        .summary {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 2px;
            margin-bottom: 30px;
            border: 1px solid #ddd;
            border-radius: 8px;
            overflow: hidden;
        }

        .summary-item {
            padding: 15px;
            background: #fff;
        }

        .summary-label {
            font-weight: 500;
            color: #444;
            margin-bottom: 8px;
        }

        .summary-value {
            font-size: 18px;
            font-weight: bold;
        }

        .entries-count {
            margin-bottom: 15px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 100px;
        }

        th, td {
            padding: 12px;
            text-align: left;
            border: 1px solid #ddd;
        }

        th {
            background-color: #f8f9fa;
        }

        .month-header {
            background-color: #f8f9fa;
            font-weight: bold;
            padding: 12px;
        }

        .debit {
            background-color: #fff2f2;
        }

        .credit {
            background-color: #f2fff2;
        }

        .total-row td {
            font-weight: bold;
            background-color: #f8f9fa;
        }

        .footer {
            background-color: green;
            color: white;
            padding: 15px 24px;
            position: fixed;
            bottom: 0;
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .install-btn {
            background-color: white;
            color: #003B95;
            text-decoration:none,
            border: none;
            padding: 8px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            text-align: center
        }

        .red-text {
            color: #dc3545;
        }
        .page-number {
            color: #666;
            text-align: right;
            margin-top: 20px;
            margin-bottom: 70px;
        }
    </style>
</head>
<body>
    <header class="header">
        <div class="phone">+919716476396</div>
        <div class="logo">Paylap Score</div>
    </header>

    <div class="container">
        <div class="title">
            <h1>Account Statement</h1>
            <div class="date-range">(${fromDate} - ${todayDate})</div>
        </div>

        <div class="summary">
            <div class="summary-item">
                <div class="summary-label">Total Debit(-)</div>
                <div class="summary-value">₹${totalDebit}</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">Total Credit(+)</div>
                <div class="summary-value">₹${totalCredit.toLocaleString()}</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">Net Balance</div>
                <div class="summary-value red-text">₹${totalDebit - totalCredit} Dr</div>
            </div>
        </div>

        <div class="entries-count">No. of Entries: ${transactions.length}   (${fromDate} - ${todayDate})</div>

        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Debit(-)</th>
                    <th>Credit(+)</th>
                </tr>
            </thead>
            <tbody>
                ${transactions.map(transaction => {
            return `<tr>
                                         <td>${transaction.transaction_date}</td>
                                         <td>${transaction.customer_info.name}</td>
                                         <td>${transaction.description}</td>
                                         <td class="debit">${transaction.transaction_type === 'DEBIT' ? `₹ ${parseInt(transaction.amount).toLocaleString()}` : ''}</td>
                                         <td class="credit">${transaction.transaction_type === 'CREDIT' ? `₹ ${parseInt(transaction.amount).toLocaleString()}` : ''}</td>
                                         </tr>`;
        })}
                <tr class="total-row">
                    <td colspan="3">Total</td>
                    <td>${transactions.reduce((total, transaction) => total + (transaction.transaction_type === 'DEBIT' ? parseInt(transaction.amount) : 0), 0).toLocaleString()}</td>
                    <td>${transactions.reduce((total, transaction) => total + (transaction.transaction_type === 'CREDIT' ? parseInt(transaction.amount) : 0), 0).toLocaleString()}</td>
                </tr>                
            </tbody>
        </table>
        <div class="page-number">Page 1 of 2</div>
    </div>

    <footer class="footer">
        <div>
            Start Using Paylap Score Now
            <a href="#" taget="_blank" class="install-btn">Install</a>
        </div>
        <div style="display:flex; flex-direction:column;margin-right:50px;">
            Help: +91-9876543210
            <a href="#" target="_blank" class="install-btn">T&C Apply</a>
        </div>
    </footer>
</body>
</html>`;

        try {

            const file = await Print.printToFileAsync({ html: HTMLData });
            return file.uri;

        } catch (error) {
            console.error('Error generating PDF:', error);
            return "";

        }
    };

    const SharePDF = async () => {
        if (transactions.length == 0) {
            MessagesService.commonMessage("No data to genrate PDF.", "ERROR");
            return
        }

        const uri = await GeneratePDF();
        if (uri) {
            Sharing.shareAsync(uri, { dialogTitle: "Hello" });
        } else {
            MessagesService.commonMessage("unable to share file.", "ERROR");
        }

    }
    const DownloadPDF = async () => {
        if (transactions.length == 0) {
            MessagesService.commonMessage("No data to genrate PDF.", "ERROR");
            return
        }

        const uri = await GeneratePDF();
        if (uri) {
            // Move the file to the Downloads folder
            // const downloadsDir = FileSystem.documentDirectory + 'Download/';
            // const filePath = downloadsDir + 'MyPDF.pdf';

            // await FileSystem.makeDirectoryAsync(downloadsDir, { intermediates: true });
            // await FileSystem.copyAsync({ from: file.uri, to: filePath });

            // console.log('PDF saved to:', filePath);
            Print.printAsync({ uri: uri, orientation: Print.Orientation.portrait, })
        } else {
            MessagesService.commonMessage("unable to share file.", "ERROR");
        }

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
                    sheettype === "Radio" ?
                        <ReportFilterOptionSheet handleSelectedValue={handleBottomSheet} /> :
                        Platform.OS === 'ios' &&
                        <View style={{ backgroundColor: colors.card, flex: 1 }}>
                            <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                                {showCalender && (
                                    <View style={{ alignSelf: 'center' }}>
                                        <DateTimePicker
                                            value={calenderDate}
                                            mode="date"
                                            display="default"
                                            onChange={onChange}
                                            textColor={colors.text}
                                        />
                                    </View>
                                )}
                            </View>
                            <View style={{ justifyContent: "space-between", flexDirection: 'row', padding: 10, paddingBottom: 20 }}>
                                <Button style={[styles.footerButton, styles.downloadButton]} textColor={colors.white} textSize={'sm'} onPress={async () => { await refRBSheet.current.close(); }} title='Cancel' />
                                <Button style={[styles.footerButton, styles.downloadButton]} textColor={colors.white} textSize={'sm'} onPress={async () => { await refRBSheet.current.close(); setCalenderShow(false); }} title='Done' />
                            </View>
                        </View>
                }
            </RBSheet>
            <Header
                title={'View Report'}
                leftIcon={'back'}
                titleRight
            />
            <ScrollView style={{ ...styles.content, backgroundColor: colors.card }}>
                <View style={{ ...styles.dateRange, backgroundColor: !theme.dark ? COLORS.primary : colors.card }}>
                    <TouchableOpacity onPress={async () => { await handelDateInput('From Date'); }} style={{ borderRightWidth: 1, borderRightColor: 'white', flex: 1 }} >
                        <Text style={{ fontSize: 12, marginBottom: 5, color: !theme.dark ? 'white' : colors.title }}>From Date</Text>
                        <View style={styles.dateItem}>
                            <Ionicons name="calendar-outline" size={20} color={!theme.dark ? 'white' : colors.title} />
                            <Text style={{ ...styles.dateText, color: !theme.dark ? 'white' : colors.title }}>{fromDate}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={async () => { await handelDateInput('To Date'); }} style={{ flex: 1, alignItems: 'flex-end' }} >
                        <Text style={{ fontSize: 12, marginBottom: 5, color: !theme.dark ? 'white' : colors.title }}>To Date</Text>
                        <View style={styles.dateItem}>
                            <Ionicons name="calendar-outline" size={20} color={!theme.dark ? 'white' : colors.title} />
                            <Text style={{ ...styles.dateText, color: !theme.dark ? 'white' : colors.title }}>{toDate}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                {
                    Platform.OS === 'android' &&
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
                }
                <View style={styles.searchContainer}>
                    <TouchableOpacity style={{ ...styles.dropdown, backgroundColor: !theme.dark ? COLORS.primary : colors.card }} onPress={async () => { await refRBSheet.current.open(); setSheetType('Radio'); }}>
                        <Text style={{ ...styles.dropdownText, color: !theme.dark ? 'white' : colors.title }}>{timeRange}</Text>
                        <Ionicons name="chevron-down" size={20} color={!theme.dark ? 'white' : colors.title} />
                    </TouchableOpacity>
                </View>

                {/* <View style={{ ...styles.balanceCard, backgroundColor: !theme.dark ? COLORS.primary : colors.card }}>
                    <Text style={{ ...styles.balanceTitle, color: !theme.dark ? 'white' : colors.title }}>Net Balance</Text>
                    <Text style={{ ...styles.balanceAmount, color: !theme.dark ? COLORS.primaryLight : COLORS.primary, }}>₹ 63,500</Text>
                </View> */}

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
                    {
                        isLoading == true ? <ActivityIndicator size="large" color={colors.title} />
                            : transactions.length == 0 ?
                                <Text style={{ ...styles.summaryText, color: colors.title, textAlign: 'center' }}>No Data Found</Text> :

                                transactions.map((transaction, index) => (
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
                                            styles.negativeAmount
                                        ]}>
                                            {transaction.transaction_type === 'DEBIT' ? '₹' + parseInt(transaction.amount).toLocaleString() : ''}
                                        </Text>
                                        <Text style={[
                                            styles.transactionAmount,
                                            styles.positiveAmount
                                        ]}>
                                            {transaction.transaction_type === 'CREDIT' ? '₹' + parseInt(transaction.amount).toLocaleString() : ''}
                                        </Text>
                                    </View>
                                ))}
                </View>
            </ScrollView>

            <View style={{ ...styles.footer, backgroundColor: colors.card }}>
                <TouchableOpacity style={[styles.footerButton, styles.downloadButton]} onPress={DownloadPDF}>
                    <Ionicons name="download-outline" size={20} color="white" />
                    <Text style={styles.footerButtonText}>Download</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.footerButton, styles.shareButton]} onPress={SharePDF}>
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