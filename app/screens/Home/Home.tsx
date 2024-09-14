import React, { useRef, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, TextInput, StyleSheet , SafeAreaView ,FlatList} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { IMAGES } from '../../constants/Images';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { Feather } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import { addTowishList } from '../../redux/reducer/wishListReducer';
import { openDrawer } from '../../redux/actions/drawerAction';
import { Colors } from 'react-native/Libraries/NewAppScreen';







interface Customer {
    id: string;
    name: string;
    amount: string;
    lastInteraction: string;
    type: string;
  }
  
const customersData: Customer[] = [
    { id: '1', name: 'Anup Gujjar', amount: '₹ 71,600', lastInteraction: '1 week ago',type:"Debit" },
    { id: '2', name: 'Mukeem Bhaiya', amount: '₹ 10,000', lastInteraction: '2 weeks ago', type: "Credit" },
    { id: '3', name: 'Vakil Home', amount: '₹ 400', lastInteraction: '3 weeks ago', type: "Credit" },
    { id: '4', name: 'Ajay College', amount: '₹ 0', lastInteraction: '1 month ago', type: "Credit" },
    { id: '5', name: 'Rashik Khan Parvana', amount: '₹0', lastInteraction: '1 month ago', type: "Credit" },
    { id: '6', name: 'Sunil Sir', amount: '₹ 6', lastInteraction: '1 month ago', type: "Credit" },
    { id: '7', name: 'Talib Khan', amount: '₹ 3,000', lastInteraction: '1 month ago', type: "Credit" },
  ];




type HomeScreenProps = StackScreenProps<RootStackParamList, 'Home'>

