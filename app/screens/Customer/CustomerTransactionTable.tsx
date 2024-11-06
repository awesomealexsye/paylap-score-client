import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { ApiService } from '../../lib/ApiService';

// Define the interface for the transaction data
interface Transaction {
    transaction_id: string;
    transaction_type: string;
    amount: number;
    created_at: string;
}

// Define the props interface for the component
interface CustomerTransactionTableProps {
    transaction_id: string; // Adjust type as needed (string, number, etc.)
}

const CustomerTransactionTable: React.FC<CustomerTransactionTableProps> = ({ transaction_id }) => {
    // State for the transaction data
    const [data, setData] = useState<Transaction[]>([]); // State typed as an array of Transaction

    useEffect(() => {
        const fetchTransaction = async () => {
            const res = await ApiService.postWithToken("api/shopkeeper/transactions/list-user-transaction", { transaction_id });
            if (res.status) {
                setData(res.data);
            }
        };

        fetchTransaction(); // Call the fetch function
    }, [transaction_id]); // Add transaction_id as a dependency

    return (
        data.length > 0 &&
        <SafeAreaView style={styles.container}>
            <ScrollView horizontal>
                <View style={styles.table}>
                    {/* Header Row */}
                    <View style={styles.tableHeader}>
                        <Text style={styles.headerText}>Transaction ID</Text>
                        <Text style={styles.headerText}>Type</Text>
                        <Text style={styles.headerText}>Amount</Text>
                        <Text style={styles.headerText}>Date</Text>
                    </View>

                    {/* Data Rows */}
                    {data.map((item) => (
                        <View key={item.id} style={styles.tableRow}>
                            <Text style={styles.rowText}>{item.transaction_id}</Text>
                            <Text style={styles.rowText}>{item.transaction_type}</Text>
                            <Text style={styles.rowText}>{item.amount}</Text>
                            <Text style={styles.rowText}>{item.created_at}</Text>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    table: {
        width: '100%', // Ensure full width
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginVertical: 10,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#f1f1f1',
        borderBottomWidth: 1,
        borderColor: '#ccc',
        padding: 10,
    },
    headerText: {
        flex: 1,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    tableRow: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    rowText: {
        flex: 1,
        textAlign: 'center',
    },
});

export default CustomerTransactionTable;
