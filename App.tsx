import 'react-native-gesture-handler';
import Route from './app/navigation/Route';
import { useFonts } from 'expo-font';
import { useTheme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Provider } from 'react-redux'
import store from './app/redux/store';
import CommonService from './app/lib/CommonService';
import Toast from 'react-native-toast-message';
import './i18n';
// import { useEffect } from 'react';
// import { Linking } from 'react-native';
// import StorageService from './app/lib/StorageService';
export default function App() {


  const theme = useTheme();
  const { colors }: { colors: any } = theme;

  // useEffect(() => {
  //   const handleDeepLink = async () => {
  //     const initialUrl = await Linking.getInitialURL();
  //     if (initialUrl) {
  //       const urlParams = new URL(initialUrl);
  //       const referralCode = urlParams.searchParams.get("referralCode");
  //       // const referralCode = "PAYLAP00125"
  //       if (referralCode) {
  //         // console.log("App Referral Code:", referralCode);
  //         // StorageService.removeAllStorageValue([referralCode]);
  //         StorageService.setStorage('referralCode', referralCode);
  //         // Save or use the referral code as needed
  //       }
  //     }
  //   };

  //   handleDeepLink();
  // }, []);

  const [loaded] = useFonts({
    PoppinsBold: require('./app/assets/fonts/Poppins-Bold.ttf'),
    PoppinsSemiBold: require('./app/assets/fonts/Poppins-SemiBold.ttf'),
    PoppinsLight: require('./app/assets/fonts/Poppins-Light.ttf'),
    PoppinsMedium: require('./app/assets/fonts/Poppins-Medium.ttf'),
    PoppinsRegular: require('./app/assets/fonts/Poppins-Regular.ttf'),
    PoppinsExtraLight: require('./app/assets/fonts/Poppins-ExtraLight.ttf'),
  });

  if (!loaded) {
    return null;
  }
  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{
          flex: 1,
          // paddingTop: Platform.OS === 'android' ? 25 : 0,
          // backgroundColor:COLORS.primary ,
        }}>
        <StatusBar style="dark" />
        <Provider store={store}>
          <Route />
          <Toast />
        </Provider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
