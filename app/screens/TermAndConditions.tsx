import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { RootStackParamList } from '../navigation/RootStackParamList';
import { StackScreenProps } from '@react-navigation/stack';
import Button from '../components/Button/Button';
import Header from '../layout/Header';
import { useTheme } from '@react-navigation/native';
import { FONTS } from '../constants/theme';

const termsData = [
	{ heading: '1. Introduction', description: 'Welcome to PayLap Score By accessing or using our mobile application, you agree to comply with and be bound by these terms and conditions.' },
	{ heading: '2. User Responsibilities', description: 'You agree to use the app only for lawful purposes and not engage in any activity that disrupts or interferes with the app\'s operation.' },
	{ heading: '3. Account Security', description: 'You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.' },
	{ heading: '4. Privacy Policy', description: 'Please refer to our Privacy Policy to understand how we collect, use, and share your personal information.' },
	{ heading: '5. Termination', description: 'We reserve the right to terminate or suspend your access to the app at our sole discretion, without prior notice or liability, for conduct that we believe violates these terms.' },
	{ heading: '6. Changes to Terms', description: 'We may modify these terms at any time. It is your responsibility to review these terms periodically for any changes.' },
	{ heading: '7. Contact Us', description: 'If you have any questions about these terms, please contact us at support@[appname].com.' },
];
type TermsAndConditionsScreenProps = StackScreenProps<RootStackParamList, 'TermsAndConditionsScreen'>;
const TermsAndConditionsScreen = ({ navigation, route }: TermsAndConditionsScreenProps) => {




	const theme = useTheme();
	const { colors }: { colors: any; } = theme;

	return (

		<View style={{ backgroundColor: colors.background, flex: 1 }}>

			<Header
				title=' Terms and Conditions'
				leftIcon='back'
				titleRight
			/>
			<ScrollView style={{
				flex: 1,
				padding: 20,
				backgroundColor: colors.background,
			}}>
				{termsData.map((item, index) => (
					<View key={index} style={
						{ marginBottom: 20, }
					}>
						<Text style={{
							...FONTS.fontBold,
							marginBottom: 5, color: colors.title
						}}>{item.heading}</Text>
						<Text style={{
							...FONTS.fontRegular,
							marginBottom: 5, color: colors.title
						}}>{item.description}</Text>
					</View>
				))}

				{/* <Button
					title="Accept and Continue"

					onPress={() => navigation.navigate('Home')}
				/> */}
			</ScrollView>

		</View >
	);
};

export default TermsAndConditionsScreen;