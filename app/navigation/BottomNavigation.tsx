import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomTabParamList } from './BottomTabParamList';
import WishlistScreen from '../screens/Wishlist/Wishlist';
import MyCartScreen from '../screens/MyCart/MyCart';
import HomeScreen from '../screens/Home/Home';
import ProfileScreen from '../screens/Profile/Profile';
import BottomMenu from '../layout/BottomMenu';
import { useTheme } from '@react-navigation/native';
import CustomerScore from '../screens/Profile/CustomerScore';
import NotAvailable from '../screens/NotAvailable';


const Tab = createBottomTabNavigator<BottomTabParamList>();


const BottomNavigation = () => {

    const theme = useTheme();
    const { colors }: { colors: any } = theme;

    return (
        <Tab.Navigator
            initialRouteName='Home'
            screenOptions={{
                headerShown: false
            }}
            tabBar={(props: any) => <BottomMenu {...props} />}
        >
            <Tab.Screen
                name='Home'
                component={HomeScreen}
            />
            <Tab.Screen
                name='CustomerScore'
                component={CustomerScore}
            />
            <Tab.Screen
                name='NotAvailable'
                component={NotAvailable}
            />
            <Tab.Screen
                name='Profile'
                component={ProfileScreen}
            />
        </Tab.Navigator>
    )
}

export default BottomNavigation;