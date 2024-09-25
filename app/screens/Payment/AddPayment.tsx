import { useTheme } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import Header from '../../layout/Header';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { COLORS, FONTS } from '../../constants/theme';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import { FontAwesome } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import ButtonIcon from '../../components/Button/ButtonIcon';
import useImagePicker from '../../customHooks/ImagePickerHook';
import { ApiService } from '../../lib/ApiService';
import { MessagesService } from '../../lib/MessagesService';

type AddPaymentScreenProps = StackScreenProps<RootStackParamList, 'AddPayment'>;

const AddPayment = ({ navigation, route }: AddPaymentScreenProps) => {
    const { item, transaction_type }: any = route.params;
    // console.log("itemss::",route.params,item?.customer_id,typeof(item),transaction_type);

    const { image, pickImage, takePhoto }: any = useImagePicker();

    const [amount, setAmount] = useState<String>("");
    const [description, setDescription] = useState<String>("");
    const [newDate, setNewDate] = useState<String>("");

    const theme = useTheme();
    const { colors }: { colors: any } = theme;

    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);

    const onChange = (event: any, selectedDate: any) => {
        const currentDate = selectedDate || date;
        setShow(false);
        setDate(currentDate);
        setNewDate(`${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`);
    };

    const showDatepicker = () => {
        setShow(true);
    };

    useEffect(() => {
        setNewDate(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`);
    }, []);

    const fetchAddPaymentData = async () => {
        const data: any = { customer_id: item?.customer_id, amount: amount, transaction_type: transaction_type, description: description, transaction_date: newDate, image: image }
        ApiService.postWithToken("api/shopkeeper/transactions/add-transaction", data).then((res) => {
            if (res.status == true) {
                console.log(res)
                navigation.goBack();
            }
        });
    };

    return (
        <View style={{ backgroundColor: colors.background, flex: 1, }}>
            <Header
                title='Add Payment'
                leftIcon='back'
                titleRight
            />
            <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 15 }}>
                <View style={[GlobalStyleSheet.card, { backgroundColor: colors.card }]}>
                    <View style={GlobalStyleSheet.cardBody}>
                        <View style={{ marginBottom: 10 }}>
                            <Input
                                keyboardType='numeric'
                                icon={<FontAwesome style={{ opacity: .6 }} name={'rupee'} size={20} color={colors.text} />}
                                placeholder="Enter amount"
                                onChangeText={amount => setAmount(amount)}
                            />
                        </View>
                        <View style={{ marginBottom: 10 }}>
                            <Input
                                multiline={true}
                                placeholder="Enter Details (Item Name, Bill no)"
                                onChangeText={description => setDescription(description)}
                            />
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
                            <View>
                                <ButtonIcon
                                    onPress={showDatepicker}
                                    size={'sm'}
                                    title={newDate || date.toLocaleDateString()}
                                    icon={<FontAwesome style={{ opacity: .6 }} name={'calendar'} size={20} color={colors.white} />}
                                />
                                {show && (
                                    <DateTimePicker
                                        value={date}
                                        mode="date"
                                        display="default"
                                        onChange={onChange}
                                    />
                                )}
                            </View>
                            <View>
                                <ButtonIcon onPress={pickImage}
                                    size={'sm'}
                                    title='Attach bills'
                                    icon={<FontAwesome style={{ opacity: .6 }} name={'camera'} size={20} color={colors.white} />}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {image && image.uri && (
                <Image
                    source={{ uri: image.uri }}
                    style={{ width: 300, height: 300, marginHorizontal: 50, marginVertical: 20 }}
                />
            )}

            <View style={[GlobalStyleSheet.container]}>
                <Button
                    title='Continue'
                    color={COLORS.primary}
                    text={COLORS.card}
                    onPress={fetchAddPaymentData}
                    style={{ borderRadius: 48 }}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    tracktitle: {
        ...FONTS.fontMedium,
        fontSize: 10,
        color: COLORS.title
    },
    tracktitle2: {
        ...FONTS.fontMedium,
        fontSize: 13,
        color: COLORS.card
    },
    addresscard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderStyle: 'dashed',
        marginHorizontal: -15,
        paddingHorizontal: 15,
        paddingBottom: 15,
        borderBottomColor: COLORS.inputborder
    },
    bottomBtn: {
        height: 75,
        width: '100%',
        backgroundColor: COLORS.card,
        justifyContent: 'center',
        paddingHorizontal: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: .1,
        shadowRadius: 5,
    }
})

export default AddPayment;