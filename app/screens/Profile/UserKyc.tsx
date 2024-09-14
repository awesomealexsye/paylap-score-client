import { useTheme } from '@react-navigation/native';
import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native'
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { IMAGES } from '../../constants/Images';
import { COLORS, FONTS } from '../../constants/theme';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import Header from '../../layout/Header';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import { MessagesService } from '../../lib/MessagesService';


type ProfileScreenProps = StackScreenProps<RootStackParamList, 'UserKyc'>;

const UserKyc = ({ navigation }: ProfileScreenProps) => {




    const theme = useTheme();
    const { colors }: { colors: any } = theme;

    const [aadhaar, setAadhaar] = useState("");

    const sendOtp = () => {
        if (aadhaar.length != 12) {
            MessagesService.commonMessage("Aadhaar Digit must be 12 digits");
        } else {
            console.log("send otp", aadhaar)
        }

    }
    return (
        <View style={{ backgroundColor: colors.card, flex: 1 }}>
            <Header
                title='Update KYC'
                leftIcon={'back'}
            />
            <ScrollView showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingBottom: 50 }}>
                <View style={[GlobalStyleSheet.card, { backgroundColor: colors.card }, { marginTop: 20 }]}>
                    <View style={[GlobalStyleSheet.cardHeader, { borderBottomColor: COLORS.inputborder }]}>
                        <Text style={{ ...FONTS.fontMedium, fontSize: 14, color: colors.title, textAlign: 'center' }}>Verify Your Aadhaa Card & PanCard</Text>
                    </View>
                    <View style={GlobalStyleSheet.cardBody}>
                        <View style={{ marginBottom: 10 }}>
                            <Input
                                inputRounded
                                icon={<FontAwesome style={{ opacity: .6 }} name={'address-card'} size={20} color={colors.text} />}
                                //value={''}  
                                placeholder="Your Aadhaar Card Number"
                                onChangeText={(value) => setAadhaar(value)}
                            />
                        </View>
                        <View style={GlobalStyleSheet.cardBody}>
                            <Button title={'Sent OTP'} onPress={sendOtp} />

                        </View>

                        {/* <View style={{marginBottom:10}}>
                                    <Input
                                        inputRounded
                                        icon={<MaterialIcons style={{opacity:.6}} name={'email'} size={20} color={colors.text}/>}
                                        //value={''}  
                                        placeholder="Enter Email"
                                        onChangeText={(value)=> console.log(value)}
                                    />
                                </View> */}

                    </View>
                </View>

            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    arrivaldata: {
        backgroundColor: COLORS.card,
        borderRadius: 20,
        //width:'100%',
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: '#EFEFEF',
    },
    sectionimg: {
        height: 104,
        width: 104,
        borderRadius: 150,
        backgroundColor: COLORS.primary,
        overflow: 'hidden',
        marginBottom: 25
    },
    brandsubtitle2: {
        ...FONTS.fontRegular,
        fontSize: 12
    },
    brandsubtitle3: {
        ...FONTS.fontMedium,
        fontSize: 12,
        color: COLORS.title
    },
    profilecard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
        marginRight: 10,
        marginBottom: 20
    },
    cardimg: {
        height: 54,
        width: 54,
        borderRadius: 55,
        backgroundColor: COLORS.card,
        shadowColor: "rgba(0,0,0,0.5)",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.34,
        shadowRadius: 18.27,
        elevation: 10,
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default UserKyc