export const Home = ({ navigation }: HomeScreenProps) => {

       const [searchText, setSearchText] = useState('');
    const [filteredCustomers, setFilteredCustomers] = useState(customersData);
  
    const handleSearch = (text: string) => {
      setSearchText(text);
      const filteredList = customersData.filter(customer =>
        customer.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredCustomers(filteredList);
    };

    // const wishList = useSelector((state:any) => state.wishList.wishList);
    // console.log(wishList);

    const dispatch = useDispatch();

    const theme = useTheme();
    const { colors }: { colors: any; } = theme;
    

    const addItemToWishList = (data: any) => {
        dispatch(addTowishList(data));
    }


    const renderCustomer = ({ item }: { item: Customer }) => (
        <View style={[styles.customerItem, {backgroundColor: colors.card}]}>
          <View style={{}}>
            <View style={{flexDirection:'row'}}>
                <Image
                        style={{height:50,width:50,borderRadius:50}}
                        source={IMAGES.small6}
                    />
                    <View style={{marginLeft:14}}>
                        <Text style={[styles.customerName, { color: colors.title, ...FONTS.fontSemiBold }]}>{item.name}</Text>
                        <Text style={styles.lastInteraction}>{item.lastInteraction}</Text>
                    </View>
                   
            </View>
           
          </View>

          <View style={{flexDirection:"column", alignItems:"center" ,position:"relative"}}> 
                <Text style={item.type === 'Credit' ? { color: "green", fontSize: 18, fontWeight: "900" } : {fontSize:18,fontWeight:"900",color:"red"}}>{item.amount}</Text>
                <Text style={[styles.type,{color:colors.title}]}>{item.type}</Text>
          </View>
          
        </View>
      );
    
    return (
        <View style={{ backgroundColor: colors.card, flex: 1 }}>
            {/* AppBar Start */}
            <View style={{}}>
                {/* Name in Header */}
                
                <View style={[GlobalStyleSheet.container, { paddingHorizontal: 30,padding:0,paddingTop:30 }]}>
                    <View style={[GlobalStyleSheet.flex]}>
                        <View>
                            <Text style={{ ...FONTS.fontRegular, fontSize: 14, color: colors.title }}>Good Morning</Text>
                            <Text style={{ ...FONTS.fontSemiBold, fontSize: 24, color: colors.title }}>Williams</Text>
                        </View>
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('Notification')}
                                activeOpacity={0.5}
                                style={[GlobalStyleSheet.background3, {}]}
                            >
                                <Image
                                   style={[GlobalStyleSheet.image3,{tintColor:theme.dark ? COLORS.card : '#5F5F5F'}]}
                                    source={IMAGES.Notification} 
                                />
                                <View 
                                    style={[styles.notifactioncricle,{
                                        backgroundColor:colors.card,
                                    }]}
                                >
                                    <View
                                        style={{
                                            height:13,
                                            width:13,
                                            borderRadius:13,
                                            backgroundColor: colors.primary
                                        }}
                                    />
                                </View>
                            </TouchableOpacity>

                            {/* /ssafsf
                            
                            
                            */}
                            <TouchableOpacity
                                activeOpacity={0.5}
                                //onPress={() => navigation.openDrawer()}
                                onPress={() => dispatch(openDrawer())}
                                style={[GlobalStyleSheet.background3, {}]}
                            >
                                <Image
                                    style={[GlobalStyleSheet.image3,{tintColor:theme.dark ? COLORS.card : '#5F5F5F'}]}
                                    source={IMAGES.grid6} 
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>


             {/* AppBar End */}


            <ScrollView showsVerticalScrollIndicator={false}>


            <View style={{flex:1,alignItems:'center'}} >
            <View style={{
                  height: 140, 
                  width: 400, 
                  top:20,
                  backgroundColor: COLORS.primary, 
                  borderRadius: 31,
                  shadowColor: "#025135",
                  shadowOffset: {
                      width: 0,
                      height: 15,
                  },
                  shadowOpacity: 0.34,
                  shadowRadius: 31.27,
                  elevation: 8, flexDirection :'column'}}>
                

        <View style={{width:400, flexDirection:'row', marginTop:22, rowGap:4,justifyContent:'center',borderBlockColor:colors.dark,borderBottomWidth:1 ,padding:10}}>
            <View style={{flex:1, alignItems:'center',justifyContent:'center', borderRightWidth:1,borderRightColor:colors.dark}}>
          <Text style={{ ...FONTS.fontBold, fontSize: SIZES.h6, color: COLORS.primaryLight }}>Credit Amt.</Text>
          <Text style={{ ...FONTS.fontRegular, fontSize: SIZES.h3, color: COLORS.secondary }}>₹0</Text>
        </View>
        <View style={{flex:1, alignItems:'center',justifyContent:"center"}}>
          <Text style={{ ...FONTS.fontBold, fontSize:SIZES.h6, color: COLORS.primaryLight }}>Debit Amt.</Text>
          <Text style={{ ...FONTS.fontRegular, fontSize:SIZES.h3, color: COLORS.danger }}>₹1,43,186</Text>
        </View>
        </View>
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: "center" }}>
                            <TouchableOpacity style={{}}>
                                <Text style={{color:colors.title,...FONTS.fontBold,}}>
                                    VIEW REPORT
                                    <Feather name='arrow-right' size={16} color={colors.title} />
                                </Text>
                            </TouchableOpacity>

                        </View>
      </View>
      </View>
      

                {/* search Box Start */}

                <View style={[GlobalStyleSheet.container,{padding:0,paddingHorizontal:30,paddingTop:35}]}>
                    <View>
                        <TextInput
                            placeholder='Search Customer'
                            style={[styles.TextInput, { color: colors.title,backgroundColor:colors.card ,...FONTS.fontSemiBold}]}
                            placeholderTextColor={'#929292'}
                        value={searchText}
                        onChangeText={handleSearch} />
                        <View style={{ position: 'absolute', top: 15, right: 20 }}>
                            <Feather name='search' size={24} color={'#C9C9C9'} />
                        </View>
                    </View>
                </View>

                {/* Search box ends */}

              
                <FlatList scrollEnabled={false}
                    data={filteredCustomers}
        renderItem={renderCustomer}
        keyExtractor={(item) => item.id}
                    contentContainerStyle={{}}


      
      />
              



                {/* <View style={{alignItems:'center'}}>
                    <View style={[GlobalStyleSheet.container,{padding:0,}]}>
                        <ImageSwiper
                            data={SwiperData}
                        />
                    </View>
                </View>
                <View style={[GlobalStyleSheet.container,{paddingHorizontal:0,paddingTop:0}]}>
                    <View style={[GlobalStyleSheet.flex,{paddingHorizontal:30}]}>
                        <Text style={[styles.brandsubtitle3,{fontSize: 18,color:colors.title}]}>Categories</Text>
                    </View>
                    <View style={{ marginHorizontal: -15, paddingHorizontal: 15, paddingTop: 25 }}>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingHorizontal: 30 }}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15, marginRight: 10,marginBottom:20 }}>
                                {ArrivalData.map((data: any, index) => {
                                    return (
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            onPress={() => {navigation.navigate('Products'); }}
                                            key={index}
                                            style={[styles.arrivaldata,{
                                                backgroundColor:theme.dark ? colors.background :colors.card,
                                                borderColor:'#EFEFEF',
                                                shadowColor: "rgba(4,118,78,.6)",
                                            }]}>
                                            <View style={[GlobalStyleSheet.flexcenter,{gap:20,justifyContent:'flex-start'}]}>
                                                <Image
                                                    style={[GlobalStyleSheet.image3]}
                                                    source={data.image}
                                                />
                                                <View>
                                                    <Text style={{ ...FONTS.fontMedium, fontSize: 16, color:  colors.title }}>{data.title}</Text>
                                                    <Text style={{ ...FONTS.fontRegular, fontSize: 14, color:COLORS.primary }}>{data.subtitle}</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </ScrollView>
                    </View>
                </View>



                <View style={[GlobalStyleSheet.container, { paddingHorizontal: 0, paddingTop: 0, paddingBottom: 10 }]}>
                    <View style={[GlobalStyleSheet.flex, { paddingHorizontal: 30 }]}>
                        <Text style={[styles.brandsubtitle3, { fontSize: 18, color: colors.title }]}>Featured Beverages</Text>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Products')}
                        >
                            <Text style={[styles.brandsubtitle3, { fontSize: 16, color:COLORS.primary }]}>More</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={[GlobalStyleSheet.container,{paddingHorizontal:30}]}>
                    {CardStyleData.map((data:any, index:any) => {
                        return (
                            <View key={index} style={{marginBottom:40}}>
                                <Cardstyle4
                                    id={data.id}
                                    image={data.image}
                                    price={data.price}
                                    countnumber={data.countnumber} 
                                    title={data.title}
                                    onPress={() => navigation.navigate('ProductsDetails')}                                        
                                    onPress5={() => addItemToWishList(data)}                                
                                />
                            </View>
                        );
                    })}
                </View> */}
            </ScrollView>
            <TouchableOpacity style={styles.addButton}>
                <Text style={styles.addButtonText}>
                    <Feather name='user-plus' size={18} color={'#C9C9C9'} />
                     Add Customer</Text>
            </TouchableOpacity> 
        </View>
    );
};

