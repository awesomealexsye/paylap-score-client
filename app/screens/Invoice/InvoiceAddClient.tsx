import { StackScreenProps } from '@react-navigation/stack';
import React, { useState } from 'react';
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	Alert,
	KeyboardAvoidingView,
	Platform,
	TouchableWithoutFeedback,
	Keyboard,
} from 'react-native';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import Header from '../../layout/Header';
import { COLORS } from '../../constants/theme';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import { ApiService } from '../../lib/ApiService';
import { MessagesService } from '../../lib/MessagesService';
import StorageService from '../../lib/StorageService';
import CONFIG from '../../constants/config';
import { useTheme } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native-paper';

type InvoiceAddClientProps = StackScreenProps<RootStackParamList, 'InvoiceAddClient'>;

export const InvoiceAddClient = ({ navigation }: InvoiceAddClientProps) => {
	const theme = useTheme();
	const { colors } = theme;
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const [form, setForm] = useState({
		name: '',
		phone: '',
		email: '',
		gst: '',
		zipcode: '',
		district: '',
		city: '',
		state: '',
		address: '',
		company_id: '0',
	});
	const [errors, setErrors] = useState({
		name: '',
		phone: '',
		email: '',
		zipcode: '',
		district: '',
		city: '',
		state: '',
		address: '',
	});

	// Validate required fields for both sections and add email format validation.
	const validateForm = () => {
		let valid = true;
		let newErrors: any = {};

		// Client Information fields
		if (!form.name.trim()) {
			newErrors.name = "Name is required";
			valid = false;
		}
		if (!form.phone.trim()) {
			newErrors.phone = "Mobile number is required";
			valid = false;
		}
		if (!form.email.trim()) {
			newErrors.email = "Email is required";
			valid = false;
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
			newErrors.email = "Enter a valid email address";
			valid = false;
		}
		// Address Information fields
		if (!form.zipcode.trim()) {
			newErrors.zipcode = "Pincode is required";
			valid = false;
		}
		if (!form.district.trim()) {
			newErrors.district = "District is required";
			valid = false;
		}
		if (!form.city.trim()) {
			newErrors.city = "City is required";
			valid = false;
		}
		if (!form.state.trim()) {
			newErrors.state = "State is required";
			valid = false;
		}
		if (!form.address.trim()) {
			newErrors.address = "Address is required";
			valid = false;
		}

		setErrors(newErrors);
		return valid;
	};

	// Handle input changes. Email is forced to lowercase.
	// When zipcode is 6 digits, automatically fetch address details.
	const handleChange = (key: string, value: string) => {
		if (key === 'email') {
			value = value.toLowerCase();
		}
		if (key === 'gst') {
			value = value.toUpperCase();
		}
		setForm((prev) => ({ ...prev, [key]: value }));
		setErrors((prev) => ({ ...prev, [key]: '' }));

		if (key === 'zipcode') {
			if (value.length === 6) {
				fetchPincodeDetails(value);
			} else {
				// Clear auto‑filled address fields if pincode is not 6 digits
				setForm((prev) => ({ ...prev, city: '', state: '', district: '' }));
			}
		}
	};

	// Call Postal Pincode API and update District, City, and State fields.
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
				setForm((prev) => ({
					...prev,
					city: postOffice.Block || '',
					state: postOffice.State || '',
					district: postOffice.District || '',
				}));
			} else {
				Alert.alert('Invalid Pincode', 'No details found for the entered pincode.');
				setForm((prev) => ({ ...prev, city: '', state: '', district: '' }));
			}
		} catch (error) {
			console.error('Error fetching pincode details', error);
			Alert.alert('Error', 'Unable to fetch pincode details. Please try again later.');
			setForm((prev) => ({ ...prev, city: '', state: '', district: '' }));
		}
	};

	// Handle form submission
	const handleSubmit = async () => {
		if (validateForm()) {
			const companyInfo = await StorageService.getStorage(CONFIG.HARDCODE_VALUES.INVOICE_GEN_SESSION.ORGANIZATION_INFO);
			if (companyInfo != null) {
				setIsLoading(true);
				const companyInfoObj = JSON.parse(companyInfo);
				form.company_id = companyInfoObj.id;
				ApiService.postWithToken('api/invoice-generator/customer/add', form)
					.then((res) => {
						MessagesService.commonMessage(res.message, res.status ? 'SUCCESS' : 'ERROR');
						if (res.status) {
							navigation.navigate('InvoiceClients');
						}
						setIsLoading(false);
					})
					.catch((err) => {
						setIsLoading(false);
						MessagesService.commonMessage('Something went wrong', 'ERROR');
					});
			} else {
				MessagesService.commonMessage("Invalid Company ID.");
			}
		} else {
			MessagesService.commonMessage('Please fill all required fields', 'ERROR');
		}
	};

	return (
		<>
			<Header leftIcon={'back'} title={'Add Client'} titleRight />
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				style={{ flex: 1 }}
				keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0} // Adjust as needed for your header height
			>
				<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
					<ScrollView
						contentContainerStyle={[
							styles.scrollContainer,
							{ backgroundColor: colors.background },
						]}
					>
						{/* Client Information Section */}
						<View style={[styles.card, { backgroundColor: colors.card }]}>
							<Text style={[styles.sectionTitle, { color: colors.title }]}>Client Information</Text>

							<View style={styles.inputContainer}>
								<Input
									placeholder="Full Name"
									value={form.name}
									onChangeText={(text) => handleChange('name', text)}
									style={[styles.input, { color: colors.title }]}
								/>
								{errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
							</View>

							<View style={styles.inputContainer}>
								<Input
									placeholder="Mobile Number"
									keyboardType="phone-pad"
									maxlength={10}
									value={form.phone}
									onChangeText={(text) => handleChange('phone', text)}
									style={[styles.input, { color: colors.title }]}
								/>
								{errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}
							</View>

							<View style={styles.inputContainer}>
								<Input
									placeholder="Email Address"
									keyboardType="email-address"
									value={form.email}
									onChangeText={(text) => handleChange('email', text)}
									style={[styles.input, { color: colors.title }]}
								/>
								{errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
							</View>
							<View style={styles.inputContainer}>
								<Input
									placeholder="GST Number(If any)"
									value={form.gst}
									onChangeText={(text) => handleChange('gst', text)}
									style={[styles.input, { color: colors.title }]}
									maxlength={17}
								/>
								{errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
							</View>
						</View>

						{/* Address Information Section */}
						<View style={[styles.card, { marginTop: 20, backgroundColor: colors.card }]}>
							<Text style={[styles.sectionTitle, { color: colors.title }]}>Address Information</Text>

							<View style={styles.inputContainer}>
								<Input
									placeholder="Pincode"
									keyboardType="numeric"
									value={form.zipcode}
									onChangeText={(text) => handleChange('zipcode', text)}
									style={[styles.input, { color: colors.title }]}
								/>
								{errors.zipcode ? <Text style={styles.errorText}>{errors.zipcode}</Text> : null}
							</View>

							<View style={styles.inputContainer}>
								<Input
									placeholder="City"
									value={form.city}
									onChangeText={(text) => handleChange('city', text)}
									style={[styles.input, { color: colors.title }]}
								/>
								{errors.city ? <Text style={styles.errorText}>{errors.city}</Text> : null}
							</View>
							<View style={styles.inputContainer}>
								<Input
									placeholder="District"
									value={form.district}
									onChangeText={(text) => handleChange('district', text)}
									style={[styles.input, { color: colors.title }]}
								/>
								{errors.district ? <Text style={styles.errorText}>{errors.district}</Text> : null}
							</View>

							<View style={styles.inputContainer}>
								<Input
									placeholder="State"
									value={form.state}
									onChangeText={(text) => handleChange('state', text)}
									style={[styles.input, { color: colors.title }]}
								/>
								{errors.state ? <Text style={styles.errorText}>{errors.state}</Text> : null}
							</View>

							{/* Address field rendered as a textarea */}
							<View style={styles.inputContainer}>
								<Input
									placeholder="Address"
									value={form.address}
									onChangeText={(text) => handleChange('address', text)}
									style={[styles.input, styles.multilineInput]}
									multiline={true}
									numberOfLines={3}
								/>
								{errors.address ? <Text style={styles.errorText}>{errors.address}</Text> : null}
							</View>
						</View>

						{/* Submit Button */}
						{!isLoading ? (
							<TouchableOpacity style={styles.button} onPress={handleSubmit}>
								<Text style={styles.buttonText}>Add Client</Text>
							</TouchableOpacity>
						) : (
							<ActivityIndicator color={COLORS.title} size={'large'} />
						)}
					</ScrollView>
				</TouchableWithoutFeedback>
			</KeyboardAvoidingView>
		</>
	);
};

const styles = StyleSheet.create({
	scrollContainer: {
		flexGrow: 1,
		padding: 10,
	},
	card: {
		backgroundColor: '#fff',
		padding: 20,
		borderRadius: 15,
	},
	sectionTitle: {
		fontSize: 22,
		fontWeight: 'bold',
		marginBottom: 15,
		color: COLORS.primary,
		borderBottomWidth: 2,
		borderBottomColor: COLORS.primary,
		paddingBottom: 5,
	},
	inputContainer: {
		marginBottom: 15,
	},
	input: {
		borderColor: COLORS.primary,
		borderWidth: 1,
		borderRadius: 12,
		paddingHorizontal: 15,
		paddingVertical: 12,
		fontSize: 16,
		color: '#333',
	},
	multilineInput: {
		textAlignVertical: 'top',
		minHeight: 90,
	},
	errorText: {
		color: 'red',
		fontSize: 12,
		marginTop: 3,
	},
	button: {
		backgroundColor: COLORS.primary,
		paddingVertical: 15,
		borderRadius: 12,
		alignItems: 'center',
		marginTop: 20,
	},
	buttonText: {
		color: '#fff',
		fontSize: 18,
		fontWeight: '600',
	},
});

export default InvoiceAddClient;