import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import Ripple from 'react-native-material-ripple';
import { useTheme } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import LoginSheet from '../../components/BottomSheet/LoginSheet';
import RegisterSheet from '../../components/BottomSheet/RegisterSheet';
import SuccessSheet from '../../components/BottomSheet/SuccessSheet';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import Header from '../../layout/Header';
import Button from '../../components/Button/Button';

type Props = {
    height?: string,
}


const BottomSheetInput = forwardRef((props, ref) => {

    const theme = useTheme();
    const { colors }: { colors: any } = theme;

    const refRBSheet = useRef<any>(null);

    const [activeSheet, setActiveSheet] = useState<any>('');
    const [isSheet, setIsSheet] = useState(false);

    useImperativeHandle(ref, () => ({

        openSheet: async (value: string) => {
            await setActiveSheet(value);
            await refRBSheet.current.open();
        },
        closeSheet() {
            refRBSheet.current.close();
        }

    }));

    const ActionData = [

        {
            icon: 'log-out',
            title: "Login Sheet",
            sheet: 'login',
        }

    ]

    const handleSheet = async (value: string) => {
        await setActiveSheet(value);
        await refRBSheet.current.open();
    }

    return (
        <>
            <RBSheet
                ref={refRBSheet}
                closeOnDragDown={true}
                height={activeSheet === "success" ? 215 :
                    activeSheet === "login" ? 365 :
                        activeSheet === "register" ? 460 : 230}
                openDuration={100}
                customStyles={{

                    container: {
                        backgroundColor: theme.dark ? colors.background : colors.cardBg,
                    },
                    draggableIcon: {
                        marginTop: 10,
                        marginBottom: 5,
                        height: 5,
                        width: 80,
                        backgroundColor: colors.border,
                    }
                }}
            >

                <LoginSheet sheetRef={refRBSheet} />
                {/* {activeSheet === "success" ?
                    <SuccessSheet /> :
                    activeSheet === "login" ?
                        <LoginSheet sheetRef={refRBSheet} /> :
                        activeSheet === "register" ?
                            <RegisterSheet sheetRef={refRBSheet} />
                            :
                            <SuccessSheet />
                } */}

            </RBSheet>

            <View style={{ flex: 1, backgroundColor: colors.background }}>
                <View style={{}}>
                    <ScrollView>
                        <View style={[GlobalStyleSheet.container, { padding: 0, paddingTop: 10 }]}>
                            <View style={{}}>
                                <View style={{}}>
                                    {ActionData.map((data: any, index) => {
                                        return (
                                            <Button title={'Sent OTP'} onPress={() => { handleSheet(data.sheet) }} />

                                        )
                                    })}
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </>
    );
});

export default BottomSheetInput;