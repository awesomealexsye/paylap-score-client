import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, TextInput, StyleSheet, RefreshControl, FlatList, BackHandler, ActivityIndicator } from 'react-native';
import { useTheme, useFocusEffect } from '@react-navigation/native';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import { ApiService } from '../../lib/ApiService';
// import { MessagesService } from '../../lib/MessagesService';
import { useTranslation } from 'react-i18next';
import Header from '../../layout/Header';
import * as WebBrowser from 'expo-web-browser';

interface InvoiceList {
    id: string;
    parent_id: number,
    name: string;
    image: string;
    pdf_url: string;
    created_at_new: string;
}



type SubInvoiceGenListProps = StackScreenProps<RootStackParamList, 'SubInvoiceGenList'>

export const SubInvoiceGenList = ({ navigation, route }: SubInvoiceGenListProps) => {
    const items = route.params?.item;
    const user_invoice_customers_id = items.id;
    const company_id = items.company_id;
    const { t } = useTranslation();

    const [searchText, setSearchText] = useState('');
    const [invoiceGenData, setInvoiceGenData] = useState<any>([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [isLoading, setIsLoading] = useState<any>(false);
    const [isRefreshing, setIsRefreshing] = useState<any>(false);




    useFocusEffect(
        useCallback(() => {
            console.log("first call", items)
            fetchCustomerList();
        }, [])
    );

    const handleOpenWebPage = async (pdf_url: string) => {
        navigation.replace('FinalInvoiceResult', { data: { pdf_url: pdf_url }, previous_screen: "InvoiceGenList" });
        // await WebBrowser.openBrowserAsync(pdf_url);
    };

    const handleSearch = (text: string) => {
        setSearchText(text);
        const filteredList = invoiceGenData.filter((customer: any) =>
            customer.name.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredCustomers(filteredList);
    };

    const fetchCustomerList = async () => {
        setIsLoading(true);
        // console.log(items, "sisd")
        const homeApiRes = await ApiService.postWithToken("api/invoice-generator/invoice/list", {
            user_invoice_customers_id: user_invoice_customers_id,
            company_id: company_id,
            parent_id: items.parent_id
        });
        // console.log(homeApiRes)
        if (homeApiRes?.status == true) {
            setInvoiceGenData(homeApiRes?.data);
            setFilteredCustomers(homeApiRes?.data);
        }
        setIsLoading(false);
    }

    const handelRefresh = async () => {
        setIsRefreshing(true);
        await fetchCustomerList();
        setIsRefreshing(false);
    };

    const dispatch = useDispatch();

    const theme = useTheme();
    const { colors }: { colors: any; } = theme;


    const renderCustomer = ({ item }: { item: InvoiceList }) => (
        <TouchableOpacity onPress={() => {
            handleOpenWebPage(item.pdf_url);
            // console.log(item.pdf_url)

            // navigation.navigate("CustomerTransations", { item: item }) 
        }}>

            <View style={[styles.customerItem, { backgroundColor: colors.card, marginBottom: 10 }]}>
                <View style={{}}>
                    <View style={{ flexDirection: 'row' }}>
                        <Image
                            style={{ height: 40, width: 40, borderRadius: 50 }}
                            src={item.image}
                        />
                        <View style={{ marginLeft: 14 }}>
                            <Text style={{
                                color: colors.title, ...FONTS.fontSemiBold,
                                fontSize: SIZES.font,
                            }}>{item.name.split(' ').slice(0, 2).join(' ')}</Text>
                        </View>

                    </View>

                </View>

                <View style={{ flexDirection: "column", alignItems: "flex-end", position: "relative" }}>
                    <Text>{item.created_at_new}</Text>
                </View>

            </View>
        </TouchableOpacity>
    );






    return (
        <View style={{ backgroundColor: colors.card, flex: 1 }}>
            {/* AppBar Start */}
            <Header
                title={t('subInvoiceGenList')}
                leftIcon={'back'}
                titleRight
            />
            {/* AppBar End */}


            < ScrollView showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={isRefreshing} onRefresh={handelRefresh} />
                }
            >





                {/* search Box Start */}

                <View style={[GlobalStyleSheet.container, { paddingHorizontal: 30, paddingTop: 0 }]}>
                    <View>
                        <TextInput
                            placeholder={t('searchInvoice')}
                            style={[styles.TextInput,
                            {
                                color: colors.title,
                                backgroundColor: colors.card,
                                ...FONTS.fontSemiBold, borderColor: colors.borderColor, borderWidth: 0.2
                            }]}
                            placeholderTextColor={'#929292'}
                            value={searchText}
                            onChangeText={handleSearch} />
                        <View style={{ position: 'absolute', top: 15, right: 20 }}>
                            <Feather name='search' size={24} color={'#C9C9C9'} />
                        </View>
                    </View>
                </View>

                {
                    filteredCustomers.length > 0 ?
                        <View>
                            {isLoading === false ?
                                <FlatList scrollEnabled={false}
                                    data={filteredCustomers}
                                    renderItem={renderCustomer}
                                    keyExtractor={(item, index) => index.toString()}
                                    contentContainerStyle={{}} />
                                :
                                <View style={{ flex: 1, justifyContent: 'center' }}>
                                    <ActivityIndicator color={colors.title} size={'large'}></ActivityIndicator>
                                </View>
                            }
                        </View>
                        :
                        <Text style={{ textAlign: 'center', marginTop: 20 }}>{t('noDataFound')}</Text>
                }
            </ScrollView >
            <TouchableOpacity style={styles.addButton} onPress={() => {
                // console.log(items, "hsdjls")
                navigation.navigate("AddInvoiceDetails", { data: items, items: [], parent_id: items.id })
            }
            }
            >

                <FontAwesome style={{ marginRight: 6, color: COLORS.white }} name={'user-plus'} size={20} />
                <Text style={styles.addButtonText}>{t('generateNew')}</Text>
            </TouchableOpacity>
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
})

export default SubInvoiceGenList;

