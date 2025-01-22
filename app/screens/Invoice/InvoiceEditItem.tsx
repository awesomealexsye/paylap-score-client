import { StackScreenProps } from '@react-navigation/stack';
import React, { useState } from 'react';
import { View, Text, TextInput, Switch, TouchableOpacity, StyleSheet } from 'react-native';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import Header from '../../layout/Header';

type InvoiceEditItemProps = StackScreenProps<RootStackParamList, 'InvoiceEditItem'>;

export const InvoiceEditItem = ({ navigation }: InvoiceEditItemProps) => {
	const [isTaxable, setIsTaxable] = useState(false);
	const [hasDiscount, setHasDiscount] = useState(false);

	return (
		<View style={styles.container}>
			{/* Header */}
			<Header
				leftIcon={'back'}
				title={'Edit Item '}
				titleRight
			/>


			{/* Form */}
			<View style={styles.form}>
				<TextInput style={styles.input} placeholder="Item Name" />
				<View style={styles.row}>
					<TextInput style={[styles.input, styles.halfInput]} placeholder="Quantity" keyboardType="numeric" />
					<TextInput style={[styles.input, styles.halfInput]} placeholder="Price" keyboardType="numeric" />
				</View>

				{/* Taxable Section */}
				<View style={styles.row}>
					<Text style={styles.label}>Taxable</Text>
					<Switch
						value={isTaxable}
						onValueChange={setIsTaxable}
						trackColor={{ false: '#ccc', true: '#007BFF' }}
						thumbColor={isTaxable ? '#fff' : '#f4f3f4'}
					/>
					{isTaxable && (
						<TextInput style={[styles.input, styles.taxInput]} placeholder="Tax %" keyboardType="numeric" />
					)}
				</View>

				{/* Discount Section */}
				<View style={styles.row}>
					<Text style={styles.label}>Discount</Text>
					<Switch
						value={hasDiscount}
						onValueChange={setHasDiscount}
						trackColor={{ false: '#ccc', true: '#007BFF' }}
						thumbColor={hasDiscount ? '#fff' : '#f4f3f4'}
					/>
				</View>
			</View>

			{/* Submit Button */}
			<TouchableOpacity style={styles.button}>
				<Text style={styles.buttonText}>Edit Item</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		paddingHorizontal: 20,
		paddingTop: 10,
	},
	header: {
		alignItems: 'center',
		marginBottom: 20,
	},
	headerText: {
		fontSize: 18,
		fontWeight: 'bold',
	},
	form: {
		flex: 1,
	},
	input: {
		backgroundColor: '#F7F7F7',
		borderRadius: 8,
		padding: 10,
		marginBottom: 15,
		borderColor: '#ccc',
		borderWidth: 1,
	},
	halfInput: {
		flex: 1,
		marginRight: 10,
	},
	row: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 15,
	},
	label: {
		flex: 1,
		fontSize: 16,
	},
	taxInput: {
		width: 60,
		marginLeft: 10,
		textAlign: 'center',
	},
	button: {
		backgroundColor: '#007BFF',
		borderRadius: 8,
		paddingVertical: 15,
		alignItems: 'center',
	},
	buttonText: {
		color: '#fff',
		fontWeight: 'bold',
		fontSize: 16,
	},
});

export default InvoiceEditItem;