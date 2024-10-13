import React from 'react';
import { Modal, Text, TouchableOpacity, View, StyleSheet, Image } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import Button from '../Button/Button';
import Header from '../../layout/Header';


type Props = {
	close: any;
	modalVisible: boolean
	title: any,
	previewImage: any,

}

const FilePreviewModal = ({ close, modalVisible, title, previewImage }: Props) => {

	const theme = useTheme();
	const { colors }: { colors: any } = theme;


	return (
		<>
			<Modal
				// animation="slide"
				transparent={true}
				visible={modalVisible}
			>
				<View style={{
					// alignItems: 'center',
					justifyContent: "space-around",
					paddingHorizontal: 5,
					paddingVertical: 2,
					margin: 150,
					elevation: 5,
					backgroundColor: theme.dark ? "#3B3B3c" : colors.card,
					borderRadius: SIZES.radius_lg,
					marginHorizontal: 20,
					shadowColor: "#025135",
					shadowOffset: {
						width: 0,
						height: 15,
					},
					shadowOpacity: 0.34,
					shadowRadius: 31.27,

				}}>
					<Header
						title=' Profile Preview'
						rightIcon5='close'
						rightIcon5Callback={() => { close(false) }}
						titleRight
					/>
					<View style={[{ flexDirection: "row", justifyContent: "space-around", alignItems: "center", paddingVertical: 10, }]}>
						<Image
							style={{ height: 380, width: 330, }}
							source={{ uri: previewImage }}
						/>
					</View>
				</View>

			</Modal >
		</>
	);
};
export default FilePreviewModal;