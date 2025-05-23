import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Platform, Alert } from 'react-native'
import { useNavigation, useTheme } from '@react-navigation/native';
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

const EditProfile = () => {
    const { image, pickImage, takePhoto }: any = useImagePicker();

    const [modalVisible, setModalVisible] = useState(false)

    useEffect(() => {
        if (image !== null) {
            setModalVisible(false);
        }
    }, [image])


    const [profile, setProfile] = React.useState<any>({});

    useEffect(() => {
        CommonService.currentUserDetail().then((res) => {
            setProfile(res);
        })
    }, []);

    const theme = useTheme();
    const { colors }: { colors: any } = theme;

    const navigation = useNavigation<any>();

    const [isFocused, setisFocused] = useState(false)
    const [isFocused2, setisFocused2] = useState(false)
    const [isFocused3, setisFocused3] = useState(false)
    const [isLoading, setIsLoading] = useState(false);

    const [addressInputValue, setAddressInputValue] = useState("");


    const handleImageSelect = () => {
        setModalVisible(true);
    }

    const updateProfileData = async () => {
        setIsLoading(true);

        const res = await ApiService.postWithToken(
            "api/user/profile-update",
            { profile_image: image, name: profile?.name, address: addressInputValue },
        )
        if (res.status == true) {
            MessagesService.commonMessage(res.message);
            navigation.goBack();
        }

    };

    return (
        <View style={{ backgroundColor: colors.background, flex: 1 }}>

            <Header
                title='Edit Profile'
                leftIcon='back'
                titleRight
            />
            <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 15, marginBottom: 50 }}>
                <View style={[GlobalStyleSheet.container, { backgroundColor: theme.dark ? 'rgba(255,255,255,.1)' : colors.card, marginTop: 10, borderRadius: 15 }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
                        <View style={{}}>
                            <View style={styles.imageborder}>
                                <Image
                                    style={{ height: 82, width: 82, borderRadius: 50 }}
                                    source={{ uri: image === null ? profile?.profile_image : image }}

                                />
                            </View>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={handleImageSelect}
                                style={[styles.WriteIconBackground, { backgroundColor: colors.card }]}
                            >
                                <View style={styles.WriteIcon}>
                                    <Image
                                        style={{ height: 16, width: 16, resizeMode: 'contain', tintColor: COLORS.card }}
                                        source={IMAGES.write}
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>
                        <ImagePickerModal close={setModalVisible} modalVisible={modalVisible} removeImage={() => { console.log("remove Image") }}
                            pickImageFromCamera={takePhoto} pickImageFromGallery={pickImage} />
                        <View>
                            <Text style={[FONTS.fontMedium, { fontSize: 19, color: colors.title }]}>{profile?.name}</Text>
                        </View>
                    </View>
                </View>
                <View style={[GlobalStyleSheet.container, { backgroundColor: theme.dark ? 'rgba(255,255,255,.1)' : colors.card, marginTop: 10, paddingVertical: 10, borderRadius: 15 }]}>
                    <View style={[styles.cardBackground, { borderBottomColor: COLORS.inputborder, borderStyle: 'dashed' }]}>
                        <Text style={{ ...FONTS.fontRegular, fontSize: 14, color: colors.title }}>Overall Rating</Text>
                    </View>
                    <View style={{ marginBottom: 15, marginTop: 10 }}>
                        <Input
                            editable={false}
                            onFocus={() => setisFocused(true)}
                            onBlur={() => setisFocused(false)}
                            isFocused={isFocused}
                            onChangeText={(value) => { profile.mobile = value }}
                            backround={colors.card}
                            style={{ borderRadius: 48 }}
                            inputicon
                            placeholder='Mobile Number'
                            value={profile.mobile}
                            icon={<Image source={IMAGES.call} style={[styles.icon, { tintColor: colors.title }]} />}
                        />
                    </View>
                    <View style={{ marginBottom: 15 }}>
                        <Input
                            editable={false}
                            onFocus={() => setisFocused2(true)}
                            onBlur={() => setisFocused2(false)}
                            isFocused={isFocused2}
                            onChangeText={(value) => { profile.email = value }}
                            backround={colors.card}
                            style={{ borderRadius: 48 }}
                            inputicon
                            placeholder='Email Address '
                            value={profile?.email}
                            icon={<Image source={IMAGES.email} style={[styles.icon, { tintColor: colors.title }]} />}
                        />
                    </View>
                    <View style={{ marginBottom: 15 }}>
                        <Input
                            onFocus={() => setisFocused3(true)}
                            onBlur={() => setisFocused3(false)}
                            isFocused={isFocused3}
                            onChangeText={(value) => setAddressInputValue(value)}
                            backround={colors.card}
                            style={{ borderRadius: 48 }}
                            inputicon
                            placeholder={profile?.address ?? "Address"}
                            icon={<Image source={IMAGES.Location} style={[styles.icon, { tintColor: colors.title }]} />}
                        />
                    </View>
                </View>
            </ScrollView>
            <View style={[GlobalStyleSheet.container]}>
                {
                    isLoading === false ?
                        <Button
                            title='Update Profile'
                            color={COLORS.primary}
                            text={COLORS.card}
                            onPress={updateProfileData}
                            style={{ borderRadius: 50 }}
                        /> : <ActivityIndicator size={70} color={COLORS.primary} />
                }
            </View >
        </View >
    )
}

const styles = StyleSheet.create({
    icon: {
        height: 25,
        width: 25,
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
    WriteIcon: {
        height: 36,
        width: 36,
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


export default EditProfile