const styles = StyleSheet.create({

    notifactioncricle:{
        height:16,
        width:16,
        borderRadius:16,
        backgroundColor:COLORS.card,
        alignItems:'center',
        justifyContent:'center',
        position:'absolute',
        top:2,
        right:2
    },
    // flex:{
    //     flexDirection:'row',
    //     alignItems:'flex-start',
    //     justifyContent:'center'
    // },
    TextInput:{
        ...FONTS.fontRegular,
        fontSize:16,
         color:COLORS.title,
        height:60,
        borderRadius:61,
         paddingHorizontal:20,
        paddingLeft:30,
        borderWidth:1,
        //  borderColor:'#EBEBEB',
        backgroundColor:'#FAFAFA',
        marginBottom:10
       
    },
    brandsubtitle2:{
        ...FONTS.fontSemiBold,
        fontSize:12,
        color:COLORS.card
    },
    brandsubtitle3:{
        ...FONTS.fontMedium,
        fontSize:12,
        color:COLORS.title
    },
    // title1:{
    //     ...FONTS.fontBold,
    //     fontSize:28,
    //     color:COLORS.title,
    // },
    // title2:{
    //     ...FONTS.fontRegular,
    //     fontSize:12,
    //     color:COLORS.title,
    // },
    // title3:{
    //     ...FONTS.fontSemiBold,
    //     fontSize:24,
    //     color:'#8ABE12',
    //     //textAlign:'right'
    // },
    // colorCard:{
        
    // },
    // colorCardTitle:{
    //     ...FONTS.fontMedium,
    //     fontSize:12,
    //     color:COLORS.title,
    //     lineHeight:20,
    //     textAlign:'center'
    // },
    // arrivaldata:{
    //     backgroundColor:COLORS.card,
    //     borderRadius: 18,
    //     width:199,
    //     paddingHorizontal: 10,
    //     paddingLeft:25,
    //     paddingVertical: 15,
    //     borderWidth:1,
    //     borderColor:'#EFEFEF',
    //     shadowColor: "rgba(4,118,78,.6)",
    //     shadowOffset: {
    //         width: 0,
    //         height: 4,
    //     },
    //     shadowOpacity: 0.34,
    //     shadowRadius: 18.27,
    //     elevation: 4, 
    // },

    customerList: {
          marginBottom: 100, // Leave space for the floating button
        },


        customerItem: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 15,
        
            backgroundColor: Colors.white,
            borderRadius: 18,
            shadowColor: "#025135",
            shadowOffset: {
                width: 0,
                height: 15,
            },
            shadowOpacity: 0.34,
            shadowRadius: 31.27,
            marginHorizontal:10,
            marginVertical:4,
            elevation: 4, 
            top:4
        },
        customerName: {
          color: COLORS.title,
          fontSize: 18,
        },
        lastInteraction: {
          color: '#888',
          fontSize: 14,
        },
    type: {
        color: COLORS.title,
        fontSize: 14,
        ...FONTS.fontMedium,
           
        
    },
        amount: {
          color: 'red',
          fontSize: 18,
          textAlign:"center"
        },
        amountZero: {
          color: '#121221',
          fontSize: 18,
        },







    addButton: {
          position: 'absolute', // Fixes the button at a particular position
          bottom: 35, // 30px from the bottom
          right: 20, // 20px from the right
          backgroundColor: COLORS.primary, // Matches the button's background color from CSS
          padding: 15, // 15px padding around the button content
          borderRadius: 50 , // Circular button
          alignItems: 'center',
          justifyContent: 'center',
          elevation: 5,  // Shadow for Android
          shadowColor: '#000',  // Shadow for iOS
          shadowOffset: { width: 0, height: 4 },  // Shadow offset for iOS
          shadowOpacity: 0.2,  // Shadow opacity for iOS
          shadowRadius: 8,
          // Shadow blur radius for iOS
        
        },
        addButtonText: {
          color: COLORS.white,
          fontSize: 16,
          fontWeight: 'bold',
        },
})

