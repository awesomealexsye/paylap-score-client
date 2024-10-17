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

interface User {
    id: string;
    name: string;
    email: string;
    dateReferred: string;
}

type UserReferralListScreenProps = StackScreenProps<RootStackParamList, 'UserReferralList'>

export const UserReferralList = ({ navigation, route }: UserReferralListScreenProps) => {
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
        <View style={styles.userItem}>
            <View>
                <Text style={styles.userName}>{item.name}</Text>
                <Text style={styles.userEmail}>{item.email}</Text>
            </View>
            <Text style={styles.dateReferred}>{item.dateReferred}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
            <View style={styles.header}>
                <Header
                    title={'Referred Users'}
                    leftIcon={'back'}
                    titleRight
                />
            </View>
            <View style={styles.content}>
                <View style={styles.referralInfo}>
                    <Text style={styles.referralCode}>Your Referral Code: {referralCode}</Text>
                    <Text style={styles.totalCountText}>Total Referred: {users.length}</Text>
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
        backgroundColor: '#f8f9fa',
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
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    referralCode: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#495057'
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
        color: '#212529',
    },
    list: {
        flex: 1,
    },
    userItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        padding: 16,
        marginBottom: 8,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#212529',
    },
    userEmail: {
        fontSize: 14,
        color: '#6c757d',
    },
    dateReferred: {
        fontSize: 14,
        color: '#6c757d',
    },
});

export default UserReferralList;