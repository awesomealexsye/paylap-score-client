import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, TextInput, StyleSheet, RefreshControl, FlatList, BackHandler, ActivityIndicator, Alert } from 'react-native';
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
import Divider from '../../components/Dividers/Divider';

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



type AddItemsProps = StackScreenProps<RootStackParamList, 'AddItems'>

export const AddItems = ({ navigation, route }: AddItemsProps) => {

    const itemsRouteParam = route.params.items;
    console.log("ItemParams", itemsRouteParam)
    const mainItemChoose = itemsRouteParam.length > 0 ? itemsRouteParam : [
        { id: 1, itemName: '', ratePerItem: '', quantity: '', itemAmount: '0' },
    ];

    // useEffect(() => { handleFormSubmission() }, [])
    const { t } = useTranslation();

    const [items, setItems] = useState(mainItemChoose);

    const handleAddNewItem = () => {
        const newItem = {
            id: items.length + 1,
            itemName: '',
            ratePerItem: '',
            quantity: '',
            itemAmount: '0',
        };
        setItems([...items, newItem]);
    };

    const handleInputChange = (id: number, field: string, value: string) => {
        const updatedItems = items.map((item: any) => {
            if (item.id === id) {
                const updatedItem = { ...item, [field]: value };

                // Dynamically calculate itemAmount
                if (field === 'ratePerItem' || field === 'quantity') {
                    const rate = parseFloat(updatedItem.ratePerItem) || 0;
                    const quantity = parseFloat(updatedItem.quantity) || 0;
                    updatedItem.itemAmount = (rate * quantity).toFixed(2); // Ensure 2 decimal places
                }

                return updatedItem;
            }
            return item;
        });

        setItems(updatedItems);
    };

    // const handleFormSubmission = () => {
    //     console.log('Submitted Items:', items);
    //     navigation.goBack();
    //     navigation.navigate("GenerateInvoice", { items: items });
    // };
    const handleDeleteItem = (id: number) => {
        const updatedItems = items.filter((item: any) => item.id !== id);
        setItems(updatedItems);
    };

    const handleFormSubmission = () => {
        // Check if all fields are filled for each item
        const isValid = items.every((item: any) =>
            item.itemName.trim() !== '' &&
            item.ratePerItem.trim() !== '' &&
            item.quantity.trim() !== '' &&
            item.itemAmount.trim() !== ''
        );

        if (!isValid) {
            Alert.alert('Validation Error', 'All fields are required. Please fill out every field.');
            return;
        }

        // If all fields are valid, navigate back and pass the items
        navigation.goBack();
        navigation.navigate("AddInvoiceDetails", { items: items });
    };

    const theme = useTheme();
    const { colors }: { colors: any } = theme;

    return (
        <View style={{ backgroundColor: colors.card, flex: 1 }}>
            {/* AppBar Start */}
            <Header
                title={t('addItem')}
                leftIcon={'back'}
                titleRight
            />
            {/* AppBar End */}

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={[GlobalStyleSheet.container]}>
                    {items.map((item: any, index: any) => (
                        <View key={item.id} style={{ marginBottom: 15 }}>
                            <View style={{ marginTop: 10 }}>
                                <Input
                                    inputRounded
                                    placeholder={`Item Name ${index + 1}`}
                                    value={item.itemName}
                                    onChangeText={(text) => handleInputChange(item.id, 'itemName', text)}
                                    maxlength={20}
                                />
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10, marginTop: 12 }}>
                                <Input
                                    inputRounded
                                    placeholder={`Rate Per Item ${index + 1}`}
                                    value={item.ratePerItem}
                                    onChangeText={(text) => handleInputChange(item.id, 'ratePerItem', text)}
                                    maxlength={20}
                                    style={{ flex: 1 }}
                                    keyboardType="numeric"
                                />
                                <Input
                                    inputRounded
                                    placeholder={`Quantity ${index + 1}`}
                                    value={item.quantity}
                                    onChangeText={(text) => handleInputChange(item.id, 'quantity', text)}
                                    maxlength={25}
                                    style={{ flex: 1 }}
                                    keyboardType="numeric"
                                />
                            </View>
                            <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Input
                                    inputRounded
                                    placeholder={`Amount ${index + 1}`}
                                    value={`₹${item.itemAmount}`}
                                    editable={false} // Read-only
                                    style={{ backgroundColor: COLORS.primary, flex: 1 }} // Optional: Gray background for read-only
                                />
                                <TouchableOpacity
                                    onPress={() => handleDeleteItem(item.id)}
                                    style={{
                                        marginLeft: 10,
                                        backgroundColor: COLORS.danger,
                                        borderRadius: 50,
                                        padding: 10,
                                    }}
                                >
                                    <FontAwesome name="trash" size={18} color={COLORS.background} />
                                </TouchableOpacity>
                            </View>
                            <Divider dashed={'solid'} color={COLORS.info} />
                        </View>
                    ))}
                    <ButtonIcon
                        title="Add New Item"
                        iconDirection="left"
                        text={COLORS.background}
                        color={COLORS.info}
                        size={'md'}
                        icon={<FontAwesome name="plus" size={18} color={COLORS.background} />}
                        onPress={handleAddNewItem}
                    />
                    <View style={{ marginTop: 12 }}>
                        <Button title="Save Items" onPress={handleFormSubmission} />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};
export default AddItems;