import React, { useRef, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, TextInput, StyleSheet, SafeAreaView, FlatList } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { IMAGES } from '../../constants/Images';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import { Colors } from 'react-native/Libraries/NewAppScreen';



type CustomerTransationsDetailsScreenProps = StackScreenProps<RootStackParamList, 'CustomerTransationsDetails'>

export const CustomerTransationsDetails = ({ navigation, route }: CustomerTransationsDetailsScreenProps) => {
    const { transationId } = route.params;


    const theme = useTheme();
    const { colors }: { colors: any; } = theme;


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
                        {/* <Image
                            style={{ height: 40, width: 40, borderRadius: 12, marginLeft: 10, marginRight: 15, resizeMode: 'contain' }}
                            source={IMAGES.small6}
                        /> */}
                        <View>
                            <Text style={{ ...FONTS.fontSemiBold, fontSize: 18, color: colors.title, }}>Transction Details</Text>
                        </View>
                    </View>
                    {/* <TouchableOpacity
                        onPress={() => navigation.navigate('Call')}
                    >  <FontAwesome style={{ marginRight: 15, color: colors.white }} name={'ellipsis-v'} size={20} />
                    </TouchableOpacity> */}
                </View>
            </View>

            {/* AppBar End */}

            <View style={{ flex: 1, alignItems: 'center' }} >
                <View style={{
                    height: 220,
                    width: 400,
                    top: 20,
                    backgroundColor: colors.primary,
                    borderRadius: 31,
                    // shadowColor: "#025135",
                    // shadowOffset: {
                    //     width: 0,
                    //     height: 15,
                    // },
                    // shadowOpacity: 0.34,
                    // shadowRadius: 31.27,
                    // elevation: 8,
                    flexDirection: 'column'
                }}>


                    <View style={[styles.customerItem, { marginTop: 25 }]}>
                        <View style={{}}>
                            <View style={{ flexDirection: 'row', }}>
                                <Image
                                    style={{ height: 60, width: 60, borderRadius: 50 }}
                                    source={IMAGES.small5}
                                />
                                <View style={{ marginLeft: 18 }}>
                                    <Text style={[styles.customerName, { color: COLORS.primaryLight, ...FONTS.fontSemiBold }]}>Arbaz</Text>
                                    <Text style={styles.lastInteraction}>1 Week ago</Text>

                                </View>

                            </View>

                        </View>

                        <View style={{ flexDirection: "column", alignItems: "center", position: "relative", }}>
                            <Text style={"Credit" === 'Credit' ? { color: "green", fontSize: 18, fontWeight: "900" } : { fontSize: 18, fontWeight: "900", color: "red" }}> ₹ 10,000</Text>
                            <Text style={[styles.type, { color: COLORS.white }]}>Debit</Text>
                        </View>

                    </View>
                    <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: "center", marginTop: 20 }}>

                        <Text style={{
                            color: Colors.white, ...FONTS.fontBold, marginRight: 5, fontSize
                                : 16
                        }}>
                            Transaction ID :
                            {/* <Feather name='arrow-right' size={16} color={COLORS.white} /> */}
                        </Text>
                        <Text style={{ color: COLORS.white, ...FONTS.fontBold, fontSize: 16 }}>
                            7236576457485
                            {/* <Feather name='arrow-right' size={16} color={COLORS.white} /> */}
                        </Text>

                    </View>
                </View>
                <View style={{
                    height: 180,
                    width: 400,
                    top: 40,
                    backgroundColor: colors.primary,
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
                    <View style={{ borderBottomWidth: 1, height: 50 }} >
                        <Text style={{ ...FONTS.fontSemiBold, fontSize: 18, color: COLORS.white, marginLeft: 20, top: 10 }}>Description</Text>
                    </View>
                    <View >
                        <Text style={{ ...FONTS.fontSemiBold, fontSize: 14, color: COLORS.white, margin: 15, textAlign: "justify" }}>I'll do my best to provide accurate and helpful responses! Let me know the task, and I'll make sure to handle it with care and precision. What's the task you'd like me to work on?

                        </Text>
                    </View>


                </View>
            </View>





            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: "center" }}>
                <TouchableOpacity style={[styles.addAmmount, { flexDirection: 'row', justifyContent: 'center', alignItems: "center", }]} onPress={() => { }}>

                    <Text style={styles.addButtonText}>
                        Share</Text>
                    <FontAwesome style={{ color: COLORS.white, marginLeft: 10 }} name={'share'} size={18} />
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


    customerItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
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
        fontSize: 22,
    },
    lastInteraction: {
        color: 'white',
        opacity: 0.6,
        fontSize: 16,
    },
    type: {
        color: COLORS.title,
        fontSize: 16,
        ...FONTS.fontBold,
        marginTop: 5


    },


    addAmmount: {
        width: 400,
        backgroundColor: COLORS.primary,
        marginBottom: 20,
        padding: 15, // 15px padding around the button content
        borderRadius: 12, // Circular button
        elevation: 5,  // Shadow for Android
        shadowColor: '#000',  // Shadow for iOS
        shadowOffset: { width: 0, height: 4 },  // Shadow offset for iOS
        shadowOpacity: 0.2,  // Shadow opacity for iOS

        // Shadow blur radius for iOS
    },
    addButtonText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: "center"
    },

    header: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: COLORS.card,
    },

    actionBtn: {
        height: 35,
        width: 35,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.background,

    }
})

export default CustomerTransationsDetails;
