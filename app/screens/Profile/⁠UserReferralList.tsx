import { StackScreenProps } from '@react-navigation/stack';
import React, { useState } from 'react';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import { Ionicons } from '@expo/vector-icons';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Share,
} from 'react-native';
import Header from '../../layout/Header';
import { useTheme } from '@react-navigation/native';
import { COLORS } from '../../constants/theme';

interface User {
    id: string;
    name: string;
    email: string;
    dateReferred: string;
}

type UserReferralListScreenProps = StackScreenProps<RootStackParamList, 'UserReferralList'>

export const UserReferralList = ({ navigation, route }: UserReferralListScreenProps) => {

    const theme = useTheme();
    const { colors } = theme;
    const [users, setUsers] = useState<User[]>([
        { id: '1', name: 'John Doe', email: 'john@example.com', dateReferred: '2023-05-15' },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com', dateReferred: '2023-05-16' },
        { id: '3', name: 'Bob Johnson', email: 'bob@example.com', dateReferred: '2023-05-17' },
    ]);

    const referralCode = 'REF123456';

    const sendReferral = async () => {
        try {
            const result = await Share.share({
                message: `Join me on this amazing app! Use my referral code: ${referralCode}`,
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    console.log('shared with activity type of', result.activityType);
                } else {
                    console.log('shared');
                }
            } else if (result.action === Share.dismissedAction) {
                console.log('dismissed');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const renderItem = ({ item }: { item: User }) => (
        <View style={[{ ...styles.userItem, backgroundColor: colors.card }, !theme.dark && { elevation: 2 }]}>
            <View>
                <Text style={{ ...styles.userName, color: colors.text }}>{item.name}</Text>
                <Text style={{ ...styles.userEmail, color: colors.text }}>{item.email}</Text>
            </View>
            <Text style={{ ...styles.dateReferred, color: colors.text }}>{item.dateReferred}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.card} />
            <Header
                title={'Referred Users'}
                leftIcon={'back'}
                titleRight
            />
            <View style={styles.content}>
                <View style={[{ ...styles.referralInfo, backgroundColor: colors.card }, !theme.dark && { elevation: 3 }]}>
                    <Text style={{ ...styles.referralCode, color: colors.text }}>Your Referral Code: {referralCode}</Text>
                    <Text style={{ ...styles.totalCountText, color: colors.text }}>Total Referred: {users.length}</Text>
                </View>
                <FlatList
                    data={users}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    style={styles.list}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 16,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#212529',
    },
    content: {
        flex: 1,
        padding: 16,
    },
    referralInfo: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        textAlign: 'center',
        marginBottom: 16,
        padding: 16,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    referralCode: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    sendReferralButton: {
        backgroundColor: '#007bff',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 4,
    },
    sendReferralButtonText: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
    totalCountText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    list: {
        flex: 1,
    },
    userItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        marginBottom: 8,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    userEmail: {
        fontSize: 14,
    },
    dateReferred: {
        fontSize: 14,
    },
});

export default UserReferralList;