import AsyncStorage from '@react-native-async-storage/async-storage';

// Types
interface Customer {
    id: number;
    name: string;
    mobile: string;
    total_amount: number;
    created_at: string;
    updated_at: string;
}

interface CustomerTransaction {
    id: number;
    customer_id: number;
    amount: number;
    description: string;
    transaction_type: 'CREDIT' | 'DEBIT';
    given_date: string;
    taken_date: string;
}

export const LedgerService = {
    // Function to save data
    saveData: async (key: string, value: any): Promise<void> => {
        try {
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem(key, jsonValue);
        } catch (e) {
            console.error('Error saving data', e);
        }
    },

    // Function to get data
    getData: async (key: string): Promise<any> => {
        try {
            const jsonValue = await AsyncStorage.getItem(key);
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (e) {
            console.error('Error retrieving data', e);
        }
    },

    // Function to generate a new unique ID
    generateUniqueId: async (key: string): Promise<number> => {
        const items = await LedgerService.getData(key);
        return items && items.length > 0 ? items[items.length - 1].id + 1 : 1;
    },

    // Function to add item to an array stored in AsyncStorage
    addItemToArray: async (key: string, item: any): Promise<void> => {
        try {
            const currentArray = await LedgerService.getData(key);
            if (Array.isArray(currentArray)) {
                currentArray.push(item);
                await LedgerService.saveData(key, currentArray);
            } else {
                await LedgerService.saveData(key, [item]);
            }
        } catch (e) {
            console.error('Error adding item to array', e);
        }
    },

    // Function to delete data
    deleteData: async (key: string): Promise<void> => {
        try {
            await AsyncStorage.removeItem(key);
        } catch (e) {
            console.error('Error deleting data', e);
        }
    },

    // Function to add a new customer
    addCustomer: async (name: string, mobile: string): Promise<void> => {
        const id = await LedgerService.generateUniqueId('customers');
        const timestamp = new Date().toISOString();
        const newCustomer: Customer = {
            id,
            name,
            mobile,
            total_amount: 0,
            created_at: timestamp,
            updated_at: timestamp,
        };
        await LedgerService.addItemToArray('customers', newCustomer);
    },

    // Function to get all customers
    getCustomers: async (): Promise<Customer[]> => {
        try {
            const customers: Customer[] = await LedgerService.getData('customers');
            return customers ? customers : [];
        } catch (e) {
            console.error('Error getting customers', e);
            return [];
        }
    },

    // Function to update a customer
    updateCustomer: async (customerId: number, updatedFields: Partial<Customer>): Promise<void> => {
        try {
            const customers: Customer[] = await LedgerService.getData('customers');
            if (customers) {
                const updatedCustomers = customers.map((customer) =>
                    customer.id === customerId ? { ...customer, ...updatedFields, updated_at: new Date().toISOString() } : customer
                );
                await LedgerService.saveData('customers', updatedCustomers);
            }
        } catch (e) {
            console.error('Error updating customer', e);
        }
    },

    // Function to add a new customer transaction
    addCustomerTransaction: async (customer_id: number, amount: number, description: string, transaction_type: 'CREDIT' | 'DEBIT', given_date: string, taken_date: string): Promise<void> => {
        const id = await LedgerService.generateUniqueId('customer_transactions');
        const newTransaction: CustomerTransaction = {
            id,
            customer_id,
            amount,
            description,
            transaction_type, // CREDIT or DEBIT
            given_date,
            taken_date,
        };
        await LedgerService.addItemToArray('customer_transactions', newTransaction);

        // Update the customer's total amount
        const customers: Customer[] = await LedgerService.getData('customers');
        if (customers) {
            const updatedCustomers = customers.map((customer) => {
                if (customer.id === customer_id) {
                    const updatedAmount = transaction_type === 'CREDIT' ? customer.total_amount + amount : customer.total_amount - amount;
                    return { ...customer, total_amount: updatedAmount, updated_at: new Date().toISOString() };
                }
                return customer;
            });
            await LedgerService.saveData('customers', updatedCustomers);
        }
    },

    // Function to get transactions for a specific customer
    getCustomerTransactions: async (customerId: number): Promise<CustomerTransaction[]> => {
        try {
            const transactions: CustomerTransaction[] = await LedgerService.getData('customer_transactions');
            if (transactions) {
                return transactions.filter((transaction) => transaction.customer_id === customerId);
            }
            return [];
        } catch (e) {
            console.error('Error getting customer transactions', e);
            return [];
        }
    },

    // Function to update a customer transaction
    updateCustomerTransaction: async (transactionId: number, updatedFields: Partial<CustomerTransaction>): Promise<void> => {
        try {
            const transactions: CustomerTransaction[] = await LedgerService.getData('customer_transactions');
            if (transactions) {
                const updatedTransactions = transactions.map((transaction) =>
                    transaction.id === transactionId ? { ...transaction, ...updatedFields } : transaction
                );
                await LedgerService.saveData('customer_transactions', updatedTransactions);
            }
        } catch (e) {
            console.error('Error updating customer transaction', e);
        }
    },
};