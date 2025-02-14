import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Modal, StyleSheet, Dimensions, Button, Alert } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { COLORS } from '../../constants/theme';
import Header from '../../layout/Header';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import { ApiService } from '../../lib/ApiService';
import { MessagesService } from '../../lib/MessagesService';
import { ActivityIndicator } from 'react-native-paper';
import StorageService from '../../lib/StorageService';
import CONFIG from '../../constants/config';

const { width } = Dimensions.get('window');

type ChooseInvoiceDesignProps = StackScreenProps<RootStackParamList, 'ChooseInvoiceDesign'>
export const ChooseInvoiceDesign = ({ navigation, route }: ChooseInvoiceDesignProps) => {
    const theme = useTheme();
    const { colors }: { colors: any } = theme;

    const data = route.params?.data;

    const [isLoading, setIsLoading] = useState(false)
    const [imageData, setImageData] = useState<any>([]);
    const [imageURL, setImageURL] = useState<any>([]);

    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
    const [prepareData, setPrepareData] = useState(data || { company_id: null, client_id: null, template_id: 0, item_info: '', grand_total_amount: '', received_amount: '', expected_given_data: null });
    useEffect(() => {
        fetchImageList();
    }, []);

    const fetchImageList = async () => {
        setIsLoading(true);
        ApiService.postWithToken("api/banner/all", { type: 'pdf-template' }).then((res: any) => {
            setIsLoading(false);
            if (res.status) {
                setImageURL(res.image_url);
                setImageData(res.data)
            } else {
                MessagesService.commonMessage(res.message)
            }
        });
    };

    const handleImageClick = (url: string) => {
        setSelectedImage(url);
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setSelectedImage(null);
        setIsModalVisible(false);
    };

    const handleChooseTemplate = async () => {
        if (selectedTemplate) {
            // setPrepareData({ ...prepareData, template_id: Number(selectedTemplate) });
            prepareData['template_id'] = selectedTemplate
            console.log("newApiData", prepareData);
            ApiService.postWithToken("api/invoice-generator/invoice/add", prepareData).then((res: any) => {
                MessagesService.commonMessage(res.message, res.status ? "SUCCESS" : "ERROR");
                // console.log(res);
                if (res.status) {
                    StorageService.removeAllStorageValue([
                        // CONFIG.HARDCODE_VALUES.INVOICE_GEN_SESSION.CLIENT_INFO,
                        CONFIG.HARDCODE_VALUES.INVOICE_GEN_SESSION.ITEM_INFO,
                        // CONFIG.HARDCODE_VALUES.INVOICE_GEN_SESSION.ORGANIZATION_INFO
                    ]);
                    navigation.replace('FinalInvoiceResult', { data: { pdf_url: res.pdf_url }, previous_screen: "ChooseInvoiceDesign" });
                }
            })
        } else {
            Alert.alert("Error", "Please choose any template first..");
        }
    };
    const handleTemplateSelection = (id: string, headline: string) => {
        setSelectedTemplate(id);
    };
    return (
        <View style={{ backgroundColor: colors.card, flex: 1 }}>
            {/* AppBar Start */}
            <Header
                title="Choose Template"
                leftIcon="back"
                titleRight
            />
            {/* AppBar End */}

            <ScrollView showsVerticalScrollIndicator={false}>
                {
                    isLoading ? <ActivityIndicator size={'large'} /> :
                        <View style={[GlobalStyleSheet.container, styles.gridContainer]}>
                            {imageData.map((item: any, index: number) => (
                                <View
                                    key={item.id}
                                    style={[
                                        styles.gridItem,
                                        // selectedTemplate === item.id && styles.selectedTemplate
                                    ]}
                                >
                                    <TouchableOpacity onPress={() => handleTemplateSelection(item.id, item.name)}>
                                        <Image source={{ uri: imageURL + "/" + item.image }} style={styles.image} />
                                        <Text style={[styles.headline, { color: colors.title }]}>{item.name}</Text>
                                    </TouchableOpacity>

                                    {/* Add Select Button */}
                                    <TouchableOpacity
                                        style={[styles.selectButton, { backgroundColor: selectedTemplate === item.id ? COLORS.info : COLORS.primary }]}
                                        onPress={() => handleTemplateSelection(item.id, item.name)}
                                    >
                                        <Text style={styles.selectButtonText}>Select</Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                }

            </ScrollView>

            {/* Modal for Full-Screen Image */}
            <Modal
                visible={isModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={closeModal}
            >
                <View style={styles.modalContainer}>
                    <TouchableOpacity onPress={closeModal} style={styles.modalClose}>
                        <Text style={styles.closeText}>Close</Text>
                    </TouchableOpacity>
                    {selectedImage && (
                        <Image source={{ uri: selectedImage }} style={styles.fullImage} />
                    )}
                </View>
            </Modal>

            {/* Button for Choosing Template */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.chooseButton}
                    onPress={handleChooseTemplate}
                >
                    <Text style={styles.chooseButtonText}>
                        Generate
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    gridItem: {
        width: (width / 2) - 16, // Half the screen width minus padding
        marginBottom: 16,
        padding: 5
    },
    image: {
        width: '100%',
        height: 120,
        borderRadius: 8,
    },
    headline: {
        marginTop: 8,
        textAlign: 'center',
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalClose: {
        position: 'absolute',
        top: 40,
        right: 20,
        backgroundColor: COLORS.background,
        borderRadius: 8,
        padding: 10,
    },
    closeText: {
        color: COLORS.text,
        fontWeight: 'bold',
    },
    fullImage: {
        width: '90%',
        height: '70%',
        resizeMode: 'contain',
    },
    buttonContainer: {
        padding: 16,
    },
    chooseButton: {
        backgroundColor: COLORS.primary,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    chooseButtonText: {
        color: COLORS.background,
        fontSize: 16,
        fontWeight: 'bold',
    },
    selectButton: {
        marginTop: 10,
        backgroundColor: COLORS.primary,
        paddingVertical: 8,
        borderRadius: 5,
        alignItems: 'center',
    },
    selectButtonText: {
        color: COLORS.background,
        fontSize: 14,
        fontWeight: 'bold',
    },
    selectedTemplate: {
        backgroundColor: COLORS.primaryLight, // Highlight color for selected template
        borderColor: COLORS.primary, // Optional: Highlight border color for selected template
    },
});

export default ChooseInvoiceDesign;