export default Home;


// interface Customer {
//     id: string;
//     name: string;
//     amount: string;
//     lastInteraction: string;
//   }
  
//   const customersData: Customer[] = [
//     { id: '1', name: 'Anup Gujjar', amount: '₹71,600', lastInteraction: '1 week ago' },
//     { id: '2', name: 'Mukeem Bhaiya', amount: '₹10,000', lastInteraction: '2 weeks ago' },
//     { id: '3', name: 'Vakil Home', amount: '₹400', lastInteraction: '3 weeks ago' },
//     { id: '4', name: 'Ajay College', amount: '₹0', lastInteraction: '1 month ago' },
//     { id: '5', name: 'Rashik Khan Parvana', amount: '₹0', lastInteraction: '1 month ago' },
//     { id: '6', name: 'Sunil Sir', amount: '₹6', lastInteraction: '1 month ago' },
//     { id: '7', name: 'Talib Khan', amount: '₹3,000', lastInteraction: '1 month ago' },
//   ];
  
//   const Home = () => {
//     const [searchText, setSearchText] = useState('');
//     const [filteredCustomers, setFilteredCustomers] = useState(customersData);
  
//     const handleSearch = (text: string) => {
//       setSearchText(text);
//       const filteredList = customersData.filter(customer =>
//         customer.name.toLowerCase().includes(text.toLowerCase())
//       );
//       setFilteredCustomers(filteredList);
//     };
  
