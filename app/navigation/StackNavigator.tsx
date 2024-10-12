import React from 'react';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { RootStackParamList } from './RootStackParamList';
import { StatusBar, View, Text } from 'react-native';
import { useTheme } from '@react-navigation/native';


import Onboarding from '../screens/Auth/Onboarding';
import WelCome from '../screens/Auth/WelCome';
import SignUp from '../screens/Auth/SignUp';
import SingIn from '../screens/Auth/SingIn';
import ForgotPassword from '../screens/Auth/ForgotPassword';
import OTPAuthentication from '../screens/Auth/OTPAuthentication';
import NewPassword from '../screens/Auth/NewPassword';
import DrawerNavigation from './DrawerNavigation';
import BottomNavigation from './BottomNavigation';
import Notification from '../screens/Notification/Notification';
import Search from '../screens/Search/Search';
import Products from '../screens/Category/Products';
import ProductsDetails from '../screens/Category/ProductsDetails';
import DeliveryAddress from '../screens/Payment/DeliveryAddress';
import AddDeliveryAddress from '../screens/Payment/AddDeliveryAddress';
import Payment from '../screens/Payment/Payment';
import Addcard from '../screens/Payment/Addcard';
import Checkout from '../screens/Payment/Checkout';
import Myorder from '../screens/Myorder/Myorder';
import Writereview from '../screens/Myorder/Writereview';
import Rewards from '../screens/Myorder/Rewards';
import Trackorder from '../screens/Myorder/Trackorder';
import Chat from '../screens/Chat/Chat';
import Singlechat from '../screens/Chat/Singlechat';
import Call from '../screens/Chat/Call';
import Demo from '../screens/Home/Demo';
import EditProfile from '../screens/Profile/EditProfile';
import Components from '../screens/Components/Components';
import AccordionScreen from '../screens/Components/Accordion';
import BottomSheet from '../screens/Components/BottomSheet';
import ModalBox from '../screens/Components/ModalBox';
import Buttons from '../screens/Components/Buttons';
import Badges from '../screens/Components/Badges';
import Charts from '../screens/Components/Charts';
import Headers from '../screens/Components/Headers';
import Footers from '../screens/Components/Footers';
import TabStyle1 from '../components/Footers/FooterStyle1';
import TabStyle2 from '../components/Footers/FooterStyle2';
import TabStyle3 from '../components/Footers/FooterStyle3';
import TabStyle4 from '../components/Footers/FooterStyle4';
import Inputs from '../screens/Components/Inputs';
import ListScreen from '../screens/Components/lists';
import Pricings from '../screens/Components/Pricings';
import DividerElements from '../screens/Components/DividerElements';
import Snackbars from '../screens/Components/Snackbars';
import Socials from '../screens/Components/Socials';
import SwipeableScreen from '../screens/Components/Swipeable';
import Tabs from '../screens/Components/Tabs';
import Tables from '../screens/Components/Tables';
import Toggles from '../screens/Components/Toggles';
import AddPayment from '../screens/Payment/AddPayment';
import MobileSignIn from '../screens/Auth/MobileSignIn';
import OtpVerify from '../screens/Auth/OtpVerify';
import UserKyc from '../screens/Profile/UserKyc';
import AddCustomer from '../screens/Customer/AddCustomer';
import CustomerTransations from '../screens/Customer/CustomerTransations';
import CustomerTransationsDetails from '../screens/Customer/CustomerTransactionDetail';
import CustomerScore from '../screens/Profile/CustomerScore';
import NotAvailable from '../screens/NotAvailable';
import EditUserPaymentDetail from '../screens/Payment/EditUserPaymentDetail';
import ShareApp from '../screens/ShareApp';
import FindUser from '../screens/Profile/FindUser';
import LedgerMain from '../screens/LedgerBook/LedgerMain';
import LedgerAddCustomer from '../screens/LedgerBook/LedgerAddCustomer';
import LedgerCustomerDetails from '../screens/LedgerBook/LedgerCustomerDetails';
import CustomerSupport from '../screens/Auth/CustomerSupport';
import TermsAndConditionsScreen from '../screens/TermAndConditions';


const Stack = createStackNavigator<RootStackParamList>();

