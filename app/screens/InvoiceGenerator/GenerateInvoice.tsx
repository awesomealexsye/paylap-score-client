import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, TextInput, StyleSheet, RefreshControl, FlatList, BackHandler, ActivityIndicator, SafeAreaView } from 'react-native';
import { useTheme, useFocusEffect } from '@react-navigation/native';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { IMAGES } from '../../constants/Images';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import { openDrawer } from '../../redux/actions/drawerAction';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { ApiService } from '../../lib/ApiService';
// import { MessagesService } from '../../lib/MessagesService';
import { useTranslation } from 'react-i18next';
import i18n from '../../../i18n';
import Header from '../../layout/Header';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import ButtonIcon from '../../components/Button/ButtonIcon';

interface Customer {
    id: string;
    customer_id: string;
    name: string;
    mobile: string;
    amount: string;
    joined_at: string;
    latest_updated_at: string;
    transaction_type: string;
    profile_image: any;
}



type GenerateInvoiceProps = StackScreenProps<RootStackParamList, 'GenerateInvoice'>

export const GenerateInvoice = ({ navigation, route }: GenerateInvoiceProps) => {
    const { t } = useTranslation();
    const { items } = route.params;
    console.log("itemDataGenInvoice", items);


    const [searchText, setSearchText] = useState('');
    const [customersData, setCustomersData] = useState<any>([]);
    const [homeBanner, setHomeBanner] = useState<any>({});
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [userDetail, setUserDetail] = useState({ name: "", profile_image: "", aadhar_card: "", notification_count: 0 });
    const [isLoading, setIsLoading] = useState<any>(false);
    const [isRefreshing, setIsRefreshing] = useState<any>(false);
    const [imageData, setImageData] = useState<any>([]);


    const [customerName, setCustomerName] = useState('');
    const [address, setAdress] = useState('');
    const [phone, setPhone] = useState('');
    const [notes, setNotes] = useState('');





    const handleSearch = (text: string) => {
        setSearchText(text);
        const filteredList = customersData.filter((customer: any) =>
            customer.name.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredCustomers(filteredList);
    };


    const handelRefresh = async () => {
        setIsRefreshing(true);
        // await fetchCustomerList();
        setIsRefreshing(false);
    };
    const renderItem = ({ item }: any) => (
        <View style={styles.itemContainer}>
            <Text style={styles.itemName}>Item Name: {item.itemName}</Text>
            <Text style={styles.itemDetail}>Rate Per Item: ₹{item.ratePerItem}</Text>
            <Text style={styles.itemDetail}>Quantity: {item.quantity}</Text>
            <Text style={styles.itemAmount}>Total Amount: ₹{item.itemAmount}</Text>
        </View>
    );


    const handleFormSubmission = () => {
        // Basic validation
        // if (!amount) {
        //     Alert.alert('Error', 'Please enter an amount.');
        //     return;
        // }
        // if (paymentMethod === 'UPI' && !upiId) {
        //     Alert.alert('Error', 'Please enter your UPI ID.');
        //     return;
        // }
        // if (paymentMethod === 'Bank') {
        //     if (!accountNumber || !ifscCode || !accountHolderName || !bankName) {
        //         Alert.alert('Error', 'Please fill all bank details.');
        //         return;
        //     }
        // }

        // setIsLoading(true);
        // const data = {
        //     amount,
        //     paymentMethod,
        //     upiId,
        //     accountNumber,
        //     ifscCode,
        //     accountHolderName,
        //     bankName,
        // }
        // ApiService.postWithToken("api/user/withdrawal-request", data).then((res) => {
        //     loadWithdrawalData();
        //     setIsLoading(false);
        //     if (res.status) {
        //         Alert.alert('Success', res.message);
        //         setAmount("")
        //         setPaymentMethod("UPI")
        //         setUpiId("")
        //         setAccountHolderName("")
        //         setBankName("")
        //         setIfscCode("")
        //         setBankName("")
        //     }
        //     // MessagesService.commonMessage(res.message, res.status == true ? "SUCCESS" : "ERROR");
        //     // Handle form submission logic here
        //     // navigation.goBack();
        // })

    };


    const dispatch = useDispatch();

    const theme = useTheme();
    const { colors }: { colors: any; } = theme;


    return (
        <View style={{ backgroundColor: colors.card, flex: 1 }}>
            {/* AppBar Start */}
            <Header
                title={t('generateInvoice')}
                leftIcon={'back'}
                titleRight
            />
            {/* AppBar End */}


            < ScrollView showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={isRefreshing} onRefresh={handelRefresh} />
                }
            >
                <View style={[GlobalStyleSheet.container]}>
                    <View style={{ marginTop: 10 }}>
                        <Input
                            inputRounded
                            placeholder={t('customerName')}
                            value={customerName}
                            onChangeText={setCustomerName}
                            maxlength={20}
                        />
                    </View>
                    <View style={{ marginTop: 10 }}>
                        <Input
                            inputRounded
                            placeholder={t('address')}
                            value={address}
                            onChangeText={setAdress}
                            maxlength={20}
                        />
                    </View>
                    <View style={{ marginTop: 10 }}>
                        <Input
                            inputRounded
                            placeholder={t('phone')}
                            value={phone}
                            onChangeText={setPhone}
                            maxlength={25}
                        />
                    </View>
                    <View style={{ marginTop: 10 }}>
                        <Input
                            inputRounded
                            placeholder={t('notes')}
                            value={notes}
                            onChangeText={setNotes}
                            maxlength={25}
                        />
                    </View>
                    <View style={{ marginTop: 10 }}>
                        <View style={styles.container}>
                            {items.length > 0 ? (
                                items.map((item: any, index: number) => (
                                    <View key={index} style={styles.itemContainer}>
                                        <Text style={styles.itemName}>Item Name: {item.itemName}</Text>
                                        <Text style={styles.itemDetail}>Rate Per Item: ₹{item.ratePerItem}</Text>
                                        <Text style={styles.itemDetail}>Quantity: {item.quantity}</Text>
                                        <Text style={styles.itemAmount}>Total Amount: ₹{item.itemAmount}</Text>
                                    </View>
                                ))
                            ) : (
                                <Text style={styles.emptyText}>No Items Found</Text>
                            )}
                        </View>
                        <ButtonIcon
                            iconDirection="left"
                            text={COLORS.background}
                            color={COLORS.danger}
                            icon={<FontAwesome name='list' size={20} color={COLORS.background} />}

                            title={t('addItem')} onPress={() => {
                                navigation.navigate("AddItems", { items: items })
                            }} />
                    </View>
                    <View style={{ marginTop: 12 }}>

                        {
                            isLoading === false ?
                                <Button title={t('chooseTemplate')} onPress={handleFormSubmission} /> : <ActivityIndicator size={70} color={COLORS.primary} />
                        }
                    </View>

                </View>
            </ScrollView >
        </View >
    );
};