//     const renderCustomer = ({ item }: { item: Customer }) => (
//       <View style={styles.customerItem}>
//         <View>
//           <Text style={styles.customerName}>{item.name}</Text>
//           <Text style={styles.lastInteraction}>{item.lastInteraction}</Text>
//         </View>
//         <Text style={item.amount === '₹0' ? styles.amountZero : styles.amount}>{item.amount}</Text>
//       </View>
//     );
  
//     return (
//       <SafeAreaView style={styles.container}>
//         {/* Header */}
//         <View style={styles.header}>
//           <Text style={styles.title}>Arbazkhan</Text>
//         </View>
  
//         {/* Balance Section */}
//         <View style={styles.balanceContainer}>
//           <View style={styles.balanceBox}>
//             <Text style={styles.balanceLabel}>You will give</Text>
//             <Text style={styles.balanceAmount}>₹0</Text>
//           </View>
//           <View style={styles.balanceBox}>
//             <Text style={styles.balanceLabel}>You will get</Text>
//             <Text style={styles.balanceAmount}>₹1,43,186</Text>
//           </View>
//         </View>
  
//         {/* Search Bar */}
//         <TextInput
//           style={styles.searchBox}
//           placeholder="Search Customer"
//           placeholderTextColor="#888"
//           value={searchText}
//           onChangeText={handleSearch}
//         />
  
//         {/* Customer List */}
//         <FlatList
//           data={filteredCustomers}
//           renderItem={renderCustomer}
//           keyExtractor={(item) => item.id}
//           contentContainerStyle={styles.customerList}
//         />
  
//         {/* Add Customer Button */}
//         <TouchableOpacity style={styles.addButton}>
//           <Text style={styles.addButtonText}>+ Add Customer</Text>
//         </TouchableOpacity>
//       </SafeAreaView>
//     );
//   };

  
//   const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       backgroundColor: '#000',
//       paddingHorizontal: 20,
//     },
//     header: {
//       padding: 20,
//       alignItems: 'center',
//     },
//     title: {
//       color: '#fff',
//       fontSize: 22,
//       fontWeight: 'bold',
//     },
//     balanceContainer: {
//       flexDirection: 'row',
//       justifyContent: 'space-between',
//       paddingVertical: 10,
//     },
//     balanceBox: {
//       alignItems: 'center',
//     },
//     balanceLabel: {
//       color: '#fff',
//       fontSize: 16,
//     },
//     balanceAmount: {
//       color: 'red',
//       fontSize: 20,
//       fontWeight: 'bold',
//     },
//     searchBox: {
//       backgroundColor: '#1a1a1a', // Matches the background color in your CSS
//       borderRadius: 8,
//       paddingHorizontal: 15,
//       paddingVertical: 10,
//       color: '#fff', // Text color white
//       marginVertical: 10,
//       width: '100%', // Takes full width like the CSS box model
//     },
//     customerList: {
//       marginBottom: 100, // Leave space for the floating button
//     },
//     customerItem: {
//       flexDirection: 'row',
//       justifyContent: 'space-between',
//       paddingVertical: 15,
//       borderBottomWidth: 1,
//       borderBottomColor: '#333',
//     },
//     customerName: {
//       color: '#fff',
//       fontSize: 18,
//     },
//     lastInteraction: {
//       color: '#888',
//       fontSize: 14,
//     },
//     amount: {
//       color: 'red',
//       fontSize: 18,
//     },
//     amountZero: {
//       color: '#fff',
//       fontSize: 18,
//     },
//     addButton: {
//       position: 'absolute', // Fixes the button at a particular position
//       bottom: 30, // 30px from the bottom
//       right: 20, // 20px from the right
//       backgroundColor: '#e91e63', // Matches the button's background color from CSS
//       padding: 15, // 15px padding around the button content
//       borderRadius: 50, // Circular button
//       alignItems: 'center',
//       justifyContent: 'center',
//       elevation: 5,  // Shadow for Android
//       shadowColor: '#000',  // Shadow for iOS
//       shadowOffset: { width: 0, height: 4 },  // Shadow offset for iOS
//       shadowOpacity: 0.2,  // Shadow opacity for iOS
//       shadowRadius: 8,  // Shadow blur radius for iOS
//     },
//     addButtonText: {
//       color: '#fff',
//       fontSize: 16,
//       fontWeight: 'bold',
//     },
//   });

// export default Home;
