import React, { useState } from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	ScrollView,
	Image,
	TextInput,
	KeyboardAvoidingView,
	Platform,
	Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import Button from '../../components/Button/Button';
import { ApiService } from '../../lib/ApiService';
import { MessagesService } from '../../lib/MessagesService';
import { ActivityIndicator } from 'react-native-paper';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import { StackScreenProps } from '@react-navigation/stack';
import Header from '../../layout/Header';

type InvoiceAddOrganizationProps = StackScreenProps<RootStackParamList, 'InvoiceAddOrganization'>;

export const InvoiceAddOrganization = ({ navigation }: InvoiceAddOrganizationProps) => {
	const [form, setForm] = useState<any>({
		name: '',
		company_address: '',
		gst: '',
		phone: '',
		email: '',
		website: '',
		invoice_init_number: '1000',
		zipcode: '',
		city: '',
		state: '',
		district: '', // new field for district
		image: '',
	});
	const [errors, setErrors] = useState<any>({});
	const [imageUri, setImageUri] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	// Handle input changes.
	// For email and website, automatically convert the value to lowercase.
	const handleChange = (key: string, value: string) => {
		if (key === 'email' || key === 'website') {
			value = value.toLowerCase();
		}
		if (key === 'gst') {
			value = value.toUpperCase();
		}
		setForm((prev: any) => ({ ...prev, [key]: value }));
		setErrors((prev: any) => ({ ...prev, [key]: '' }));
		if (key === 'zipcode') {
			if (value.length === 6) {
				fetchPincodeDetails(value);
			} else {
				// Clear auto‑filled fields if pincode is not 6 digits
				setForm((prev: any) => ({ ...prev, city: '', state: '', district: '' }));
			}
		}
	};

	// Fetch pincode details from the API and update the city, state, and district fields
	const fetchPincodeDetails = async (pincode: string) => {
		try {
			const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
			const data = await response.json();
			if (
				data &&
				data[0].Status === 'Success' &&
				data[0].PostOffice &&
				data[0].PostOffice.length > 0
			) {
				const postOffice = data[0].PostOffice[0];
				setForm((prev: any) => ({
					...prev,
					city: postOffice.Division || '',
					state: postOffice.State || '',
					district: postOffice.District || '',
				}));
			} else {
				Alert.alert('Invalid Pincode', 'No details found for the entered pincode.');
				setForm((prev: any) => ({
					...prev,
					city: '',
					state: '',
					district: '',
				}));
			}
		} catch (error) {
			console.error('Error fetching pincode details', error);
			Alert.alert('Error', 'Unable to fetch pincode details. Please try again later.');
			setForm((prev: any) => ({
				...prev,
				city: '',
				state: '',
				district: '',
			}));
		}
	};

	// Image Picker Function
	const pickImage = async () => {
		let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (!permissionResult.granted) {
			alert('Permission to access gallery is required!');
			return;
		}

		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [4, 4],
			quality: 1,
			base64: true,
		});

		if (!result.canceled) {
			setImageUri(result.assets[0].uri);
			setForm((prev: any) => ({ ...prev, image: result.assets[0].base64 }));
		}
	};

	// Handle form submission with additional validations for email, website, and phone.
	const handleSubmit = async () => {
		let newErrors: any = {};

		// Validate Name
		if (!form.name.trim()) {
			newErrors.name = "Name is required";
		}
		// Validate Email
		if (!form.email.trim()) {
			newErrors.email = "Email is required";
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
			newErrors.email = "Enter correct email";
		}
		// Validate Website
		if (!form.website.trim()) {
			newErrors.website = "Website is required";
		} else if (!/^(https?:\/\/)?([\w\d-]+\.)+[\w-]{2,4}(\/.*)?$/.test(form.website)) {
			newErrors.website = "Enter correct website";
		}
		// Validate Phone (assuming a 10-digit number)
		if (!form.phone.trim()) {
			newErrors.phone = "Phone is required";
		} else if (!/^\d{10}$/.test(form.phone)) {
			newErrors.phone = "Enter correct phone";
		}
		// Validate GST Number
		if (!form.gst.trim()) {
			newErrors.gst = "GST Number is required";
		}
		// Validate Company Address
		if (!form.company_address.trim()) {
			newErrors.company_address = "Company address is required";
		}
		// Validate Pincode
		if (!form.zipcode.trim()) {
			newErrors.zipcode = "Pincode is required";
		}

		setErrors(newErrors);
		if (Object.keys(newErrors).length > 0) {
			return;
		}

		setIsLoading(true);
		ApiService.postWithToken('api/invoice-generator/companies/add', form).then((res) => {
			MessagesService.commonMessage(res.message, res.status ? 'SUCCESS' : 'ERROR');
			if (res.status) {
				navigation.navigate('InvoiceOrganizations');
			}
			setIsLoading(false);
		});
	};

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			style={styles.container}
		>
			<Header leftIcon={'back'} title={'Add Organization'} titleRight />
			<ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
				{/* Header */}

				{/* <Text style={styles.headerText}>Add Organization</Text> */}

				{/* Company Logo */}
				<TouchableOpacity style={styles.logoContainer} onPress={pickImage}>
					{imageUri ? (
						<Image source={{ uri: imageUri }} style={styles.logo} />
					) : (
						<Ionicons name="camera-outline" size={60} color={COLORS.primary} />
					)}
				</TouchableOpacity>
				<Text style={styles.labelCenter}>Upload Company Logo</Text>

				<View style={styles.card}>
					{/* Basic Information Section */}
					<Text style={styles.sectionTitle}>Basic Information</Text>
					<CustomInput
						label="Name"
						icon="business-outline"
						placeholder="Enter Name"
						value={form.name}
						onChangeText={(text: string) => handleChange('name', text)}
						error={errors.name}
					/>
					<CustomInput
						label="GST Number"
						icon="pricetag-outline"
						placeholder="Enter GST Number"
						value={form.gst}
						onChangeText={(text: string) => handleChange('gst', text)}
						error={errors.gst}
					/>
					<CustomInput
						maxLength={10}
						label="Phone"
						icon="call-outline"
						placeholder="Enter Phone"
						keyboardType="phone-pad"
						value={form.phone}
						onChangeText={(text: string) => handleChange('phone', text)}
						error={errors.phone}
					/>
					<CustomInput
						label="Email"
						icon="mail-outline"
						placeholder="Enter Email"
						keyboardType="email-address"
						value={form.email}
						onChangeText={(text: string) => handleChange('email', text)}
						error={errors.email}
					/>
					<CustomInput
						label="Website"
						icon="globe-outline"
						placeholder="Enter Website URL"
						value={form.website}
						onChangeText={(text: string) => handleChange('website', text)}
						error={errors.website}
					/>

					{/* Address Information Section */}
					<Text style={styles.sectionTitle}>Address Information</Text>
					<CustomInput
						label="Pincode"
						icon="pin-outline"
						placeholder="Enter Pincode"
						keyboardType="numeric"
						value={form.zipcode}
						onChangeText={(text: string) => handleChange('zipcode', text)}
						error={errors.zipcode}
						maxLength={6}
					/>

					<CustomInput
						label="District"
						icon="location-outline"
						placeholder="District"
						value={form.district}
						onChangeText={(text: string) => handleChange('district', text)}
						error={errors.district}
					/>
					<CustomInput
						label="City"
						icon="home-outline"
						placeholder="City"
						value={form.city}
						onChangeText={(text: string) => handleChange('city', text)}
						error={errors.city}
					/>
					<CustomInput
						label="State"
						icon="flag-outline"
						placeholder="State"
						value={form.state}
						onChangeText={(text: string) => handleChange('state', text)}
						error={errors.state}
					/>

					<CustomInput
						label="Company Address"
						icon="location-outline"
						placeholder="Enter Address"
						value={form.company_address}
						onChangeText={(text: string) => handleChange('company_address', text)}
						error={errors.company_address}
						multiline={true}
						numberOfLines={3}
						style={[styles.input, styles.multilineInput]}
					/>

					{/* Submit Button */}
					{!isLoading ? (
						<Button title="Add Organization" onPress={handleSubmit} style={styles.button} />
					) : (
						<ActivityIndicator color={COLORS.title} size={'large'} />
					)}
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
};

