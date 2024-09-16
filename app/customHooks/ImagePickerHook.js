import { useState, useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const useImagePicker = () => {
	const [image, setImage] = useState(null);

	// Request permissions on mount
	// useEffect(() => {
	// 	(async () => {
	// 		if (Platform.OS !== 'web') {
	// 			const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
	// 			const mediaLibraryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();

	// 			// Alert if permissions are not granted
	// 			if (cameraStatus.status !== 'granted' || mediaLibraryStatus.status !== 'granted') {
	// 				Alert.alert(
	// 					'Permissions required',
	// 					'We need both camera and media library permissions to make this work.',
	// 					[{ text: 'OK' }]
	// 				);
	// 			}
	// 		}
	// 	})();
	// }, []);

	// Function to pick an image from the library
	const pickImage = async () => {
		try {
			let result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				allowsEditing: true,
				aspect: [4, 3],
				quality: 1,
			});

			if (!result.canceled) {
				setImage(result.assets[0].uri);
			}
		} catch (error) {
			console.log('Error picking image: ', error);
		}
	};

	// Function to take a photo with the camera
	const takePhoto = async () => {
		try {
			const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
			if (cameraPermission.status !== 'granted') {
				Alert.alert('Camera permission is required to take a photo');

			}

			let result = await ImagePicker.launchCameraAsync({
				allowsEditing: true,
				quality: 1,
			});


			if (!result.canceled) {
				setImage(result.assets[0].uri);
			}

		} catch (error) {
			console.log('Error taking photo: ', error);
		}
	};

	return {
		image,          // The URI of the selected or captured 
		pickImage,      // Function to open image picker
		takePhoto,      // Function to open the camera
	};
};

export default useImagePicker;
