import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, TextInput, StyleSheet, SafeAreaView, FlatList } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { IMAGES } from '../../constants/Images';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import { addTowishList } from '../../redux/reducer/wishListReducer';
import { openDrawer } from '../../redux/actions/drawerAction';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { ApiService } from '../../lib/ApiService';
import { MessagesService } from '../../lib/MessagesService';




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

// const customersData: Customer[] = [
// ];




type HomeScreenProps = StackScreenProps<RootStackParamList, 'Home'>

export const Home = ({ navigation }: HomeScreenProps) => {

    const [searchText, setSearchText] = useState('');
    const [customersData, setCustomersData] = useState<any>([]);
    const [homeBanner, setHomeBanner] = useState<any>({});
    const [filteredCustomers, setFilteredCustomers] = useState(customersData);

    useEffect(() => {
        fetchCustomerList();

    }, [])
    const handleSearch = (text: string) => {
        console.log("handle search", text);
        setSearchText(text);
        const filteredList = customersData.filter((customer: Customer) =>
            customer.name.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredCustomers(filteredList);
    };
    const fetchCustomerList = async () => {
        const homeApiRes = await ApiService.postWithToken("api/shopkeeper/list-customer", {});
        if (homeApiRes.status == true) {
            let customersApiData: Customer = homeApiRes?.data?.records;
            let homeBanner = homeApiRes?.data?.shopkeeper_transaction_sum;
            setHomeBanner(homeBanner);
            setCustomersData(customersApiData);
            setFilteredCustomers(customersApiData);
            console.log("c8ster", customersApiData)
        } else {
            MessagesService.commonMessage(homeApiRes.message)
        }
    }


    const dispatch = useDispatch();

    const theme = useTheme();
    const { colors }: { colors: any; } = theme;


    const addItemToWishList = (data: any) => {
        dispatch(addTowishList(data));
    }


    const renderCustomer = ({ item }: { item: Customer }) => (
        <TouchableOpacity onPress={() => { navigation.navigate("CustomerTransations", { item: item }) }}>

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
                    <Text style={item.transaction_type === 'Credit' ? { color: "green", fontSize: 18, fontWeight: "900" } : { fontSize: 18, fontWeight: "900", color: "red" }}>₹ {item.amount}</Text>
                    <Text style={[styles.type, { color: colors.title }]}>{item.transaction_type}</Text>
                </View>

            </View>
        </TouchableOpacity>
    );

    return (
        <View style={{ backgroundColor: colors.card, flex: 1 }}>
            {/* AppBar Start */}
            <View style={{}}>
                {/* Name in Header */}

                <View style={[GlobalStyleSheet.container, { paddingHorizontal: 30, padding: 0, paddingTop: 30 }]}>
                    <View style={[GlobalStyleSheet.flex]}>
                        <View>
                            <Text style={{ ...FONTS.fontRegular, fontSize: 14, color: colors.title }}>Good Morning</Text>
                            <Text style={{ ...FONTS.fontSemiBold, fontSize: 24, color: colors.title }}>Williams</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('Notification')}
                                activeOpacity={0.5}
                                style={[GlobalStyleSheet.background3, {}]}
                            >
                                <Image
                                    style={[GlobalStyleSheet.image3, { tintColor: theme.dark ? COLORS.card : '#5F5F5F' }]}
                                    source={IMAGES.Notification}
                                />
                                <View
                                    style={[styles.notifactioncricle, {
                                        backgroundColor: colors.card,
                                    }]}
                                >
                                    <View
                                        style={{
                                            height: 13,
                                            width: 13,
                                            borderRadius: 13,
                                            backgroundColor: colors.primary
                                        }}
                                    />
                                </View>
                            </TouchableOpacity>

                            {/* /ssafsf


                            */}
                            <TouchableOpacity
                                activeOpacity={0.5}
                                //onPress={() => navigation.openDrawer()}
                                onPress={() => dispatch(openDrawer())}
                                style={[GlobalStyleSheet.background3, {}]}
                            >
                                <Image
                                    style={[GlobalStyleSheet.image3, { tintColor: theme.dark ? COLORS.card : '#5F5F5F' }]}
                                    source={IMAGES.grid6}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>


            {/* AppBar End */}


            <ScrollView showsVerticalScrollIndicator={false}>


                <View style={{ flex: 1, alignItems: 'center' }} >
                    <View style={{
                        height: 140,
                        width: 400,
                        top: 20,
                        backgroundColor: COLORS.primary,
                        borderRadius: 31,
                        shadowColor: "#025135",
                        shadowOffset: {
                            width: 0,
                            height: 15,
                        },
                        shadowOpacity: 0.34,
                        shadowRadius: 31.27,
                        elevation: 8, flexDirection: 'column'
                    }}>


                        <View style={{ width: 400, flexDirection: 'row', marginTop: 22, rowGap: 4, justifyContent: 'center', borderBlockColor: COLORS.white, borderBottomWidth: 1, padding: 10 }}>
                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', borderRightWidth: 1, borderRightColor: COLORS.white }}>
                                <Text style={{ ...FONTS.fontBold, fontSize: SIZES.h6, color: COLORS.primaryLight }}>Credit Amt.</Text>
                                <Text style={{ ...FONTS.fontSemiBold, fontSize: SIZES.h3, color: COLORS.secondary }}>₹ {homeBanner?.credit}</Text>
                            </View>
                            <View style={{ flex: 1, alignItems: 'center', justifyContent: "center" }}>
                                <Text style={{ ...FONTS.fontBold, fontSize: SIZES.h6, color: COLORS.primaryLight }}>Debit Amt.</Text>
                                <Text style={{ ...FONTS.fontSemiBold, fontSize: SIZES.h3, color: COLORS.danger }}>₹ {homeBanner?.debit}</Text>
                            </View>
                        </View>
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: "center" }}>
                            <TouchableOpacity style={{}}>
                                <Text style={{ color: COLORS.white, ...FONTS.fontBold, }}>
                                    VIEW REPORT
                                    <Feather name='arrow-right' size={16} color={COLORS.white} />
                                </Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                </View>


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
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{}}

                />

            </ScrollView>
            <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("AddCustomer")}>
                <FontAwesome style={{ marginRight: 6, color: COLORS.white }} name={'user-plus'} size={20} />
                <Text style={styles.addButtonText}>
                    Add Customer</Text>
            </TouchableOpacity>
        </View>
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
        // borderWidth: 1,
        //  borderColor:'#EBEBEB',
        // backgroundColor: '#FAFAFA',
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
        // shadowColor: "#025135",
        shadowOffset: {
            width: 0,
            height: 15,
        },
        shadowOpacity: 0.34,
        shadowRadius: 31.27,
        marginHorizontal: 10,
        marginVertical: 4,
        // elevation: 4,
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

export default Home;

