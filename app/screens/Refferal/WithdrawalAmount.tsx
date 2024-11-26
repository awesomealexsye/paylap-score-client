import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, Alert, Image, StyleSheet, ActivityIndicator, TouchableOpacity, FlatList } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import Header from '../../layout/Header';
import Input from '../../components/Input/Input';
import { FontAwesome } from '@expo/vector-icons';
import Button from '../../components/Button/Button';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import { StackScreenProps } from '@react-navigation/stack';
import { IMAGES } from '../../constants/Images';
import { ApiService } from '../../lib/ApiService';
import { MessagesService } from '../../lib/MessagesService';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import CommonService from '../../lib/CommonService';
import ButtonIcon from '../../components/Button/ButtonIcon';

interface WithdrawalListType {
    id: string;
    amount: number;
    payment_mode: string;
    status: string;
    created_at: Date;
    updated_at: Date;
    last_interaction: string;
    receiver_account: string;
}
type WithdrawalScreenProps = StackScreenProps<RootStackParamList, 'WithdrawalAmount'>;

export const WithdrawalAmount = ({ navigation }: WithdrawalScreenProps) => {
    const theme = useTheme();
    const { colors }: { colors: any } = theme;
    const [isLoading, setIsLoading] = useState(false);
    const [amount, setAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Bank'>('UPI');
    const [upiId, setUpiId] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [ifscCode, setIfscCode] = useState('');
    const [accountHolderName, setAccountHolderName] = useState('');
    const [bankName, setBankName] = useState('');
    const [userBalance, setUserBalance] = useState(0);
    const [withdrawalList, setWithdrawalList] = useState<any>([]);
    const [withdrawalRange, setWithdrawalRange] = useState<any>({});

    useEffect(() => {
        loadWithdrawalData();
    }, []);

    const loadWithdrawalData = () => {
        CommonService.currentUserDetail().then((res) => {
            setUserBalance(res.wallet_amount);
        })
        withdrawal_list_func();
    }

    const withdrawal_list_func = () => {
        setIsLoading(true);
        ApiService.postWithToken("api/user/withdrawal-list", {}).then(function (res) {
            setWithdrawalList(res.data);
            setWithdrawalRange(res.withdrawal_range);
            setIsLoading(false);

        });
    }

    const handleFormSubmission = () => {
        // Basic validation
        if (!amount) {
            Alert.alert('Error', 'Please enter an amount.');
            return;
        }
        if (paymentMethod === 'UPI' && !upiId) {
            Alert.alert('Error', 'Please enter your UPI ID.');
            return;
        }
        if (paymentMethod === 'Bank') {
            if (!accountNumber || !ifscCode || !accountHolderName || !bankName) {
                Alert.alert('Error', 'Please fill all bank details.');
                return;
            }
        }

        setIsLoading(true);
        const data = {
            amount,
            paymentMethod,
            upiId,
            accountNumber,
            ifscCode,
            accountHolderName,
            bankName,
        }
        ApiService.postWithToken("api/user/withdrawal-request", data).then((res) => {
            loadWithdrawalData();
            setIsLoading(false);
            if (res.status) {
                Alert.alert('Success', res.message);
                setAmount("")
                setPaymentMethod("UPI")
                setUpiId("")
                setAccountHolderName("")
                setBankName("")
                setIfscCode("")
                setBankName("")
            }
            // MessagesService.commonMessage(res.message, res.status == true ? "SUCCESS" : "ERROR");
            // Handle form submission logic here
            // navigation.goBack();
        })

    };
    const renderWithdrawalList = ({ item }: { item: WithdrawalListType }) => (
        <View style={[styles.customerItem, { backgroundColor: colors.card, },
            // !theme.dark && { elevation: 2 }

        ]}>
            <View style={{}}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ marginLeft: 14 }}>
                        {/*<Text style={[styles.customerName, { color: colors.title, ...FONTS.fontSemiBold }]}>{item.customer_name}</Text>*/}
                        <Text style={{ ...styles.lastInteraction, color: item.status == "SUCCESS" ? COLORS.primary : item.status == "PENDING" || item.status == "PROCESSING" ? COLORS.warning : COLORS.danger }}>{item.status}</Text>
                        <Text style={{ color: colors.text, fontSize: 12 }}>{item.last_interaction}</Text>
                        <Text style={{ fontSize: 13, color: !theme.dark ? "black" : 'white' }}>{item.receiver_account}</Text>
                    </View>
                </View>
            </View>
            <View style={{ flexDirection: "column", alignItems: "flex-end", position: "relative", justifyContent: 'center' }}>
                <Text style={{ color: COLORS.primaryLight, fontSize: 15, fontWeight: "900" }}>₹ {(item.amount).toLocaleString()}</Text>
                {/* <Text style={[styles.type, { color: colors.title }]}>₹ {item.amount}</Text> */}
            </View>
        </View>

    );

    return (
        <>
            <View style={{ flex: 1, backgroundColor: colors.background }}>
                <View>
                    <Header title={'Withdrawal Amount'} leftIcon={'back'} titleRight />
                    <ScrollView>
                        <View style={{
                            flex: 1.5,
                            alignItems: 'center',
                        }}>
                            <Image
                                source={theme.dark ? IMAGES.appnamedark : IMAGES.appname}
                                style={{
                                    height: 110,
                                    width: 150,
                                    objectFit: "contain",
                                }}
                            />
                        </View>

                        <View style={styles.container}>
                            <View style={{ marginBottom: 18, marginTop: 12 }}>
                                <Text style={{ fontSize: 11 }}>{`You can withdrawal amount from ₹${withdrawalRange?.MIN} to ₹${withdrawalRange?.MAX}`}</Text>
                            </View>
                        </View>
                        <View style={styles.container}>
                            <View style={styles.balanceContainer}>
                                <Text style={styles.label}>Balance:</Text>
                                <Text style={styles.amount}>₹ {userBalance}</Text>
                            </View>
                        </View>
                        <View style={[GlobalStyleSheet.container]}>
                            <View>
                                <View style={{ marginBottom: 10, padding: 12 }}>
                                    <Input
                                        inputRounded
                                        keyboardType={'number-pad'}
                                        icon={<FontAwesome style={{ opacity: .6 }} name={'mobile-phone'} size={35} color={colors.text} />}
                                        placeholder="Enter Amount"
                                        value={amount}
                                        onChangeText={setAmount}
                                        maxlength={10}
                                    />

                                    {/* Payment Method Selection using Buttons */}
                                    <View style={styles.paymentMethodContainer}>
                                        <Button
                                            title="UPI"
                                            onPress={() => setPaymentMethod('UPI')}
                                            style={[
                                                styles.paymentButton,
                                                paymentMethod === 'UPI' ? styles.activeButton : styles.inactiveButton,
                                            ]}
                                        />
                                        <Button
                                            title="Bank Transfer"
                                            onPress={() => setPaymentMethod('Bank')}
                                            style={[
                                                styles.paymentButton,
                                                paymentMethod === 'Bank' ? styles.activeButton : styles.inactiveButton,
                                            ]}
                                        />
                                    </View>

                                    {/* Conditional Rendering of Input Fields */}
                                    {paymentMethod === 'UPI' && (
                                        <Input
                                            inputRounded
                                            placeholder="Enter UPI ID"
                                            value={upiId}
                                            onChangeText={setUpiId}
                                        />
                                    )}

                                    {paymentMethod === 'Bank' && (
                                        <>
                                            <View style={{ marginTop: 10 }}>
                                                <Input
                                                    inputRounded
                                                    placeholder="Account Number"
                                                    value={accountNumber}
                                                    onChangeText={setAccountNumber}
                                                    maxlength={20}
                                                />
                                            </View>
                                            <View style={{ marginTop: 10 }}>
                                                <Input
                                                    inputRounded
                                                    placeholder="IFSC Code"
                                                    value={ifscCode}
                                                    onChangeText={setIfscCode}
                                                    maxlength={20}
                                                />
                                            </View>
                                            <View style={{ marginTop: 10 }}>
                                                <Input
                                                    inputRounded
                                                    placeholder="Account Holder Name"
                                                    value={accountHolderName}
                                                    onChangeText={setAccountHolderName}
                                                    maxlength={25}
                                                />
                                            </View>
                                            <View style={{ marginTop: 10 }}>
                                                <Input
                                                    inputRounded
                                                    placeholder="Bank Name"
                                                    value={bankName}
                                                    onChangeText={setBankName}
                                                    maxlength={25}
                                                />
                                            </View>
                                        </>
                                    )}

                                    {/* Submit Button */}
                                    <View style={{ marginTop: 12 }}>

                                        {
                                            isLoading === false ?
                                                <Button title="Send Request" onPress={handleFormSubmission} /> : <ActivityIndicator size={70} color={COLORS.primary} />
                                        }
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View>

                            {
                                isLoading === false ?
                                    <FlatList scrollEnabled={false}
                                        data={withdrawalList}
                                        renderItem={renderWithdrawalList}
                                        keyExtractor={(item) => item.id}
                                        contentContainerStyle={{}}
                                    /> : <View style={{ flex: 1, justifyContent: 'center' }} >
                                        <ActivityIndicator color={colors.title} size={'large'}></ActivityIndicator>
                                    </View>
                            }
                        </View>
                    </ScrollView>
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, // Takes full height of the screen
        justifyContent: 'center', // Centers vertically
        alignItems: 'center', // Centers horizontally
        backgroundColor: '#f0f0f0', // Optional: background color for better visibility
    },
    balanceContainer: {
        flexDirection: 'row', // Aligns children in a row
        alignItems: 'center', // Centers items vertically
    },
    label: {
        marginRight: 5, // Adds space between label and amount
        fontSize: 16,
    },
    amount: {
        fontSize: 16,
        fontWeight: 'bold', // Optional: makes the amount bold
    },
    paymentMethodContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10,
    },
    paymentButton: {
        flex: 1,
        marginHorizontal: 5,
    },
    activeButton: {
        backgroundColor: '#007BFF', // Active button color (e.g., blue)
        color: '#FFFFFF', // Text color for active button
    },
    inactiveButton: {
        backgroundColor: '#E0E0E0', // Inactive button color (e.g., light gray)
        color: '#000000', // Text color for inactive button
    },
    customerItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 15,
        shadowRadius: 31.27,
        marginHorizontal: 10,
        marginVertical: 4,
        top: 4,
        borderBottomColor: "black",
        borderBottomWidth: 0.2
    },
    lastInteraction: {
        fontSize: SIZES.font,
        fontWeight: 'bold'
    },
    type: {
        color: COLORS.title,
        fontSize: SIZES.fontXs,
        ...FONTS.fontSemiBold,
    },
});

export default WithdrawalAmount;