import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { ScrollView, View, Text, ActivityIndicator, Image, StyleSheet } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { useNavigation, useTheme, useFocusEffect } from '@react-navigation/native';
import LoginSheet from '../../components/BottomSheet/LoginSheet';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import Header from '../../layout/Header';
import Input from '../../components/Input/Input';
import { FontAwesome } from '@expo/vector-icons';
import Button from '../../components/Button/Button';
import { MessagesService } from '../../lib/MessagesService';
import AadhaarOtp from './AadhaarOtp';
import { COLORS, FONTS } from '../../constants/theme';
import { ApiService } from '../../lib/ApiService';
import CommonService from '../../lib/CommonService';
import CustomerScore from './CustomerScore';
import ProfileScore from './PeofileScore';
import CONFIG from '../../constants/config';
import { IMAGES } from '../../constants/Images';

type Props = {
    height?: string,
}


const FindUser = forwardRef((props, ref) => {

    const theme = useTheme();
    const { colors }: { colors: any } = theme;
    const navigation = useNavigation<any>();

    const [userDetail, setUserDetail] = useState({
        id: 0,
        name: "",
        email: "",
        mobile: "",
        credit_score: 0,
        aadhar_card: "",
        pan_card: "",
        address: "",
        profile_image: ""
    }
    );
    const [isLoading, setIsLoading] = useState(false);
    const [showDetail, setShowDetail] = useState(false);

    const [aadhar, setAadhar] = useState("642546277815");
    // useEffect(() => {

    // }, []);
    useFocusEffect(
        useCallback(() => {

            setShowDetail(false);
        }, [])
    );
    const searchAadhaar = async () => {
        setIsLoading(true);

        if (aadhar?.length != 12) {
            MessagesService.commonMessage("Invalid Aadhar Number");
            setIsLoading(false);
            return;
        }
        const res = await ApiService.postWithToken("api/user/get-user-via-aadhaar", { "aadhar_card": aadhar });
        console.log({ "aadhar_card": aadhar }, res)
        if (res !== null && res.status === true) {
            if (res?.data) {
                setUserDetail(res?.data);
                setShowDetail(true);
                setIsLoading(false);
            } else {
                MessagesService.commonMessage(res?.message);
                setIsLoading(false);

            }
        } else {
            setIsLoading(false);
        }
    }

    return (
        <>

            <View style={{ flex: 1, backgroundColor: colors.background }}>
                <View style={{}}>
                    <Header
                        title={'Find User'}
                        leftIcon={'back'}
                        titleRight
                    />
                    <ScrollView>
                        <View style={[GlobalStyleSheet.container, { padding: 0, paddingTop: 10 }]}>
                            <View style={{ marginTop: 0, }}>

                                {
                                    !showDetail &&
                                    <>
                                        <View style={[GlobalStyleSheet.container, { borderBottomColor: COLORS.inputborder, justifyContent: "center", alignItems: "center" }]}>
                                            <Image source={theme.dark ? IMAGES.appnamedark : IMAGES.appname}
                                                style={{
                                                    height: 110,
                                                    width: 150,
                                                    objectFit: "contain",
                                                }} />
                                            {/* <Text style={{ ...FONTS.fontMedium, fontSize: 14, color: colors.title, textAlign: 'center' }}>Search Aadhaar Card</Text> */}
                                        </View>
                                        <View style={{ marginTop: 0 }}>
                                            <View style={{ marginBottom: 10, marginHorizontal: 15 }}>
                                                <Input
                                                    inputRounded
                                                    icon={<FontAwesome style={{ opacity: .6 }} name={'address-card'} size={20} color={colors.text} />}
                                                    placeholder="Enter Aadhaar Card Number"
                                                    onChangeText={(value) => setAadhar(value)}
                                                />
                                            </View>
                                            <View style={GlobalStyleSheet.cardBody}>
                                                {isLoading === true ? <ActivityIndicator size={70} color={COLORS.primary} />
                                                    : <Button title={'Search'} onPress={() => { searchAadhaar() }} />
                                                }
                                            </View>
                                        </View>
                                    </>

                                }
                                {
                                    showDetail &&
                                    (<View>
                                        <View>
                                            <View style={[GlobalStyleSheet.container, { alignItems: 'center', marginTop: 0, padding: 0 }]}>

                                                <View
                                                    style={[styles.sectionimg]}
                                                >
                                                    <Image
                                                        style={{ height: 90, width: 90, borderRadius: 50 }}
                                                        source={{ uri: userDetail?.profile_image }}
                                                    />
                                                </View>

                                                <Text style={{ ...FONTS.fontSemiBold, fontSize: 18, color: colors.title }}>{userDetail?.name}</Text>
                                                {/* <Text style={{ ...FONTS.fontRegular, fontSize: 16, color: COLORS.primary }}>London, England</Text> */}
                                            </View>

                                            <View
                                                style={[GlobalStyleSheet.container, { paddingHorizontal: 40, marginTop: 0 }]}
                                            >
                                                <View>

                                                    <View style={[GlobalStyleSheet.flexcenter, { width: '100%', gap: 20, justifyContent: 'flex-start', marginBottom: 25, alignItems: 'flex-start' }]} >
                                                        <View style={[styles.cardimg, { backgroundColor: colors.card }]} >
                                                            <Image
                                                                style={[GlobalStyleSheet.image3, { tintColor: COLORS.primary }]}
                                                                source={IMAGES.call}
                                                            />
                                                        </View>
                                                        <View>
                                                            <Text style={[styles.brandsubtitle2, { color: '#7D7D7D', fontSize: 12 }]}>Mobile Number</Text>
                                                            <Text style={{ ...FONTS.fontMedium, fontSize: 14, color: colors.title, marginTop: 5 }}>{userDetail?.mobile}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={[GlobalStyleSheet.flexcenter, { width: '100%', gap: 20, justifyContent: 'flex-start', marginBottom: 25, alignItems: 'flex-start' }]} >
                                                        <View style={[styles.cardimg, { backgroundColor: colors.card }]} >
                                                            <Image
                                                                style={[GlobalStyleSheet.image3, { tintColor: COLORS.primary }]}
                                                                source={IMAGES.email}
                                                            />
                                                        </View>
                                                        <View>
                                                            <Text style={[styles.brandsubtitle2, { color: '#7D7D7D', fontSize: 12 }]}>Email Address</Text>
                                                            <Text style={{ ...FONTS.fontMedium, fontSize: 14, color: colors.title, marginTop: 0 }}>{userDetail?.email}</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{ marginBottom: 80 }}>
                                            <ProfileScore value={userDetail?.credit_score} labels={CONFIG.CREDIT_SCORE_LABEL} minValue={CONFIG.CREDIT_SCORE_RANGE.MIN} maxValue={CONFIG.CREDIT_SCORE_RANGE.MAX} />
                                        </View>
                                    </View>)
                                }
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </>
    );
});

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
        backgroundColor: COLORS.background,
        overflow: 'hidden',
        marginBottom: 25,
        borderWidth: 3,
        borderColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center'
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

export default FindUser;