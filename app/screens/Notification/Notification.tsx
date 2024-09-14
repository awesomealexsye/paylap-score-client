import { useNavigation, useTheme } from '@react-navigation/native';
import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, LayoutAnimation, Image } from 'react-native'
import Header from '../../layout/Header';
import { IMAGES } from '../../constants/Images';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import SwipeBox from '../../components/SwipeBox';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { ApiService } from '../../lib/ApiService';


const SwipeData: any = []

const Notification = () => {


    useEffect(() => {
        getNotificationRecords();
    }, []);

    const getNotificationRecords = () => {
        ApiService.postWithToken("api/fetch_admin/notification", {}).then((res: any) => {
            let record_res = res.data.record ?? [];
            setLists(record_res);
        });
    }

    const theme = useTheme();
    const { colors }: { colors: any } = theme;

    const navigation = useNavigation<any>();

    const [lists, setLists] = useState<any>(SwipeData);

    const deleteItem = (index: any) => {
        ApiService.postWithToken("api/fetch_admin_delete/notification", { record_id: index }).then((res: any) => {
            getNotificationRecords();
        });
    };

    return (
        <View style={{ backgroundColor: colors.background, flex: 1 }}>
            <Header
                title='Notifications (12)'
                leftIcon='back'
                rightIcon1={'search'}
            />
            <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
                <View style={[GlobalStyleSheet.container, { padding: 0, paddingTop: 15 }]}>
                    <GestureHandlerRootView style={{ paddingHorizontal: 15 }}>
                        {lists.map((data: any, index: any) => {
                            return (
                                <View
                                    style={{ marginBottom: 5, marginHorizontal: -15, paddingHorizontal: 15 }}
                                    key={index}
                                >
                                    <SwipeBox data={data} colors={colors} handleDelete={() => deleteItem(data?.id)} />
                                </View>
                            )
                        })}
                    </GestureHandlerRootView>
                </View>
            </ScrollView>
        </View>
    )
}

export default Notification