import { useTheme, useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useCallback, useState } from 'react'
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet, ImageBackground } from 'react-native'
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { IMAGES } from '../../constants/Images';
import { COLORS, FONTS } from '../../constants/theme';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import Header from '../../layout/Header';
import CommonService from '../../lib/CommonService';
import FilePreviewModal from '../../components/Modal/FilePreviewModal';
import FontAwesome from '@expo/vector-icons/build/FontAwesome';
import { ApiService } from '../../lib/ApiService';


type ProfileScreenProps = StackScreenProps<RootStackParamList, 'Profile'>;

const Profile = ({ navigation }: ProfileScreenProps) => {

    const [profile, setProfile] = React.useState<any>({});
    const [paymentDetail, setPaymentDetail] = React.useState<any>();

    useFocusEffect(
        useCallback(() => {
            CommonService.currentUserDetail().then((res) => {
                setProfile(res);
            })
            ApiService.postWithToken("api/user/payment/fetch", {}).then((res: any) => {
                setPaymentDetail(res.data);
                console.log("paymentDetail", res.data)
            });
        }, [])
    );

    const theme = useTheme();
    const { colors }: { colors: any } = theme;



    const [modalVisible, setModalVisible] = useState(false);
    const [modalImageSource, setModalImageSource] = useState<any>();
    const handlePreview = (type: string) => {
        if (type == 'profile') {
            setModalImageSource(profile.profile_image);

        } else {
            setModalImageSource(paymentDetail.qr_image);

        }
        setModalVisible(true);
    }


    return (
        <View style={{ backgroundColor: colors.card, flex: 1 }}>
            <Header
                title='Profile'
                leftIcon={'back'}
                rightIcon2={'Edit'}
            />

            <FilePreviewModal close={setModalVisible} modalVisible={modalVisible} title="Preview" previewImage={modalImageSource} />
            <ScrollView showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingBottom: 50 }}>


                <View style={[GlobalStyleSheet.container, { alignItems: 'center', marginTop: 50, padding: 0 }]}>
                    <TouchableOpacity onPress={() => handlePreview('profile')}>

                        <View
                            style={[styles.sectionimg]}
                        >
                            <Image
                                style={{ height: 90, width: 90, borderRadius: 50 }}
                                source={{ uri: profile?.profile_image }}
                            />
                        </View>
                    </TouchableOpacity>

                    <Text style={{ ...FONTS.fontSemiBold, fontSize: 28, color: colors.title }}>{profile?.name}</Text>
                </View>

                <View
                    style={[GlobalStyleSheet.container, { paddingHorizontal: 40, marginTop: 20 }]}
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
                                <Text style={[styles.brandsubtitle2, { color: '#7D7D7D' }]}>Mobile Number</Text>
                                <Text style={{ ...FONTS.fontMedium, fontSize: 16, color: colors.title, marginTop: 5 }}>{profile?.mobile}</Text>
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
                                <Text style={[styles.brandsubtitle2, { color: '#7D7D7D' }]}>Email Address</Text>
                                <Text style={{ ...FONTS.fontMedium, fontSize: 16, color: colors.title, marginTop: 5 }}>{profile?.email}</Text>
                            </View>
                        </View>
                        {profile?.aadhar_card && <View style={[GlobalStyleSheet.flexcenter, { width: '100%', gap: 20, justifyContent: 'flex-start', marginBottom: 25, alignItems: 'flex-start' }]} >
                            <View style={[styles.cardimg, { backgroundColor: colors.card }]} >
                                <Image
                                    style={[GlobalStyleSheet.image3, { tintColor: COLORS.primary }]}
                                    source={IMAGES.card2}
                                />
                            </View>
                            <View>
                                <Text style={[styles.brandsubtitle2, { color: '#7D7D7D' }]}>Aadhaar Number</Text>
                                <Text style={{ ...FONTS.fontMedium, fontSize: 16, color: colors.title, marginTop: 5 }}>{profile?.aadhar_card}</Text>
                            </View>

                        </View>}
                        {profile?.pan_card && <View style={[GlobalStyleSheet.flexcenter, { width: '100%', gap: 20, justifyContent: 'flex-start', marginBottom: 25, alignItems: 'flex-start' }]}  >
                            <View style={[styles.cardimg, { backgroundColor: colors.card }]} >
                                <Image
                                    style={[GlobalStyleSheet.image3, { tintColor: COLORS.primary }]}
                                    source={IMAGES.card2}
                                />
                            </View>
                            <View>
                                <Text style={[styles.brandsubtitle2, { color: '#7D7D7D' }]}>Pan Card</Text>
                                <Text style={{ ...FONTS.fontMedium, fontSize: 16, color: colors.title, marginTop: 5 }}>{profile?.pan_card}</Text>
                            </View>

                        </View>}
                    </View>
                    <View style={[GlobalStyleSheet.card, { backgroundColor: colors.card }]}>
                        <View style={[GlobalStyleSheet.cardHeader, { borderBottomColor: COLORS.inputborder, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]} >
                            <Text style={{ ...FONTS.fontMedium, fontSize: 16, color: colors.title }}>Payment Details</Text>
                            <TouchableOpacity
                                activeOpacity={0.5}
                                onPress={() => navigation.navigate('EditUserPaymentDetail')}
                            >
                                <FontAwesome size={22} color={colors.title} name={'pencil'} />
                            </TouchableOpacity>

                        </View>
                        <View style={GlobalStyleSheet.cardBody}>
                            <View style={[GlobalStyleSheet.flexcenter, { width: '100%', gap: 20, justifyContent: 'flex-start', marginBottom: 25, alignItems: 'flex-start' }]}  >
                                <View style={[styles.cardimg, { backgroundColor: colors.card }]} >
                                    <Image
                                        style={[GlobalStyleSheet.image3, { tintColor: COLORS.primary }]}
                                        source={IMAGES.card2}
                                    />
                                </View>
                                <View>
                                    <Text style={[styles.brandsubtitle2, { color: '#7D7D7D' }]}>UPI ID</Text>
                                    <Text style={{ ...FONTS.fontMedium, fontSize: 16, color: colors.title, marginTop: 5 }}>{paymentDetail?.upi_id}</Text>
                                </View>
                            </View>
                            {paymentDetail?.qr_image &&
                                < TouchableOpacity onPress={() => handlePreview('qr')} >
                                    <View style={{ flex: 1, height: 200, marginTop: 30, borderRadius: 20 }}>
                                        <ImageBackground source={{ uri: paymentDetail?.qr_image }} resizeMode="cover" style={{ flex: 1, justifyContent: 'center' }}>
                                            <Text style={{
                                                textAlign: 'center', color: 'white', fontSize: 32, lineHeight: 200, fontWeight: 'bold', backgroundColor: '#000000c0',
                                            }}>View QR Code</Text>
                                        </ImageBackground>
                                    </View>
                                </TouchableOpacity >}
                        </View>
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

export default Profile