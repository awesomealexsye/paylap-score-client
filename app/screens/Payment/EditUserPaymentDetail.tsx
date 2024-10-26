import React, { useState, useEffect, useCallback } from 'react'
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native'
import { useNavigation, useTheme, useFocusEffect } from '@react-navigation/native';
import Header from '../../layout/Header';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { IMAGES } from '../../constants/Images';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import { COLORS, FONTS } from '../../constants/theme';
import CommonService from '../../lib/CommonService';
import { ActivityIndicator } from 'react-native-paper';
import ImagePickerModal from '../../components/Modal/ImagePickerModal';
import useImagePicker from '../../customHooks/ImagePickerHook';
import { ApiService } from '../../lib/ApiService';
import { MessagesService } from '../../lib/MessagesService';
import FilePreviewModal from '../../components/Modal/FilePreviewModal';

const EditUserPaymentDetail = () => {
    const { image, pickImage, takePhoto }: any = useImagePicker();

    const [isImagePickerModalVisible, setImagePickerModalVisible] = useState(false)
    const [previewModalVisible, setPreviewModalVisible] = useState(false)
    const [paymentDetail, setPaymentDetail] = React.useState<any>();

    useFocusEffect(useCallback(() => {
        ApiService.postWithToken("api/user/payment/fetch", {}).then((res: any) => {
            setPaymentDetail(res.data);
        });
    }, []));
    useEffect(() => {
        if (image !== null) {
            setImagePickerModalVisible(false);
        }
    }, [image])
    const handlePreview = () => {
        setPreviewModalVisible(true);
    }

    const theme = useTheme();
    const { colors }: { colors: any } = theme;

    const navigation = useNavigation<any>();
    const [isLoading, setIsLoading] = useState(false);

    const handleImageSelect = () => {
        setImagePickerModalVisible(true);
    }

    const updatePaymentDetails = async () => {
        if (paymentDetail?.upi_id.length < 4) {
            MessagesService.commonMessage("Please enter valid UPI address.");
            return;
        }
        setIsLoading(true);
        const res = await ApiService.postWithToken(
            "api/user/payment/add",
            { qr_image: image, upi_id: paymentDetail?.upi_id },
        )
        if (res.status == true) {
            MessagesService.commonMessage(res.message);
            navigation.goBack();
        }
        setIsLoading(false);
    };

    return (
        <View style={{ backgroundColor: colors.background, flex: 1 }}>

            <Header
                title='Update Payment detail'
                leftIcon='back'
                titleRight
            />
            <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 15, marginBottom: 50 }}>
                <View style={[GlobalStyleSheet.card, { backgroundColor: colors.card }]}>
                    <View style={[GlobalStyleSheet.cardHeader, { borderBottomColor: COLORS.inputborder }]}>
                        <Text style={{ ...FONTS.fontMedium, fontSize: 16, color: colors.title }}>Update Payment Details</Text>
                    </View>
                    <View style={GlobalStyleSheet.cardBody}>
                        <Input
                            onChangeText={(value) => { setPaymentDetail({ ...paymentDetail, upi_id: value }) }}
                            backround={colors.card}
                            style={{ borderRadius: 48 }}
                            inputicon
                            placeholder='UPI Address'
                            value={paymentDetail?.upi_id}
                            icon={<Image source={IMAGES.user2} style={[styles.icon, { tintColor: colors.title }]} />}
                        />
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={handleImageSelect}
                            style={[{ backgroundColor: colors.card, marginTop: 20 }]}
                        >
                            <View style={styles.ImageSelectButton}>
                                <Text style={{ ...FONTS.fontMedium, fontSize: 16, color: COLORS.white, textAlign: 'center' }} >Upload Payment QR Code</Text>
                            </View>
                        </TouchableOpacity>
                        {image &&
                            < TouchableOpacity onPress={handlePreview} >
                                <View style={{ flex: 1, height: 200, marginTop: 30, borderRadius: 20 }}>
                                    <ImageBackground source={{ uri: image == null ? paymentDetail?.qr_image : image }} resizeMode="cover" style={{ flex: 1, justifyContent: 'center' }}>
                                        <Text style={{
                                            textAlign: 'center', color: 'white', fontSize: 32, lineHeight: 200, fontWeight: 'bold', backgroundColor: '#000000c0',
                                        }}>View Image</Text>
                                    </ImageBackground>
                                </View>
                            </TouchableOpacity >}
                    </View>
                </View >
                <ImagePickerModal close={setImagePickerModalVisible} modalVisible={isImagePickerModalVisible} removeImage={() => { }}
                    pickImageFromCamera={takePhoto} pickImageFromGallery={pickImage} />
                <FilePreviewModal close={setPreviewModalVisible} modalVisible={previewModalVisible} title="Preview" previewImage={image == null ? paymentDetail?.qr_image : image} />
            </ScrollView >
            <View style={[GlobalStyleSheet.container]}>
                {
                    isLoading === false ?
                        <Button
                            title='Update Payment details'
                            color={COLORS.primary}
                            textColor={COLORS.card}
                            onPress={updatePaymentDetails}
                            style={{ borderRadius: 50 }}
                        /> : <ActivityIndicator size={70} color={COLORS.primary} />
                }
            </View >
        </View >
    )
}

const styles = StyleSheet.create({
    icon: {
        height: 28,
        width: 28,
        resizeMode: 'contain',
    },
    cardBackground: {
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.background,
        marginHorizontal: -15,
        paddingHorizontal: 15,
        paddingBottom: 15,
        marginBottom: 10
    },
    imageborder: {
        borderWidth: 2,
        borderColor: COLORS.primary,
        height: 90,
        width: 90,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },
    WriteIconBackground: {
        height: 42,
        width: 42,
        borderRadius: 40,
        backgroundColor: COLORS.card,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 0,
        left: 60
    },
    ImageSelectButton: {
        height: 40,
        borderRadius: 36,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.primary
    },
    InputTitle: {
        ...FONTS.fontMedium,
        fontSize: 13,
        color: COLORS.title,
        marginBottom: 5
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


export default EditUserPaymentDetail