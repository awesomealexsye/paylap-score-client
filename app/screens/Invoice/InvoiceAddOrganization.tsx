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
import { useTheme } from '@react-navigation/native';
import Input from '../../components/Input/Input';

type InvoiceAddOrganizationProps = StackScreenProps<RootStackParamList, 'InvoiceAddOrganization'>;

export const InvoiceAddOrganization = ({ navigation }: InvoiceAddOrganizationProps) => {
	const theme = useTheme();
	const { colors }: { colors: any } = theme;

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
	const handleBasicChanges = (key: string, value: string) => {
		setForm((prev: any) => ({ ...prev, [key]: value }));
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
					city: postOffice.Block || '',
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
		<>
			<Header leftIcon={'back'} title={'Add Organization'} titleRight />
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				style={styles.container}
			>
				<ScrollView
					keyboardShouldPersistTaps="handled"
					contentContainerStyle={[styles.scrollContainer, { backgroundColor: colors.background }]}
					showsVerticalScrollIndicator={false}
				>
					{/* Company Logo */}
					<TouchableOpacity style={[styles.logoContainer, { backgroundColor: colors.background }]} onPress={pickImage}>
						{imageUri ? (
							<Image source={{ uri: imageUri }} style={styles.logo} />
						) : (
							<Ionicons name="camera-outline" size={60} color={COLORS.primary} />
						)}
					</TouchableOpacity>
					<Text style={[styles.labelCenter, { color: colors.title }]}>Upload Company Logo</Text>

					<View style={[styles.card, { backgroundColor: colors.background }]}>
						{/* Basic Information Section */}
						<Text style={[styles.sectionTitle, { color: colors.title }]}>Basic Information</Text>
						<View style={styles.inputContainer}>
							<Text style={[styles.label, { color: colors.title }]}>Name</Text>
							<Input
								placeholder="Name"
								value={form.name}
								onChangeText={(text) => handleChange('name', text)}
								style={[styles.inputText, { color: colors.title }]}
							/>
							{errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
						</View>

						<View style={styles.inputContainer}>
							<Text style={[styles.label, { color: colors.title }]}>GST Number</Text>
							<Input
								placeholder="Enter GST Number"
								value={form.gst}
								onChangeText={(text) => handleChange('gst', text)}
								style={[styles.inputText, { color: colors.title }]}
							/>
							{errors.gst ? <Text style={styles.errorText}>{errors.gst}</Text> : null}
						</View>

						<View style={styles.inputContainer}>
							<Text style={[styles.label, { color: colors.title }]}>Phone</Text>
							<Input
								placeholder="Enter Phone"
								value={form.phone}
								onChangeText={(text) => handleChange('phone', text)}
								style={[styles.inputText, { color: colors.title }]}
								keyboardType="phone-pad"
								maxlength={10}
							/>
							{errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}
						</View>

						<View style={styles.inputContainer}>
							<Text style={[styles.label, { color: colors.title }]}>Email</Text>
							<Input
								placeholder="Enter Email"
								value={form.email}
								onChangeText={(text) => handleChange('email', text)}
								style={[styles.inputText, { color: colors.title }]}
								keyboardType="email-address"
							/>
							{errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
						</View>

						<View style={styles.inputContainer}>
							<Text style={[styles.label, { color: colors.title }]}>Website</Text>
							<Input
								placeholder="Enter Website URL"
								value={form.website}
								onChangeText={(text) => handleChange('website', text)}
								style={[styles.inputText, { color: colors.title }]}
							/>
							{errors.website ? <Text style={styles.errorText}>{errors.website}</Text> : null}
						</View>

						{/* Address Information Section */}
						<Text style={[styles.sectionTitle, { color: colors.title }]}>Address Information</Text>
						<View style={styles.inputContainer}>
							<Text style={[styles.label, { color: colors.title }]}>Pincode</Text>
							<Input
								placeholder="Enter Pincode"
								value={form.zipcode}
								onChangeText={(text) => handleChange('zipcode', text)}
								style={[styles.inputText, { color: colors.title }]}
								keyboardType="numeric"
								maxlength={6}
							/>
							{errors.zipcode ? <Text style={styles.errorText}>{errors.zipcode}</Text> : null}
						</View>
						<View style={styles.inputContainer}>
							<Text style={[styles.label, { color: colors.title }]}>City</Text>
							<Input
								placeholder="City"
								value={form.city}
								onChangeText={(text) => handleChange('city', text)}
								style={[styles.inputText, { color: colors.title }]}
							/>
							{errors.city ? <Text style={styles.errorText}>{errors.city}</Text> : null}
						</View>

						<View style={styles.inputContainer}>
							<Text style={[styles.label, { color: colors.title }]}>District</Text>
							<Input
								placeholder="District"
								value={form.district}
								onChangeText={(text) => handleChange('district', text)}
								style={[styles.inputText, { color: colors.title }]}
							/>
							{errors.district ? <Text style={styles.errorText}>{errors.district}</Text> : null}
						</View>



						<View style={styles.inputContainer}>
							<Text style={[styles.label, { color: colors.title }]}>State</Text>
							<Input
								placeholder="State"
								value={form.state}
								onChangeText={(text) => handleChange('state', text)}
								style={[styles.inputText, { color: colors.title }]}
							/>
							{errors.state ? <Text style={styles.errorText}>{errors.state}</Text> : null}
						</View>

						<View style={styles.inputContainer}>
							<Text style={[styles.label, { color: colors.title }]}>Company Address</Text>
							<Input
								placeholder="Enter Address"
								value={form.company_address}
								onChangeText={(text) => handleChange('company_address', text)}
								style={[styles.inputText, { color: colors.title }]}
								multiline={true}
								numberOfLines={3}
							/>
							{errors.company_address ? <Text style={styles.errorText}>{errors.company_address}</Text> : null}
						</View>

						{/* Submit Button */}
						{!isLoading ? (
							<Button title="Add Organization" onPress={handleSubmit} style={styles.button} />
						) : (
							<ActivityIndicator color={COLORS.title} size={'large'} />
						)}
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	scrollContainer: {
		flexGrow: 1,
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
	},
	logo: {
		width: 100,
		height: 100,
		borderRadius: 50,
	},
	labelCenter: {
		textAlign: 'center',
		fontSize: 14,
		marginBottom: 15,
	},
	card: {
		padding: 20,
		borderRadius: 15,
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
	},
	inputText: {
		flex: 1,
		paddingVertical: 12,
		fontSize: 16,
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