// Custom Input Component with updated styling
const CustomInput = ({ label, icon, error, style, ...props }: any) => (
	<View style={styles.inputContainer}>
		{label ? <Text style={styles.label}>{label}</Text> : null}
		<View style={[styles.inputWrapper, style]}>
			<Ionicons name={icon} size={20} color={COLORS.primary} style={styles.icon} />
			<TextInput {...props} style={[styles.input, style]} />
		</View>
		{error ? <Text style={styles.errorText}>{error}</Text> : null}
	</View>
);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLORS.light,
	},
	scrollContainer: {
		flexGrow: 1,
		// padding: 20,
	},
	headerText: {
		fontSize: 28,
		fontWeight: 'bold',
		textAlign: 'center',
		marginBottom: 20,
		color: COLORS.primary,
	},
	logoContainer: {
		alignSelf: 'center',
		backgroundColor: '#f3f3f3',
		padding: 15,
		borderRadius: 75,
		marginBottom: 10,
		elevation: 3,
		shadowColor: '#000',
		shadowOpacity: 0.2,
		shadowRadius: 5,
	},
	logo: {
		width: 100,
		height: 100,
		borderRadius: 50,
	},
	labelCenter: {
		textAlign: 'center',
		fontSize: 14,
		color: '#666',
		marginBottom: 15,
	},
	card: {
		backgroundColor: '#fff',
		padding: 20,
		borderRadius: 15,
		elevation: 5,
		shadowColor: '#000',
		shadowOpacity: 0.1,
		shadowRadius: 5,
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 15,
		color: COLORS.primary,
	},
	inputContainer: {
		marginBottom: 15,
	},
	label: {
		fontSize: 16,
		marginBottom: 5,
		color: '#333',
	},
	inputWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
		borderWidth: 1,
		borderColor: COLORS.primary,
		borderRadius: 30,
		paddingHorizontal: 15,
		backgroundColor: '#f9f9f9',
	},
	icon: {
		marginRight: 10,
	},
	input: {
		flex: 1,
		paddingVertical: 12,
		fontSize: 16,
		color: '#333',
	},
	errorText: {
		color: 'red',
		fontSize: 12,
		marginTop: 3,
	},
	button: {
		marginTop: 20,
	},
	multilineInput: {
		textAlignVertical: 'top',
		minHeight: 90,
	},
});

export default InvoiceAddOrganization;