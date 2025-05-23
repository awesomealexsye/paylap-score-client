
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, TextInput, StyleSheet, SafeAreaView, FlatList, BackHandler } from 'react-native';
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
import { MessagesService } from '../../lib/MessagesService';
import CommonService from '../../lib/CommonService';
import Header from '../../layout/Header';



interface Customer {
    id: string;
    customer_id: string;
    name: string;
    amount: string;
    joined_at: string;
    latest_updated_at: string;
    transaction_type: string;
    profile_image: any;
}



type LedgerMainProps = StackScreenProps<RootStackParamList, 'LedgerMain'>

export const LedgerMain = ({ navigation }: LedgerMainProps) => {
    console.log(navigation);

    const [searchText, setSearchText] = useState('');
    const [customersData, setCustomersData] = useState<any>([]);
    const [homeBanner, setHomeBanner] = useState<any>({});
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [userDetail, setUserDetail] = useState({ name: "", profile_image: "" });

    useEffect(() => {
        const handleBackPress = () => {
            if (navigation.isFocused() && navigation.getState().routes[navigation.getState().index].name === 'Home') {
                console.log("calling back exit");
                BackHandler.exitApp();
                return true;
            }
            return false;
        }
        BackHandler.addEventListener('hardwareBackPress', handleBackPress);
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
        }
    }, [navigation])



    useFocusEffect(
        useCallback(() => {
            fetchCustomerList();
            CommonService.currentUserDetail().then((res) => {
                setUserDetail(res);
            })
        }, [])
    );


    const handleSearch = (text: string) => {
        setSearchText(text);
        const filteredList = customersData.filter((customer: any) =>
            customer.name.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredCustomers(filteredList);
    };

    const fetchCustomerList = async () => {
        const homeApiRes = await ApiService.postWithToken("api/shopkeeper/list-customer", {});
        if (homeApiRes?.status == true) {
            let homeBanner = homeApiRes?.data?.shopkeeper_transaction_sum;
            setHomeBanner(homeBanner);
            setCustomersData(homeApiRes?.data?.records);
            setFilteredCustomers(homeApiRes?.data?.records);
        }
    }


    const dispatch = useDispatch();

    const theme = useTheme();
    const { colors }: { colors: any; } = theme;


    const renderCustomer = ({ item }: { item: Customer }) => (
        <TouchableOpacity onPress={() => { navigation.navigate("LedgerCustomerDetails", { customer: item }) }}>

            <View style={[styles.customerItem, { backgroundColor: colors.card }]}>
                <View style={{}}>
                    <View style={{ flexDirection: 'row' }}>
                        <Image
                            style={{ height: 50, width: 50, borderRadius: 50 }}
                            src={item.profile_image}
                        />
                        <View style={{ marginLeft: 14 }}>
                            <Text style={[styles.customerName, { color: colors.title, ...FONTS.fontSemiBold }]}>{item.name}</Text>
                            <Text style={styles.lastInteraction}>{item.latest_updated_at}</Text>
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

            <Header
                title={'Ledger Book'}
                leftIcon={'back'}
                titleRight
            />

            < ScrollView showsVerticalScrollIndicator={false} >


                {/* search Box Start */}

                <View style={[GlobalStyleSheet.container, { padding: 0, paddingHorizontal: 30, paddingTop: 35 }]}>
                    <View>
                        <TextInput
                            placeholder='Search Customer'
                            style={[styles.TextInput, { color: colors.title, backgroundColor: colors.card, ...FONTS.fontSemiBold }]}
                            placeholderTextColor={'#929292'}
                            value={searchText}
                            onChangeText={handleSearch} />
                        <View style={{ position: 'absolute', top: 15, right: 20 }}>
                            <Feather name='search' size={24} color={'#C9C9C9'} />
                        </View>
                    </View>
                </View>

                {/* Search box ends */}


                <FlatList scrollEnabled={false}
                    data={filteredCustomers}
                    renderItem={renderCustomer}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={{}}

                />

            </ScrollView >
            <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("LedgerAddCustomer")}>
                <FontAwesome style={{ marginRight: 6, color: COLORS.white }} name={'user-plus'} size={20} />
                <Text style={styles.addButtonText}>
                    Add Customer</Text>
            </TouchableOpacity>
        </View >
    );
};

const styles = StyleSheet.create({

    notifactioncricle: {
        height: 16,
        width: 16,
        borderRadius: 16,
        backgroundColor: COLORS.card,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 2,
        right: 2
    },

    TextInput: {
        ...FONTS.fontRegular,
        fontSize: 16,
        color: COLORS.title,
        height: 60,
        borderRadius: 61,
        paddingHorizontal: 10,
        paddingLeft: 30,
        marginBottom: 10

    },
    brandsubtitle2: {
        ...FONTS.fontSemiBold,
        fontSize: 12,
        color: COLORS.card
    },
    brandsubtitle3: {
        ...FONTS.fontMedium,
        fontSize: 12,
        color: COLORS.title
    },


    customerList: {
        marginBottom: 100, // Leave space for the floating button
    },


    customerItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,

        backgroundColor: Colors.white,
        borderRadius: 18,
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
        fontSize: 16,
        fontWeight: 'bold',
    },
})

export default LedgerMain;

