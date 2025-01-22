import { StackScreenProps } from '@react-navigation/stack';
import React, { useState } from 'react';
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	ScrollView,
} from 'react-native';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import Header from '../../layout/Header';

import { COLORS, FONTS } from '../../constants/theme';
import { useTheme } from "@react-navigation/native";
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';

type InvoiceAddOrganizationProps = StackScreenProps<RootStackParamList, 'InvoiceAddOrganization'>;

export const InvoiceAddOrganization = ({ navigation }: InvoiceAddOrganizationProps) => {

	const theme = useTheme();
	const { colors }: { colors: any } = theme;

	const [form, setForm] = useState({
		fullName: '',
		mobileNumber: '',
		emailAddress: '',
		address: '',
		notes: '',
	});

	const handleChange = (key, value) => {
		setForm({ ...form, [key]: value });
	};

	const handleSubmit = () => {
		console.log('Organization Details:', form);
		// Add your form submission logic here
	};

	return (
		<ScrollView contentContainerStyle={styles.container}>
			{/* Header */}
			<Header
				leftIcon={'back'}
				title={'Add Organizatios'}
				titleRight
			/>

			{/* Form */}
			<View style={{ padding: 15, }} >
				<View style={styles.form}>
					<View style={{ marginVertical: 10, }}>
						<Input
							placeholder='Full Name'
							value={form.fullName}
							onChangeText={(text) => handleChange('fullName', text)}
						/>
					</View>
					<View style={{ marginVertical: 10, }}>
						<Input
							placeholder='Mobile Number'
							keyboardType="phone-pad"
							value={form.mobileNumber}
							onChangeText={(text) => handleChange('mobileNumber', text)}
						/>
					</View>
					<View style={{ marginVertical: 10, }}>
						<Input
							placeholder='Email Address'
							keyboardType="email-address"
							value={form.emailAddress}
							onChangeText={(text) => handleChange('emailAddress', text)}
						/>
					</View><View style={{ marginVertical: 10, }}>
						<Input
							placeholder='Address'
							value={form.address}
							onChangeText={(text) => handleChange('address', text)}
						/>

					</View><View style={{ marginVertical: 10, }}>
						<Input
							placeholder='Note'
							value={form.notes}
							onChangeText={(text) => handleChange('notes', text)}

						/>

					</View>

					<Text style={[styles.notesHint, { color: colors.title }]}>
						These notes will not be visible to the organization
					</Text>
				</View>

				{/* Submit Button */}
				<Button title='Add Organizations' onPress={handleSubmit}></Button>
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
	},

	form: {
		marginBottom: 20,
	},
	input: {
		backgroundColor: '#F7F7F7',
		borderRadius: 8,
		paddingHorizontal: 15,
		paddingVertical: 12,
		marginBottom: 15,
		borderColor: '#ccc',
		borderWidth: 1,
		fontSize: 16,
	},
	notesInput: {
		height: 100,
		textAlignVertical: 'top',
	},
	notesHint: {
		fontSize: 12,
		color: '#999',
		marginBottom: 15,
	},
	submitButton: {
		backgroundColor: '#007BFF',
		borderRadius: 8,
		paddingVertical: 15,
		alignItems: 'center',
		margin: 20,
	},
	submitButtonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: 'bold',
	},
});

export default InvoiceAddOrganization;