const styles = StyleSheet.create({

    notifactioncricle: {
        height: 16,
        width: 16,
        borderRadius: 15,
        backgroundColor: COLORS.card,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 2,
        right: 2
    },

    TextInput: {
        ...FONTS.fontRegular,
        fontSize: SIZES.font,
        color: COLORS.title,
        height: 60,
        borderRadius: 15,
        paddingHorizontal: 10,
        paddingLeft: 30,
        marginBottom: 10

    },

    customerItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 15,
        // shadowOffset: {
        //     width: 0,
        //     height: 15,
        // },
        // shadowOpacity: 0.34,
        shadowRadius: 31.27,
        marginHorizontal: 10,
        // marginVertical: 4,
        top: 4,
        borderBottomColor: "black",
        borderBottomWidth: 0.2
    },

    addButton: {
        position: 'absolute', // Fixes the button at a particular position
        bottom: 35, // 30px from the bottom
        right: 20, // 20px from the right
        backgroundColor: COLORS.primary, // Matches the button's background color from CSS
        padding: 15, // 15px padding around the button content
        borderRadius: 50, // Circular button
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,  // Shadow for Android
        shadowColor: '#000',  // Shadow for iOS
        shadowOffset: { width: 0, height: 4 },  // Shadow offset for iOS
        shadowOpacity: 0.2,  // Shadow opacity for iOS
        shadowRadius: 8,
        flexDirection: 'row'
        // Shadow blur radius for iOS

    },
    addButtonText: {
        color: COLORS.white,
        fontSize: SIZES.font,
        fontWeight: 'bold',
    },
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: COLORS.white,
    },
    itemContainer: {
        padding: 16,
        marginBottom: 12,
        borderRadius: 8,
        backgroundColor: COLORS.danger,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    itemName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 6,
    },
    itemDetail: {
        fontSize: 14,
        color: COLORS.info,
        marginBottom: 4,
    },
    itemAmount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.success,
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 16,
        color: COLORS.primary,
        marginTop: 20,
    },
})

export default GenerateInvoice;

