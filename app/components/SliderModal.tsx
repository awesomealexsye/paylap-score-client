import React, { useEffect, useState, useRef } from 'react';
import { View, Modal, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { ApiService } from '../lib/ApiService';
import CONFIG from '../constants/config';

const SliderModal = ({ }: any) => {
    const [banners, setBanners] = useState([]);
    const carouselRef = useRef(null); // Reference to the carousel
    const [modalVisible, setModalVisible] = useState(true);

    useEffect(() => {
        const fetchImageList = async () => {
            const res = await ApiService.postWithToken("api/banner/all", { type: "header" });
            if (res?.data?.length > 0) {
                setBanners(res?.data);
            }
        };

        fetchImageList();
    }, []);
    const onClose = () => {
        setModalVisible(false);
    }

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (banners.length > 0) {
            interval = setInterval(() => {
                // Move to the next item
                carouselRef.current?.snapToNext();
            }, 2000); // Change slide every 3 seconds
        }

        return () => clearInterval(interval); // Cleanup the interval on unmount
    }, [banners]);

    const renderItem = ({ item }: any) => {
        return (
            <View style={styles.slide}>
                <Image
                    source={{ uri: `${CONFIG.APP_URL}/uploads/banner/${item.image}` }} // Combine the image URL
                    style={styles.image}
                    resizeMode="contain" // Use "contain" to maintain aspect ratio
                />
            </View>
        );
    };

    return (

        <>
            {banners.length > 0 && <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => { onClose() }}
            >
                <View style={styles.modalContainer}>
                    <TouchableOpacity onPress={() => { onClose() }} style={styles.closeButton}>
                        <Text style={styles.closeText}>Close</Text>
                    </TouchableOpacity>
                    <View style={styles.carouselContainer}>
                        <Carousel
                            ref={carouselRef} // Attach the ref to the Carousel
                            data={banners}
                            renderItem={renderItem}
                            sliderWidth={300} // Adjust based on your design
                            itemWidth={300}
                        />
                    </View>
                </View>
            </Modal>}
        </>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.9)', // Background color for modal
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
    },
    closeText: {
        color: '#fff',
        fontSize: 16,
    },
    carouselContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '80%', // Adjust height as needed to fit your design
        width: '100%',
    },
    slide: {
        width: '100%', // Use full width of the carousel
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%', // Make image take full width of the slide
        height: '90%', // Allow height to adjust based on aspect ratio
        aspectRatio: 1, // Set a default aspect ratio, adjust as needed
    },
    caption: {
        color: '#fff',
        textAlign: 'center',
        marginTop: 10,
    },
});

export default SliderModal;
