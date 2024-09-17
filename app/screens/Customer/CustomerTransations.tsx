import React, { useRef, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, TextInput, StyleSheet, SafeAreaView, FlatList, TouchableHighlight } from 'react-native';
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
import HeaderWithImage from '../../layout/HeaderWithImage';
import Header from '../../layout/Header';
import { Icon } from 'react-native-paper/lib/typescript/components/Avatar/Avatar';
import SocialBtn from '../../components/Socials/SocialBtn';
import CustomerActivityBtn from './CustomerActivityBtn';




interface Customer {
    id: string;
    name: string;
    amount: string;
    lastInteraction: string;
    type: string;
    transactionDate: Date;
    desc: string;
}

const customersData: Customer[] = [
    { id: '1', name: 'Anup Gujjar', amount: '₹ 71,600', transactionDate: new Date(), lastInteraction: '1 week ago', type: "Debit", desc: "Given products to by" },
    { id: '2', name: 'Mukeem Bhaiya', amount: '₹ 10,000', lastInteraction: '2 weeks ago', transactionDate: new Date(), type: "Credit", desc: "Given products to by" },
    { id: '3', name: 'Vakil CustomerTransations', amount: '₹ 400', lastInteraction: '3 weeks ago', transactionDate: new Date(), type: "Credit", desc: "Given products to by" },
    { id: '4', name: 'Ajay College', amount: '₹ 0', lastInteraction: '1 month ago', transactionDate: new Date(), type: "Credit", desc: "Given products to by" },
    { id: '5', name: 'Rashik Khan Parvana', amount: '₹0', lastInteraction: '1 month ago', transactionDate: new Date(), type: "Credit", desc: "Given products to by" },
    { id: '6', name: 'Sunil Sir', amount: '₹ 6', lastInteraction: '1 month ago', transactionDate: new Date(), type: "Credit", desc: "Given products to by" },
    { id: '7', name: 'Talib Khan', amount: '₹ 3,000', lastInteraction: '1 month ago', transactionDate: new Date(), type: "Credit", desc: "Given products to by" },
];




type CustomerTransationsScreenProps = StackScreenProps<RootStackParamList, 'CustomerTransations'>

