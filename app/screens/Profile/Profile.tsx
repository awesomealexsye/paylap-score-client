import { useTheme } from '@react-navigation/native';
import React, { useEffect } from 'react'
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native'
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { IMAGES } from '../../constants/Images';
import { COLORS, FONTS } from '../../constants/theme';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import Header from '../../layout/Header';
import axios from 'axios';


type ProfileScreenProps = StackScreenProps<RootStackParamList, 'Profile'>;

const Profile = ({ navigation }: ProfileScreenProps) => {

    const [profile, setProfile] = React.useState<any>({});

    useEffect(() => {
        const fetchProfileData = async () => {
            try {

                const response = await axios.post('https://paylapscore.com/api/user/info', {
                    user_id: '1',
                    auth_key: 'OTYyNTQ0MjcyNTY2ZGRjOTgxZWFkMzU='
                }, {
                    headers: {
                        'Authorization': 'Bearer 2|PpJsg67XPa75M1J8kZNXi15rAryDT91le76vWoZAeaa3a7b9'
                    }
                });
                const profile = response.data;

                console.log("profile:", profile);
                setProfile(profile)
                // Do something with the profile data
            } catch (error) {
                console.error(error);
            }
        };
        fetchProfileData();
    }, []);


    const theme = useTheme();
    const { colors }: { colors: any } = theme;
    return (
        <View style={{ backgroundColor: colors.card, flex: 1 }}>
            <Header
                title='Profile'
                leftIcon={'back'}
                rightIcon2={'Edit'}
            />
            <ScrollView showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingBottom: 50 }}>
                <View style={[GlobalStyleSheet.container, { alignItems: 'center', marginTop: 50, padding: 0 }]}>
                    <View
                        style={[styles.sectionimg]}
                    >
                        <Image
                            style={{ height: 104, width: 104, }}
                            source={{uri:profile?.data?.profile_image}}
                        />
                    </View>
                    <Text style={{ ...FONTS.fontSemiBold, fontSize: 28, color: colors.title }}>{profile?.data?.name}</Text>
                    {/* <Text style={{ ...FONTS.fontRegular, fontSize: 16, color: COLORS.primary }}>London, England</Text> */}
                </View>
                <View
                    style={[GlobalStyleSheet.container, { paddingHorizontal: 40, marginTop: 20 }]}
                >
                    <View>

                        <View style={[GlobalStyleSheet.flexcenter, { width: '100%', gap: 20, justifyContent: 'flex-start', marginBottom: 25, alignItems: 'flex-start' }]} >
                            <View style={[styles.cardimg, { backgroundColor: colors.card }]} >
                                <Image
                                    style={[GlobalStyleSheet.image3, { tintColor: COLORS.primary }]}
                                    source={IMAGES.call}
                                />
                            </View>
                            <View>
                                <Text style={[styles.brandsubtitle2, { color: '#7D7D7D' }]}>Mobile Number</Text>
                                <Text style={{ ...FONTS.fontMedium, fontSize: 16, color: colors.title, marginTop: 5 }}>{profile?.data?.mobile}</Text>
                            </View>
                        </View>
                        <View style={[GlobalStyleSheet.flexcenter, { width: '100%', gap: 20, justifyContent: 'flex-start', marginBottom: 25, alignItems: 'flex-start' }]} >
                            <View style={[styles.cardimg, { backgroundColor: colors.card }]} >
                                <Image
                                    style={[GlobalStyleSheet.image3, { tintColor: COLORS.primary }]}
                                    source={IMAGES.email}
                                />
                            </View>
                            <View>
                                <Text style={[styles.brandsubtitle2, { color: '#7D7D7D' }]}>Email Address</Text>
                                <Text style={{ ...FONTS.fontMedium, fontSize: 16, color: colors.title, marginTop: 5 }}>{profile?.data?.email}</Text>
                            </View>
                        </View>

                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    arrivaldata: {
        backgroundColor: COLORS.card,
        borderRadius: 20,
        //width:'100%',
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: '#EFEFEF',
    },
    sectionimg: {
        height: 104,
        width: 104,
        borderRadius: 150,
        backgroundColor: COLORS.primary,
        overflow: 'hidden',
        marginBottom: 25
    },
    brandsubtitle2: {
        ...FONTS.fontRegular,
        fontSize: 12
    },
    brandsubtitle3: {
        ...FONTS.fontMedium,
        fontSize: 12,
        color: COLORS.title
    },
    profilecard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
        marginRight: 10,
        marginBottom: 20
    },
    cardimg: {
        height: 54,
        width: 54,
        borderRadius: 55,
        backgroundColor: COLORS.card,
        shadowColor: "rgba(0,0,0,0.5)",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.34,
        shadowRadius: 18.27,
        elevation: 10,
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default Profile