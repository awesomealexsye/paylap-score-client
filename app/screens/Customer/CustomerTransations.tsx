import React, { useRef, useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, TextInput, StyleSheet, SafeAreaView, FlatList, Linking, Alert, ActivityIndicator } from 'react-native';
import { useTheme, useFocusEffect } from '@react-navigation/native';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { IMAGES } from '../../constants/Images';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import CustomerActivityBtn from './CustomerActivityBtn';
import { ApiService } from '../../lib/ApiService';
import CommonService from '../../lib/CommonService';
import { MessagesService } from '../../lib/MessagesService';


interface Customer {
    id: string;
    customer_name: string;
    amount: string;
    last_updated_date: string;
    transaction_type: string;
    transaction_date: Date;
    description: string;
    image: any;
    customer_mobile: string;

}

type CustomerTransationsScreenProps = StackScreenProps<RootStackParamList, 'CustomerTransations'>

export const CustomerTransations = ({ navigation, route }: CustomerTransationsScreenProps) => {
    const { item } = route.params;

    const [customerData, setCustomersData] = useState<any>({});
    const [isLoading, setIsLoading] = useState<any>(false);


    useFocusEffect(
        useCallback(() => {

            fetchCustomerTransactionList();

        }, [])
    );

    const fetchCustomerTransactionList = async () => {
        setIsLoading(true);
        const res = await ApiService.postWithToken("api/shopkeeper/transactions/list-shopkeeper-customer-transaction", { "customer_id": item.customer_id });
        // const data = JSON.stringify(res);
        setCustomersData(res);
        setIsLoading(false);
    }
    const reminder = () => {
        Alert.alert(
            'Send Reminder',
            'Are you sure you want to send a payment reminder to the customer?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Yes',
                    onPress: () => {
                        CommonService.currentUserDetail().then((res) => {
                            const defaultMessage = `Dear Sir / Madam, Your payment of ₹ ${item.amount} is pending at ${res.name}(${res.mobile}).Open Paylapscore app for view the details and make the payment.`;
                            ApiService.postWithToken("api/add-notification", { receiver_id: item.customer_id, title: "Payment Reminder", description: defaultMessage }).then((resNotification) => {
                                if (!resNotification.status) {
                                    MessagesService.commonMessage(resNotification.message);
                                }
                            })
                        })
                    },
                },
            ],
        );
    }
    const send_sms = () => {
        CommonService.currentUserDetail().then((res) => {
            const defaultMessage = `Dear Sir / Madam, Your payment of ₹ ${item.amount} is pending at ${res.name}(${res.mobile}).Open Paylapscore app for view the details and make the payment.`;
            const sms = `sms:${item.customer.mobile}?body=${defaultMessage}`;
            Linking.openURL(sms);
        })
    }
    const theme = useTheme();
    const { colors }: { colors: any; } = theme;


    const renderCustomer = ({ item }: { item: Customer }) => (
        <TouchableOpacity onPress={() => navigation.navigate("CustomerTransationsDetails", { customer: item })
        }>
            <View style={[styles.customerItem, { backgroundColor: colors.card, marginVertical: 10 }]}>
                <View style={{}}>
                    <View style={{ flexDirection: 'row' }}>
                        {/* <Image
                            style={{ height: 50, width: 50, borderRadius: 50 }}
                            source={item.image}
                        /> */}
                        <View style={{ marginLeft: 14 }}>
                            <Text style={[styles.customerName, { color: colors.title, ...FONTS.fontSemiBold }]}>{item.customer_name}</Text>
                            <Text style={styles.lastInteraction}>{item.last_updated_date}</Text>
                            <Text style={styles.lastInteraction}>{item.transaction_date.toLocaleString()}

                            </Text>
                            <Text style={styles.lastInteraction}>{item.description}</Text>
                        </View>

                    </View>

                </View>

                <View style={{ flexDirection: "column", alignItems: "center", position: "relative" }}>
                    <Text style={{ color: item.transaction_type === "CREDIT" ? COLORS.primary : COLORS.danger, fontSize: 18, fontWeight: "900" }}>₹ {item.amount}</Text>
                    <Text style={[styles.type, { color: colors.title }]}>{item.transaction_type}</Text>
                </View>
            </View>
        </TouchableOpacity>

    );
    return (
        <View style={{ backgroundColor: colors.card, flex: 1 }}>
            {/* AppBar Start */}
            <View style={[GlobalStyleSheet.container, { padding: 0 }]}>
                <View
                    style={[styles.header, {
                        backgroundColor: colors.card,
                    }]}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 5, }}>
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={{
                                padding: 10, marginRight: 5,
                                height: 45,
                                width: 45,
                                borderRadius: 45,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: colors.background
                            }}
                        >
                            <Feather size={24} color={colors.title} name={'arrow-left'} />
                        </TouchableOpacity>
                        <Image
                            style={{ height: 45, width: 45, borderRadius: 50, marginHorizontal: 15, resizeMode: 'contain' }}
                            src={item.profile_image}
                        />

                        <View>
                            <Text style={{ ...FONTS.fontSemiBold, fontSize: 18, color: colors.title, }}>{item.name}</Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* AppBar End */}

            <ScrollView showsVerticalScrollIndicator={true}>
                <View style={{ flex: 1, alignItems: 'center' }} >
                    <View style={{
                        height: 80,
                        width: "95%",
                        top: 15,
                        backgroundColor: customerData.data?.shopkeeper_transaction_sum?.transaction_type === "DEBIT" ? COLORS.danger : COLORS.primary,
                        borderRadius: 31,
                        shadowColor: "#025135",
                        shadowOffset: {
                            width: 0,
                            height: 15,
                        },
                        shadowOpacity: 0.34,
                        shadowRadius: 31.27,
                        elevation: 8,
                        flexDirection: 'column'
                    }}>


                        <View style={{ width: 380, flexDirection: 'row', justifyContent: "space-evenly", paddingTop: 20, alignItems: "center", alignContent: "center" }}>
                            <View style={{ alignItems: 'center', justifyContent: 'center', borderRightColor: colors.dark }}>
                                <Text style={{ ...FONTS.fontSemiBold, fontSize: SIZES.h4, color: COLORS.primaryLight, textAlign: "center" }}>{customerData.data?.shopkeeper_transaction_sum?.transaction_type} </Text>
                            </View>
                            <View style={{ alignItems: 'center', justifyContent: "center" }}>
                                <Text style={{ ...FONTS.fontSemiBold, fontSize: SIZES.h3, color: COLORS.primaryLight }}>₹ {customerData.data?.shopkeeper_transaction_sum?.total_amount}</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={[GlobalStyleSheet.cardBody, { marginTop: 20 }]}>
                    <View style={{}}>
                        <View style={[{ flexDirection: "row", justifyContent: "space-evenly", alignItems: "center", marginBottom: 10 }]}>
                            <CustomerActivityBtn
                                gap
                                isDisabled={false}
                                icon={<Image source={IMAGES.tachometerfast} style={{ height: 20, width: 20, resizeMode: 'contain' }}></Image>}
                                color={colors.card}
                                text='Score'
                                onpress={() => navigation.navigate('CustomerScore', { customer: item })}
                            />
                            <CustomerActivityBtn
                                gap
                                isDisabled={false}
                                icon={<FontAwesome style={{ color: colors.title }} name={'rupee'} size={20} />}
                                color={colors.card}
                                text='Payments'
                                onpress={() => navigation.navigate('NotAvailable')}
                            /><CustomerActivityBtn
                                gap
                                isDisabled={item.transaction_type == "DEBIT" ? item.amount > 0 ? false : true : true}
                                icon={<FontAwesome style={{ color: colors.title }} name={'bell'} size={20} />}
                                color={colors.card}
                                text='Reminder'
                                onpress={() => reminder()}
                            /><CustomerActivityBtn
                                gap
                                isDisabled={item.transaction_type == "DEBIT" ? item.amount > 0 ? false : true : true}
                                icon={<FontAwesome style={{ color: colors.title }} name={'envelope'} size={20} />}
                                color={colors.card}
                                text='SMS'
                                onpress={() => send_sms()}
                            />
                        </View>

                    </View>
                </View>
                {
                    isLoading === false ?
                        <FlatList scrollEnabled={false}
                            data={customerData.data?.records}
                            renderItem={renderCustomer}
                            keyExtractor={(item) => item.id}
                            contentContainerStyle={{}}

                        /> : <View style={{ flex: 1, justifyContent: 'center' }} >
                            <ActivityIndicator color={colors.title} size={'large'}></ActivityIndicator>
                        </View>
                }

            </ScrollView>
            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', paddingTop: 10, backgroundColor: colors.dark }}>
                <TouchableOpacity style={[styles.removeBtn]} onPress={() => navigation.navigate("AddPayment", { item: item, transaction_type: "DEBIT" })}>

                    <Text style={styles.addButtonText}>
                        Debit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.addAmmount} onPress={() => navigation.navigate("AddPayment", { item: item, transaction_type: "CREDIT" })}>

                    <Text style={styles.addButtonText}>
                        Credit</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({



    TextInput: {
        ...FONTS.fontRegular,
        fontSize: 16,
        color: COLORS.title,
        height: 60,
        borderRadius: 61,
        paddingHorizontal: 20,
        paddingLeft: 30,
        borderWidth: 1,
        backgroundColor: '#FAFAFA',
        marginBottom: 10

    },
    customerList: {
        marginBottom: 100,
    },
    customerItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,

        backgroundColor: Colors.white,
        borderRadius: 18,
        shadowColor: "#025135",
        shadowOffset: {
            width: 0,
            height: 15,
        },
        shadowOpacity: 0.34,
        shadowRadius: 31.27,
        marginHorizontal: 10,
        marginVertical: 4,

        top: 4
    },
    customerName: {
        color: COLORS.title,
        fontSize: 18,
    },
    lastInteraction: {
        color: '#888',
        fontSize: 14,
    },
    type: {
        color: COLORS.title,
        fontSize: 14,
        ...FONTS.fontMedium,


    },
    amount: {
        color: 'red',
        fontSize: 18,
        textAlign: "center"
    },
    amountZero: {
        color: '#121221',
        fontSize: 18,
    },
    addAmmount: {
        backgroundColor: COLORS.primary,
        padding: 15, // 15px padding around the button content
        borderRadius: 12, // Circular button
        elevation: 5,  // Shadow for Android
        shadowColor: '#000',  // Shadow for iOS
        shadowOffset: { width: 0, height: 4 },  // Shadow offset for iOS
        shadowOpacity: 0.2,  // Shadow opacity for iOS

        // Shadow blur radius for iOS
    },
    removeBtn: {
        backgroundColor: 'red', // Matches the button's background color from CSS
        padding: 15, // 15px padding around the button content
        borderRadius: 12, // Circular button
        elevation: 5,  // Shadow for Android
        shadowColor: '#000',  // Shadow for iOS
        shadowOffset: { width: 0, height: 4 },  // Shadow offset for iOS
        shadowOpacity: 0.2,
    },
    addButtonText: {
        color: COLORS.white,
        fontSize: 20,
        fontWeight: 'bold',
        paddingLeft: 40,
        paddingRight: 40
    },

    header: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: COLORS.card,
    },
    title: {
        fontSize: 20,
        ...FONTS.fontMedium,
    },
    actionBtn: {
        height: 35,
        width: 35,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.background
    }
})

export default CustomerTransations;