export const CustomerTransations = ({ navigation, route }: CustomerTransationsScreenProps) => {
    const { item } = route.params;


    const [searchText, setSearchText] = useState('');
    const [filteredCustomers, setFilteredCustomers] = useState(customersData);

    const handleSearch = (text: string) => {
        setSearchText(text);
        const filteredList = customersData.filter(customer =>
            customer.name.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredCustomers(filteredList);
    };


    const dispatch = useDispatch();

    const theme = useTheme();
    const { colors }: { colors: any; } = theme;


    const addItemToWishList = (data: any) => {
        dispatch(addTowishList(data));
    }


    const renderCustomer = ({ item }: { item: Customer }) => (
        <TouchableOpacity onPress={() => navigation.navigate("CustomerTransationsDetails", { transationId: "" })
        }>
            <View style={[styles.customerItem, { backgroundColor: colors.card }]}>
                <View style={{}}>
                    <View style={{ flexDirection: 'row' }}>
                        {/* <Image
                        style={{ height: 50, width: 50, borderRadius: 50 }}
                        source={IMAGES.small6}
                    /> */}
                        <View style={{ marginLeft: 14 }}>
                            <Text style={[styles.customerName, { color: colors.title, ...FONTS.fontSemiBold }]}>{item.name}</Text>
                            <Text style={styles.lastInteraction}>{item.lastInteraction}</Text>
                            <Text style={styles.lastInteraction}>{item.transactionDate.toLocaleString()}</Text>
                            <Text style={styles.lastInteraction}>{item.desc}</Text>
                        </View>

                    </View>

                </View>

                <View style={{ flexDirection: "column", alignItems: "center", position: "relative" }}>
                    <Text style={item.type === 'Credit' ? { color: "green", fontSize: 18, fontWeight: "900" } : { fontSize: 18, fontWeight: "900", color: "red" }}>{item.amount}</Text>
                    <Text style={[styles.type, { color: colors.title }]}>{item.type}</Text>
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
                        //borderBlockColor:colors.border
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
                            {/* <Ionicons size={20} color={colors.title} name='chevron-back'/> */}
                            <Feather size={24} color={colors.title} name={'arrow-left'} />
                        </TouchableOpacity>
                        <Image
                            style={{ height: 40, width: 40, borderRadius: 12, marginLeft: 10, marginRight: 15, resizeMode: 'contain' }}
                            source={item.profileImage}
                        />
                        <View>
                            <Text style={{ ...FONTS.fontSemiBold, fontSize: 18, color: colors.title, }}>{item.name}</Text>
                        </View>
                    </View>
                    {/* <TouchableOpacity
                        onPress={() => navigation.navigate('Call')}
                    >  <FontAwesome style={{ marginRight: 15, color: colors.white }} name={'ellipsis-v'} size={20} />
                    </TouchableOpacity> */}
                </View>
            </View>




            {/* AppBar End */}


            <ScrollView showsVerticalScrollIndicator={true}>


                <View style={{ flex: 1, alignItems: 'center' }} >
                    <View style={{
                        height: 80,
                        width: 400,
                        top: 15,
                        backgroundColor: COLORS.primary,
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


                        <View style={{ width: 400, flexDirection: 'row', justifyContent: "space-evenly", paddingTop: 20, alignItems: "center", alignContent: "center" }}>
                            <View style={{ alignItems: 'center', justifyContent: 'center', borderRightColor: colors.dark }}>
                                <Text style={{ ...FONTS.fontSemiBold, fontSize: SIZES.h3, color: COLORS.primaryLight, textAlign: "center" }}>{item.type}</Text>
                            </View>
                            <View style={{ alignItems: 'center', justifyContent: "center" }}>
                                <Text style={{ ...FONTS.fontSemiBold, fontSize: SIZES.h3, color: COLORS.danger }}>{item.amount}</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={[GlobalStyleSheet.cardBody, { marginTop: 20 }]}>
                    <View style={{}}>
                        <View style={[{ flexDirection: "row", justifyContent: "space-evenly", alignItems: "center", marginBottom: 10 }]}>
                            <CustomerActivityBtn

                                gap
                                icon={<FontAwesome style={{ color: colors.title }} name={'file-pdf-o'} size={20} />}
                                color={colors.card}
                                text='Report'
                            />
                            <CustomerActivityBtn
                                gap
                                icon={<FontAwesome style={{ color: colors.title }} name={'rupee'} size={20} />}
                                color={colors.card}
                                text='Payments'
                            /><CustomerActivityBtn
                                gap
                                icon={<FontAwesome style={{ color: colors.title }} name={'bell'} size={20} />}
                                color={colors.card}
                                text='Reminder'
                            /><CustomerActivityBtn
                                gap
                                icon={<FontAwesome style={{ color: colors.title }} name={'envelope'} size={20} />}
                                color={colors.card}
                                text='SMS'
                            />
                        </View>

                    </View>
                </View>

                {/* search Box Start */}

                {/* <View style={[GlobalStyleSheet.container, { padding: 0, paddingHorizontal: 22, paddingTop: 10 }]}>
                    <View>
                        <TextInput
                            placeholder='Search ShopKeeper'
                            style={[styles.TextInput, { color: colors.title, backgroundColor: colors.card, ...FONTS.fontSemiBold }]}
                            placeholderTextColor={'#929292'}
                            value={searchText}
                            onChangeText={handleSearch} />
                        <View style={{ position: 'absolute', top: 15, right: 20 }}>
                            <Feather name='search' size={24} color={'#C9C9C9'} />
                        </View>
                    </View>
                </View> */}

                {/* Search box ends */}


                <FlatList scrollEnabled={false}
                    data={filteredCustomers}
                    renderItem={renderCustomer}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{}}

                />

            </ScrollView>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 30, backgroundColor: colors.dark }}>
                <TouchableOpacity style={[styles.addAmmount]} onPress={() => navigation.navigate("AddPayment")}>

                    <Text style={styles.addButtonText}>
                        Debit Ammount</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.removeBtn} onPress={() => navigation.navigate("AddPayment")}>

                    <Text style={styles.addButtonText}>
                        Credit Ammount</Text>
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
        //  borderColor:'#EBEBEB',
        backgroundColor: '#FAFAFA',
        marginBottom: 10

    },
    // brandsubtitle2: {
    //     ...FONTS.fontSemiBold,
    //     fontSize: 12,
    //     color: COLORS.card
    // },
    // brandsubtitle3: {
    //     ...FONTS.fontMedium,
    //     fontSize: 12,
    //     color: COLORS.title
    // },


    customerList: {
        marginBottom: 100, // Leave space for the floating button
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
        fontSize: 16,
        fontWeight: 'bold',
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
