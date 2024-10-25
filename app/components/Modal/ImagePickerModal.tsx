import React from 'react';
import { Modal, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import Button from '../Button/Button';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import CustomerActivityBtn from '../../screens/Customer/CustomerActivityBtn';


type Props = {
	close: any;
	modalVisible: boolean
	pickImageFromCamera: any,
	pickImageFromGallery: any,
	removeImage: any
}

const ImagePickerModal = ({ close, modalVisible, pickImageFromCamera, pickImageFromGallery, removeImage }: Props) => {

	const theme = useTheme();
	const { colors }: { colors: any } = theme;


	return (
		<>
			<Modal
				animation="slide"
				transparent={true}
				visible={modalVisible}
			>
				<View style={{
					// alignItems: 'center',
					justifyContent: "space-around",
					paddingHorizontal: 10,
					paddingVertical: 30,
					margin: 250,
					elevation: 5,
					backgroundColor: theme.dark ? "#3B3B3B" : colors.card,
					borderRadius: SIZES.radius_lg,
					marginHorizontal: 30,
					shadowColor: "#025135",
					shadowOffset: {
						width: 0,
						height: 15,
					},
					shadowOpacity: 0.34,
					shadowRadius: 31.27,

				}}>
					<View style={{ borderTopWidth: 1, }}>

					</View>
					<View style={[{ flexDirection: "row", justifyContent: "space-around", alignItems: "center", paddingVertical: 10, }]}>
						<CustomerActivityBtn
							onpress={pickImageFromCamera}
							gap
							icon={<FontAwesome style={{ color: colors.title }} name={'camera'} size={22} />}
							color={colors.card}
							text='Camera'
						/>
						<CustomerActivityBtn
							onpress={pickImageFromGallery}
							gap
							icon={<FontAwesome style={{ color: colors.title }} name={'image'} size={22} />}
							color={colors.card}
							text='Gallery'
						/>

					</View>
					<View style={{ flexDirection: 'row', justifyContent: "space-evenly", marginTop: 10, }}>
						<Button
							onPress={() => close(false)}
							color={COLORS.primary}
							style={{ height: 40, width: 300, borderRadius: 25, }}
							title="Cancel" />
					</View>
				</View>
			</Modal >
		</>
	);
};
export default ImagePickerModal;