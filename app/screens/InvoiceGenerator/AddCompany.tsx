import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
    StyleSheet,
    RefreshControl,
    ActivityIndicator
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { useDispatch } from 'react-redux';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import { ApiService } from '../../lib/ApiService';
import { MessagesService } from '../../lib/MessagesService';
import { useTranslation } from 'react-i18next';
import Header from '../../layout/Header';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import Divider from '../../components/Dividers/Divider';
import { IMAGES } from '../../constants/Images';
import useImagePicker from '../../customHooks/ImagePickerHook';

type AddCompanyProps = StackScreenProps<RootStackParamList, 'AddCompany'>;

export const AddCompany = ({ navigation }: AddCompanyProps) => {
    const { t } = useTranslation();

    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Custom hook for image picking
    const { image, pickImage, takePhoto }: any = useImagePicker();

    const [companyName, setCompanyName] = useState('');
    const [address, setAdress] = useState('');
    const [zipcode, setZipcode] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [gst, setGst] = useState('');
    const [phone, setPhone] = useState('');
    const [website, setWebsite] = useState('');
    const [email, setEmail] = useState('');
    const [invoiceInit, setInvoiceInit] = useState('1000');

    const handelRefresh = async () => {
        setIsRefreshing(true);
        // ... (any refresh logic you might have)
        setIsRefreshing(false);
    };

    const handleFormSubmission = () => {
        if (companyName === '') {
            MessagesService.commonMessage('Company Name is required');
        } else if (address === '') {
            MessagesService.commonMessage('Address is required');
        } else if (zipcode === '') {
            MessagesService.commonMessage('Zipcode is required');
        } else if (city === '') {
            MessagesService.commonMessage('City is required');
        } else if (state === '') {
            MessagesService.commonMessage('State is required');
        } else if (phone.length !== 10) {
            MessagesService.commonMessage('Invalid Phone Number');
        } else if (email === '') {
            MessagesService.commonMessage('Email is required');
        } else {
            setIsLoading(true);
            ApiService.postWithToken('api/invoice-generator/companies/add', {
                name: companyName,
                company_address: address,
                zipcode: zipcode,
                city: city,
                state: state,
                gst: gst,
                phone: phone,
                email: email,
                website: website,
                invoice_init_number: invoiceInit,
                image: image
            }).then((res) => {
                MessagesService.commonMessage(res.message, res.status ? 'SUCCESS' : 'ERROR');
                if (res.status) {
                    navigation.navigate('CompanyCustomerList');
                }
                setIsLoading(false);
            });
        }
    };

    const dispatch = useDispatch();
    const theme = useTheme();
    const { colors } = theme;

    return (
        <View style={[styles.container, { backgroundColor: colors.card }]}>
            {/* AppBar Start */}
            <Header
                title={t('addCompany')}
                leftIcon={'back'}
                titleRight
            />
            {/* AppBar End */}

            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={isRefreshing} onRefresh={handelRefresh} />
                }
            >
                <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
                    {image === null ? (
                        <View style={styles.noImageContainer}>
                            <Image
                                source={IMAGES.upload}
                                style={[styles.uploadIcon, { tintColor: colors.title }]}
                            />
                            <Text style={[styles.uploadText, { color: colors.title }]}>
                                Upload Company Image
                            </Text>
                        </View>
                    ) : (
                        <View style={styles.imageWrapper}>
                            <Image
                                source={{ uri: image }}
                                style={styles.circleImage}
                            />
                        </View>
                    )}
                </TouchableOpacity>

                <View style={GlobalStyleSheet.container}>
                    <View style={{ marginTop: 10 }}>
                        <Input
                            inputRounded
                            placeholder={t('companyName')}
                            value={companyName}
                            onChangeText={setCompanyName}
                            maxlength={30}
                        />
                    </View>

                    <View style={{ gap: 10 }}>
                        <Divider dashed color={COLORS.primary} />
                        <Text style={[styles.sectionTitle, { color: colors.title }]}>
                            Address
                        </Text>

                        <Input
                            inputRounded
                            placeholder={t('companyAddress')}
                            value={address}
                            onChangeText={setAdress}
                            maxlength={60}
                        />
                        <Input
                            inputRounded
                            placeholder={t('zipcode')}
                            value={zipcode}
                            onChangeText={setZipcode}
                            maxlength={7}
                            keyboardType={'number-pad'}
                        />
                        <Input
                            inputRounded
                            placeholder={t('city')}
                            value={city}
                            onChangeText={setCity}
                            maxlength={30}
                        />
                        <Input
                            inputRounded
                            placeholder={t('state')}
                            value={state}
                            onChangeText={setState}
                            maxlength={40}
                        />
                        <Divider dashed color={COLORS.primary} />
                    </View>

                    <View style={{ marginTop: 10 }}>
                        <Input
                            inputRounded
                            placeholder={t('gst')}
                            value={gst}
                            onChangeText={setGst}
                            maxlength={17}
                        />
                    </View>
                    <View style={{ marginTop: 10 }}>
                        <Input
                            inputRounded
                            placeholder={t('phone')}
                            value={phone}
                            onChangeText={setPhone}
                            maxlength={10}
                            keyboardType={'number-pad'}
                        />
                    </View>
                    <View style={{ marginTop: 10 }}>
                        <Input
                            inputRounded
                            placeholder={t('website')}
                            value={website}
                            onChangeText={setWebsite}
                            maxlength={40}
                        />
                    </View>
                    <View style={{ marginVertical: 10 }}>
                        <Input
                            inputRounded
                            placeholder={t('email')}
                            value={email}
                            onChangeText={setEmail}
                            maxlength={25}
                        />
                    </View>

                    {/* If you want to show Invoice Init Number Input, uncomment below:
          <View style={{ marginTop: 10 }}>
            <Input
              inputRounded
              placeholder={t('invoiceInitiateNumber')}
              value={invoiceInit}
              onChangeText={setInvoiceInit}
              maxlength={25}
              defaultValue='1000'
            />
          </View>
          */}

                    <View style={{ marginTop: 12 }}>
                        {!isLoading ? (
                            <Button title={t('addCompany')} onPress={handleFormSubmission} />
                        ) : (
                            <ActivityIndicator size={70} color={COLORS.primary} />
                        )}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default AddCompany;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    // Container for when no image is selected
    noImageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
        padding: 30,
        borderStyle: 'dashed',
        borderColor: COLORS.primary,
        borderWidth: 1,
        borderRadius: 10
    },
    // Circular image container
    imageWrapper: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    circleImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        resizeMode: 'contain'
    },
    imageContainer: {
        // You can tweak these margins as you like
        marginTop: 20,
        marginBottom: 10,
        alignSelf: 'center'
    },
    uploadIcon: {
        height: 30,
        width: 30,
        resizeMode: 'contain'
    },
    uploadText: {
        ...FONTS.fontSemiBold,
        textAlign: 'center',
        fontSize: SIZES.fontXs,
        paddingVertical: 10
    },
    sectionTitle: {
        ...FONTS.fontSemiBold,
        textAlign: 'center',
        fontSize: SIZES.font
    }
});
