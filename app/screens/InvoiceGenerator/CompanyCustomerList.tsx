import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    FlatList,
    Modal,
    ActivityIndicator,
    TouchableWithoutFeedback
} from 'react-native';
import { useIsFocused, useTheme } from '@react-navigation/native';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import { ApiService } from '../../lib/ApiService';
import { useTranslation } from 'react-i18next';
import StorageService from '../../lib/StorageService';
import CONFIG from '../../constants/config';

type CompanyCustomerListProps = StackScreenProps<RootStackParamList, 'CompanyCustomerList'>;

export const CompanyCustomerList = ({ navigation }: CompanyCustomerListProps) => {
    const { t } = useTranslation();
    const [searchText, setSearchText] = useState('');
    const [invoiceGenData, setInvoiceGenData] = useState<any>([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isCompanyModalVisible, setCompanyModalVisible] = useState(false);
    const [companyList, setCompanyList] = useState<any>([]);
    const [companyId, setCompanyId] = useState<number>(0);
    const [companyName, setCompanyName] = useState(null);

    const dispatch = useDispatch();
    const theme = useTheme();
    const { colors }: { colors: any } = theme;
    const isFocused = useIsFocused();

    useEffect(() => {
        fetchCompaniesList();
    }, [isFocused]);

    useEffect(() => {
        getCompanyStorageObj();
        fetchInvoiceList();
        // console.log(companyId, "companyid");
    }, [companyId, isFocused]);

    const handleSearch = (text: string) => {
        setSearchText(text);
        const filteredList = invoiceGenData.filter((invoice: any) =>
            invoice.name.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredCustomers(filteredList);
    };



    const getCompanyStorageObj = async () => {
        // await StorageService.removeAllStorageValue([CONFIG.HARDCODE_VALUES.INVOICE_COMPANY]);

        let data = await StorageService.getStorage(CONFIG.HARDCODE_VALUES.INVOICE_COMPANY);
        if (data != null) {
            let dataObj = JSON.parse(data);
            setCompanyName(dataObj.company_name);
            setCompanyId(dataObj.company_id);
            return dataObj;
        } else {
            console.log("INVOICE_COMPANY data ", data);
            return null;
        }

    }

    const fetchInvoiceList = async () => {
        if (!companyId) return;
        setIsLoading(true);
        let company_id_setup;
        // let company_id_local_storage = await StorageService.getStorage(CONFIG.HARDCODE_VALUES.INVOICE_COMPANY);
        let company_id_local_storage = await getCompanyStorageObj();
        if (company_id_local_storage != null) {
            company_id_setup = company_id_local_storage.company_id;
        } else {
            company_id_setup = companyId;
        }
        const homeApiRes = await ApiService.postWithToken("api/invoice-generator/customer/list", {
            company_id: company_id_setup
        });
        if (homeApiRes?.status === true) {
            setInvoiceGenData(homeApiRes.data);
            setFilteredCustomers(homeApiRes.data);
        }
        setIsLoading(false);
    };

    const fetchCompaniesList = async () => {
        const companyRes = await ApiService.postWithToken("api/invoice-generator/companies/list", {});
        if (companyRes?.status === true) {
            const fullCompanies = companyRes.data.map((company: any) => {
                return {
                    ...company,
                    image: companyRes.image_path + company.image,
                };
            });
            setCompanyList(fullCompanies);
            if (fullCompanies.length > 0) {
                const checkCompanyIdLocalStorage = await StorageService.getStorage(CONFIG.HARDCODE_VALUES.INVOICE_COMPANY);
                if (checkCompanyIdLocalStorage == null) {
                    handleCompanySelect(fullCompanies[0]);
                }
            }
        }
    };

    const handleCompanySelect = async (company: any) => {
        StorageService.setStorage(CONFIG.HARDCODE_VALUES.INVOICE_COMPANY, JSON.stringify({
            company_name: company.name, company_id: String(company.id)
        })).then(() => {
            setCompanyId(company.id ?? 0);
            setCompanyModalVisible(false);
        });
    };

    const openCompanyModal = () => {
        setCompanyModalVisible(true);
    };

    const closeCompanyModal = () => {
        setCompanyModalVisible(false);
    };

    const renderCustomer = ({ item }: { item: any }) => (
        <TouchableOpacity onPress={() => navigation.navigate("InvoiceGenList", { item: item })}>
            <View style={[styles.customerItem, { backgroundColor: colors.card }]}>
                <View style={{ flexDirection: 'row' }}>
                    <Image style={{ height: 40, width: 40, borderRadius: 50 }} source={{ uri: item.image }} />
                    <View style={{ marginLeft: 14 }}>
                        <Text style={[{ color: colors.title, ...FONTS.fontSemiBold, fontSize: SIZES.font }]}>
                            {item.name.split(' ').slice(0, 2).join(' ')}
                        </Text>
                    </View>
                </View>
                <Text>{item.created_at_new}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={{ backgroundColor: colors.card, flex: 1 }}>
            {/* Replacing Header with Select Company button */}
            <View style={styles.selectCompanyWrapper}>
                <TouchableOpacity style={styles.selectCompanyButton} onPress={openCompanyModal}>
                    <Text style={styles.selectCompanyText}>{companyName != null ? companyName : t('selectCompany')}</Text>
                    <FontAwesome name={'angle-down'} style={{ marginLeft: 12, color: COLORS.primary }} color={colors.title} size={25} />
                </TouchableOpacity>
            </View>

            {/* Removed ScrollView and used FlatList for both search and customers */}
            {filteredCustomers.length > 0 ?
                <FlatList
                    ListHeaderComponent={
                        <>
                            {/* Search Box */}
                            <View style={styles.searchBox}>
                                <TextInput
                                    placeholder={t('searchCustomer')}
                                    style={styles.textInput}
                                    placeholderTextColor="#929292"
                                    value={searchText}
                                    onChangeText={handleSearch}
                                />
                                <Feather name="search" size={24} color="#C9C9C9" style={styles.searchIcon} />
                            </View>
                        </>
                    }
                    data={filteredCustomers}
                    renderItem={renderCustomer}
                    keyExtractor={(item) => item.id.toString()}
                    ListFooterComponent={
                        isLoading ? (
                            <ActivityIndicator color={colors.title} size="large" />
                        ) : null
                    }
                />
                :
                <Text style={{ textAlign: 'center', marginTop: 20 }}>{t('noDataFound')}</Text>

            }

            {/* Static Add Customer button at the bottom right */}
            {companyId != 0 ?
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => {
                        closeCompanyModal();
                        navigation.navigate("AddCompanyCustomer", { data: { company_id: companyId }, items: [] });
                    }}
                >
                    <FontAwesome style={{ marginRight: 6, color: COLORS.white }} name="user-plus" size={20} />
                    <Text style={styles.addButtonText}>{t('addCustomer')}</Text>
                </TouchableOpacity>
                : ''}

            {/* Modal for selecting company */}
            <Modal
                visible={isCompanyModalVisible}
                animationType="slide"
                transparent
                onRequestClose={closeCompanyModal}
            >
                <TouchableWithoutFeedback onPress={closeCompanyModal}>
                    <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback>
                            <View style={styles.modalContainer}>
                                <Text style={styles.modalHeader}>{t('selectCompany')}</Text>
                                {companyList.length > 0 ?
                                    <FlatList
                                        data={companyList}
                                        keyExtractor={(item) => item.id.toString()}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity style={styles.companyItem} onPress={() => handleCompanySelect(item)}>
                                                <Image source={{ uri: item.image }} style={styles.companyImage} />
                                                <Text style={styles.companyName}>{item.name}</Text>
                                            </TouchableOpacity>
                                        )}
                                    />

                                    :
                                    <Text style={{ textAlign: 'center' }}>{t('noCompanyCreated')}</Text>
                                }
                                <TouchableOpacity style={styles.closeButton} onPress={() => navigation.navigate("AddCompany")}>
                                    <Text style={styles.closeButtonText}>{t('createNewCompany')}</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    selectCompanyWrapper: {
        paddingTop: 20,
        paddingLeft: 15,
    },
    selectCompanyButton: {
        backgroundColor: 'transparent',
        paddingVertical: 12,
        paddingHorizontal: 15,
        // borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        // borderWidth: 1,
        // borderColor: COLORS.primary,
        // backgroundColor: 'linear-gradient(45deg, #FF7F50, #FF6347)', // Gradient background
    },
    selectCompanyText: {
        color: COLORS.primary,
        fontSize: 16,
        fontWeight: '600',
    },
    searchBox: {
        marginHorizontal: 30,
        marginTop: 20,
    },
    textInput: {
        height: 55,
        borderRadius: 12,
        paddingLeft: 40,
        paddingRight: 20,
        backgroundColor: COLORS.card,
        borderWidth: 0.5,
        borderColor: COLORS.borderColor,
        color: COLORS.title,
        ...FONTS.fontSemiBold,
    },
    searchIcon: {
        position: 'absolute',
        top: 15,
        right: 20,
    },
    addButton: {
        position: 'absolute',
        bottom: 35,
        right: 20,
        backgroundColor: COLORS.primary,
        padding: 16,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        flexDirection: 'row',
    },
    addButtonText: {
        color: COLORS.white,
        fontSize: SIZES.font,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        maxHeight: '65%',
        backgroundColor: COLORS.card,
        padding: 20,
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 8,
    },
    modalHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.title,
        marginBottom: 20,
        textAlign: 'center',
    },
    companyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    companyImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 15,
    },
    companyName: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.title,
    },
    closeButton: {
        marginTop: 50,
        backgroundColor: COLORS.primary,
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 10,
        alignSelf: 'center',

    },
    closeButtonText: {
        color: COLORS.white,
        fontWeight: '600',
        fontSize: 16,
    },
    customerItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 15,
        backgroundColor: COLORS.card,
        marginHorizontal: 10,
        marginBottom: 15,
        shadowColor: COLORS.shadowColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        borderBottomWidth: 0.5,
        borderBottomColor: COLORS.borderColor,
    },
});

export default CompanyCustomerList;
