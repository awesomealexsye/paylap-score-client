import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { RootStackParamList } from '../navigation/RootStackParamList';
import { StackScreenProps } from '@react-navigation/stack';
import Button from '../components/Button/Button';
import Header from '../layout/Header';
import { useTheme } from '@react-navigation/native';
import { FONTS } from '../constants/theme';
import { ApiService } from '../lib/ApiService';

type TermsDataItem = {
	heading: string;
	description: string;
};
type TermsAndConditionsScreenProps = StackScreenProps<RootStackParamList, 'TermsAndConditionsScreen'>;
const TermsAndConditionsScreen = ({ navigation, route }: TermsAndConditionsScreenProps) => {




	const theme = useTheme();
	const { colors }: { colors: any; } = theme;
	const [termsData, setTermsData] = useState<any>([]);
	// const [termsData, setTermsData] = useState<Term[]>([]);

	useEffect(() => {
		ApiService.postWithToken("api/terms-and-condition", {}).then((res: any) => {
			setTermsData(res.data)
		});
	}, []);

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
				{termsData.map((item: any, index: number) => (
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