const StackNavigator = () => {

	const theme = useTheme();

	return (
		<View style={{ width: '100%', flex: 1 }}>
			<Stack.Navigator
				initialRouteName='Onboarding'
				screenOptions={{
					headerShown: false,
					cardStyle: { backgroundColor: "transparent" },
					cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
				}}
			>
				<Stack.Screen name="Onboarding" component={Onboarding} />
				<Stack.Screen name="WelCome" component={WelCome} />
				<Stack.Screen name="SignUp" component={SignUp} />
				{/* <Stack.Screen name="SingIn" component={SingIn} /> */}
				<Stack.Screen name="MobileSignIn" component={MobileSignIn} />
				<Stack.Screen name="OtpVerify" component={OtpVerify} />
				<Stack.Screen name="ForgotPassword" component={ForgotPassword} />
				<Stack.Screen name="OTPAuthentication" component={OTPAuthentication} />
				<Stack.Screen name="NewPassword" component={NewPassword} />
				<Stack.Screen name="DrawerNavigation" component={DrawerNavigation} />
				<Stack.Screen name="BottomNavigation" component={BottomNavigation} />
				<Stack.Screen name="Notification" component={Notification} />
				<Stack.Screen name="Search" component={Search} />
				<Stack.Screen name="Products" component={Products} />
				<Stack.Screen name="ProductsDetails" component={ProductsDetails} />
				<Stack.Screen name="DeliveryAddress" component={DeliveryAddress} />
				<Stack.Screen name="AddDeliveryAddress" component={AddDeliveryAddress} />
				<Stack.Screen name="Payment" component={Payment} />
				<Stack.Screen name="AddPayment" component={AddPayment} />
				<Stack.Screen name="Addcard" component={Addcard} />
				<Stack.Screen name="Checkout" component={Checkout} />
				<Stack.Screen name="Myorder" component={Myorder} />
				<Stack.Screen name="Trackorder" component={Trackorder} />
				<Stack.Screen name="Writereview" component={Writereview} />
				<Stack.Screen name="Rewards" component={Rewards} />
				<Stack.Screen name="Demo" component={Demo} />
				<Stack.Screen name="Chat" component={Chat} />
				<Stack.Screen name="Singlechat" component={Singlechat} />
				<Stack.Screen name="Call" component={Call} />
				<Stack.Screen name="EditProfile" component={EditProfile} />
				<Stack.Screen name="UserKyc" component={UserKyc} />
				<Stack.Screen name="FindUser" component={FindUser} />
				<Stack.Screen name="AddCustomer" component={AddCustomer} />
				<Stack.Screen name="CustomerTransations" component={CustomerTransations} />
				<Stack.Screen name="CustomerScore" component={CustomerScore} />
				<Stack.Screen name="CustomerTransationsDetails" component={CustomerTransationsDetails} />
				<Stack.Screen name="NotAvailable" component={NotAvailable} />
				<Stack.Screen name="EditUserPaymentDetail" component={EditUserPaymentDetail} />
				<Stack.Screen name="Components" component={Components} />
				<Stack.Screen name="Accordion" component={AccordionScreen} />
				<Stack.Screen name="BottomSheet" component={BottomSheet} />
				<Stack.Screen name="ModalBox" component={ModalBox} />
				<Stack.Screen name="Buttons" component={Buttons} />
				<Stack.Screen name="Badges" component={Badges} />
				<Stack.Screen name="Charts" component={Charts} />
				<Stack.Screen name="Headers" component={Headers} />
				<Stack.Screen name="Footers" component={Footers} />
				<Stack.Screen name="TabStyle1" component={TabStyle1} />
				<Stack.Screen name="TabStyle2" component={TabStyle2} />
				<Stack.Screen name="TabStyle3" component={TabStyle3} />
				<Stack.Screen name="TabStyle4" component={TabStyle4} />
				<Stack.Screen name="Inputs" component={Inputs} />
				<Stack.Screen name="lists" component={ListScreen} />
				<Stack.Screen name="Pricings" component={Pricings} />
				<Stack.Screen name="DividerElements" component={DividerElements} />
				<Stack.Screen name="Snackbars" component={Snackbars} />
				<Stack.Screen name="Socials" component={Socials} />
				<Stack.Screen name="Swipeable" component={SwipeableScreen} />
				<Stack.Screen name="Tabs" component={Tabs} />
				<Stack.Screen name="Tables" component={Tables} />
				<Stack.Screen name="Toggles" component={Toggles} />
				<Stack.Screen name="ShareApp" component={ShareApp} />
				<Stack.Screen name="CustomerSupport" component={CustomerSupport} />

				<Stack.Screen name="TermsAndConditionsScreen" component={TermsAndConditionsScreen} />

				{/* ledger book logic */}
				<Stack.Screen name="LedgerMain" component={LedgerMain} />
				<Stack.Screen name="LedgerAddCustomer" component={LedgerAddCustomer} />
				<Stack.Screen name="LedgerCustomerDetails" component={LedgerCustomerDetails} />

			</Stack.Navigator>
		</View>
	)
}

export default StackNavigator;