import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl, ActivityIndicator } from 'react-native';
import { useFocusEffect, useTheme } from '@react-navigation/native';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { FontAwesome } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import { ApiService } from '../../lib/ApiService';
// import { MessagesService } from '../../lib/MessagesService';
import { useTranslation } from 'react-i18next';
import Header from '../../layout/Header';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import ButtonIcon from '../../components/Button/ButtonIcon';
import { MessagesService } from '../../lib/MessagesService';
import Divider from '../../components/Dividers/Divider';

type AddInvoiceDetailsProps = StackScreenProps<RootStackParamList, 'AddInvoiceDetails'>
export const AddInvoiceDetails = ({ navigation, route }: AddInvoiceDetailsProps) => {
    const { t } = useTranslation();
    const items = route.params.items;
    // const company_id = route.params.data.company_id;
    const dataParam = route.params.data;
    const parent_id = route.params.parent_id;
    // console.log("parent_idparent_id..", parent_id);

    const [isLoading, setIsLoading] = useState<any>(false);

    const [invoiceName, setInvoiceName] = useState('');
    const [notes, setNotes] = useState('');
    const [receivedAmount, setReceivedAmount] = useState('');
    const [invoiceTotalAmount, setInvoiceTotalAmount] = useState(0);




    const handleAllitemAmount = () => {
        setInvoiceTotalAmount(0);
        let allitemsAmount = 0;
        // console.log("handleAllitemamount callin....")
        if (items.length > 0) {
            items.map((item: any) => {
                allitemsAmount += item.ratePerItem * item.quantity;
            })
            setInvoiceTotalAmount(allitemsAmount);
        }
    }

    // useFocusEffect(
    //     useCallback(() => {
    //         handleAllitemAmount();
    //         console.log("invoice total amount::", invoiceTotalAmount);

    //     }, [])
    // );

    useEffect(() => {
        // setReceivedAmount(`${invoiceTotalAmount}`)
        handleAllitemAmount();
    }, [items]);


    const handleFormSubmission = () => {
        // console.log(company_id)
        // Basic validation
        if (!invoiceName) {
            MessagesService.commonMessage("Invoice Name is Required.", "ERROR")
        } else if (items.length <= 0) {
            MessagesService.commonMessage("1 item is required.", "ERROR")
        }
        else if (Number(receivedAmount) > invoiceTotalAmount) {
            MessagesService.commonMessage("Received Amount should be smaller than Total Amount.", "ERROR")
        } else {
            const data = {
                name: invoiceName,
                company_id: dataParam.company_id,
                user_invoice_customers_id: dataParam.id,//user_invoice_customers_id id
                item_info: items,
                amount_info: { total_amount: invoiceTotalAmount, received_amount: Number(receivedAmount) },
                notes: notes,
                parent_id: parent_id
            }
            // console.log(data, "dataapi");
            // console.log("dataparamssss122", dataParam, "Secpmd", data);
            navigation.navigate("ChooseInvoiceDesign", { data: data });
        }

    };


    const dispatch = useDispatch();

    const theme = useTheme();
    const { colors }: { colors: any; } = theme;


    return (
        <View style={{ backgroundColor: colors.card, flex: 1 }}>
            {/* AppBar Start */}
            <Header
                title={t('addCustomerDetail')}
                leftIcon={'back'}
                titleRight
            />
            {/* AppBar End */}


            < ScrollView showsVerticalScrollIndicator={false}
            >
                <View style={[GlobalStyleSheet.container]}>
                    <View style={{ marginTop: 10 }}>
                        <Input
                            inputRounded
                            placeholder={t('invoiceName')}
                            value={invoiceName}
                            onChangeText={setInvoiceName}
                            maxlength={20}
                        />
                    </View>
                    <View style={{ marginTop: 10, gap: 10 }}>

                    </View>
                    <View style={{ marginTop: 20 }}>
                        <Input
                            inputRounded
                            placeholder={t('notes')}
                            value={notes}
                            onChangeText={setNotes}
                            maxlength={150}
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
                                <Text style={[styles.emptyText, { color: colors.title }]}>No Items Found</Text>
                            )}
                        </View>
                        <ButtonIcon
                            iconDirection="left"
                            text={COLORS.background}
                            color={COLORS.info}
                            icon={<FontAwesome name='list' size={20} color={COLORS.background} />}

                            title={t('addItem')} onPress={() => {
                                navigation.navigate("AddItems", { items: items, data: dataParam })
                            }} />
                    </View>
                    <View style={{ marginTop: 20 }}>
                        <Text>{t('enterReceivedAmount')}</Text>
                        <Input
                            inputRounded
                            // placeholder={t('receivedAmount')}
                            value={receivedAmount}
                            onChangeText={(value) => {
                                value = Number(value)
                                if (invoiceTotalAmount >= value) {
                                    setReceivedAmount(`${value}`)
                                }
                            }}
                            maxlength={150}
                            keyboardType={'number-pad'}
                        />
                    </View>
                    <View>
                        <Text style={[styles.emptyText, { color: COLORS.info }]}>{t('totalInvoiceAmount')}: ₹{invoiceTotalAmount}</Text>
                        <Text style={[styles.emptyText, { color: COLORS.info }]}>{t('pendingAmount')}: ₹{invoiceTotalAmount - Number(receivedAmount)}</Text>

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
        // padding: 5,
        // backgroundColor: COLORS.white,
    },
    itemContainer: {
        padding: 16,
        marginVertical: 12,
        borderRadius: 8,
        backgroundColor: COLORS.primary,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    itemName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.background,
        marginBottom: 6,
    },
    itemDetail: {
        fontSize: 14,
        color: COLORS.secondary,
        marginBottom: 4,
    },
    itemAmount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.background,
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 16,
        color: COLORS.primary,
        marginVertical: 20,
    },
})

export default AddInvoiceDetails;

