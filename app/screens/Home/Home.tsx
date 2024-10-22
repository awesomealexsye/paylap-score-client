import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, TextInput, StyleSheet, SafeAreaView, FlatList, BackHandler, ActivityIndicator } from 'react-native';
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
import CommonService from '../../lib/CommonService';
import StorageService from '../../lib/StorageService';



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



type HomeScreenProps = StackScreenProps<RootStackParamList, 'Home'>

export const Home = ({ navigation }: HomeScreenProps) => {

    const [searchText, setSearchText] = useState('');
    const [customersData, setCustomersData] = useState<any>([]);
    const [homeBanner, setHomeBanner] = useState<any>({});
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [userDetail, setUserDetail] = useState({ name: "", profile_image: "", aadhar_card: "" });
    const [isLoading, setIsLoading] = useState<any>(false);
    useEffect(() => {
        const handleBackPress = () => {
            if (navigation.isFocused() && navigation.getState().routes[navigation.getState().index].name === 'Home') {
                BackHandler.exitApp();
                return true;
            }
            return false;
        }
        BackHandler.addEventListener('hardwareBackPress', handleBackPress);
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
        }
    }, [navigation]);


    useFocusEffect(
        useCallback(() => {
            fetchCustomerList();
            StorageService.isLoggedIn().then(res => { res === false ? navigation.navigate("MobileSignIn") : null; });
            CommonService.currentUserDetail().then((res) => {
                setUserDetail(res);
                if (res.aadhar_card === '') {
                    navigation.navigate("UserKyc");
                }
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
        setIsLoading(true);
        const homeApiRes = await ApiService.postWithToken("api/shopkeeper/list-customer", {});
        if (homeApiRes?.status == true) {

            let homeBanner = homeApiRes?.data?.shopkeeper_transaction_sum;
            setHomeBanner(homeBanner);
            setCustomersData(homeApiRes?.data?.records);
            setFilteredCustomers(homeApiRes?.data?.records);
        }
        setIsLoading(false);
    }


    const dispatch = useDispatch();

    const theme = useTheme();
    const { colors }: { colors: any; } = theme;


    const renderCustomer = ({ item }: { item: Customer }) => (
        <TouchableOpacity onPress={() => { navigation.navigate("CustomerTransations", { item: item }) }}>

            <View style={[styles.customerItem, { backgroundColor: colors.card, marginBottom: 10 }]}>
                <View style={{}}>
                    <View style={{ flexDirection: 'row' }}>
                        <Image
                            style={{ height: 40, width: 40, borderRadius: 50 }}
                            src={item.profile_image}
                        />
                        <View style={{ marginLeft: 14 }}>
                            <Text style={[styles.customerName, { color: colors.title, ...FONTS.fontSemiBold }]}>{item.name.split(' ').slice(0, 2).join(' ')}</Text>
                            <Text style={styles.lastInteraction}>{item.latest_updated_at}</Text>
                        </View>
                    </View>

                </View>

                <View style={{ flexDirection: "column", alignItems: "flex-end", position: "relative" }}>
                    <Text style={{ color: item.transaction_type === "CREDIT" ? COLORS.primaryLight : COLORS.danger, fontSize: 18, fontWeight: "900" }}>₹ {parseInt(item.amount).toLocaleString()}</Text>
                    <Text style={{
                        color: colors.title, fontSize: 12, ...FONTS.fontSemiBold,
                    }}>{item.transaction_type}</Text>
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
                        <View style={{
                            flexDirection: "row", alignItems: "center",
                        }}>
                            < View >
                                {userDetail.profile_image && <Image style={{ height: 45, width: 45, borderRadius: 50 }}
                                    source={{ uri: userDetail.profile_image }} />}

                            </View>
                            <View style={{
                                flexDirection: "column", alignItems: "flex-start", marginLeft: 10, width: "65%"
                            }}>
                                <Text style={{ ...FONTS.fontRegular, fontSize: 12, color: colors.title }}>Namaste</Text>
                                <Text adjustsFontSizeToFit={true} style={{ ...FONTS.fontSemiBold, fontSize: 15, color: colors.title, }}>

                                    {userDetail.name.split(' ')[0]}

                                </Text>
                            </View>

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
            </View >


            {/* AppBar End */}


            < ScrollView showsVerticalScrollIndicator={false} >


                <View style={{ flex: 1, alignItems: 'center' }} >
                    <View style={{
                        height: 140,
                        width: "90%",
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
                        // elevation: 8,
                        flexDirection: 'column',
                        alignItems: "center"

                    }}>


                        <View style={{ width: "90%", flexDirection: 'row', marginTop: 22, rowGap: 4, justifyContent: 'center', alignItems: "center", borderBlockColor: COLORS.white, borderBottomWidth: 1, padding: 10, }}>
                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', borderRightWidth: 1, borderRightColor: COLORS.white }}>
                                <Text style={{ ...FONTS.fontBold, fontSize: SIZES.fontSm, color: COLORS.primaryLight }}>Credit Amt.</Text>
                                <Text style={{ ...FONTS.fontSemiBold, fontSize: SIZES.fontLg, color: COLORS.secondary }}>₹ {homeBanner?.credit}</Text>
                            </View >
                            <View style={{ flex: 1, alignItems: 'center', justifyContent: "center" }}>
                                <Text style={{ ...FONTS.fontBold, fontSize: SIZES.fontSm, color: COLORS.primaryLight }}>Debit Amt.</Text>
                                <Text style={{ ...FONTS.fontSemiBold, fontSize: SIZES.fontLg, color: COLORS.danger }}>₹ {homeBanner?.debit}</Text>
                            </View>
                        </View >
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: "center" }}>
                            <TouchableOpacity style={{}}>
                                <TouchableOpacity onPress={() => navigation.navigate("Report")}>
                                    <Text style={{ color: COLORS.white, ...FONTS.fontBold, fontSize: SIZES.fontSm }}>
                                        VIEW REPORT
                                        <Feather name='arrow-right' size={15} color={COLORS.white} />
                                    </Text>
                                </TouchableOpacity>
                            </TouchableOpacity>

                        </View>
                    </View >
                </View >


                {/* search Box Start */}

                < View style={[GlobalStyleSheet.container, { padding: 0, paddingHorizontal: 30, paddingTop: 35 }]} >
                    <View>
                        <TextInput
                            placeholder='Search Customer'
                            style={[styles.TextInput, { color: colors.title, backgroundColor: colors.card, ...FONTS.fontSemiBold, borderColor: colors.borderColor, borderWidth: 0.2 }]}
                            placeholderTextColor={'#929292'}
                            value={searchText}
                            onChangeText={handleSearch} />
                        <View style={{ position: 'absolute', top: 15, right: 20 }}>
                            <Feather name='search' size={24} color={'#C9C9C9'} />
                        </View>
                    </View>
                </View >

                {/* Search box ends */}

                {
                    isLoading === false ?
                        <FlatList scrollEnabled={false}
                            data={filteredCustomers}
                            renderItem={renderCustomer}
                            keyExtractor={(item, index) => index.toString()}
                            contentContainerStyle={{}} /> : <View style={{ flex: 1, justifyContent: 'center' }} >
                            <ActivityIndicator color={colors.title} size={'large'}></ActivityIndicator>
                        </View>
                }

            </ScrollView >
            <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("AddCustomer")}>
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
        paddingHorizontal: 12,
        paddingVertical: 8,

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
        fontSize: 15,
    },
    lastInteraction: {
        color: '#888',
        fontSize: 12,
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

