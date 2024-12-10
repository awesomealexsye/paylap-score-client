import React, { useEffect, useRef, useState } from 'react';
import { View, Image, useWindowDimensions, TouchableOpacity, Text, ScrollView, StyleSheet } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { COLORS, FONTS } from '../constants/theme';
import { useNavigation, useTheme } from '@react-navigation/native';
import CONFIG from '../constants/config';

const ImageSwiper = ({ data }: any) => {

  const theme = useTheme();
  const { colors }: { colors: any; } = theme;



  const [newData] = useState(
    [
      // { key: 'space-left' },
      ...data,
      // { key: 'space-right' },
    ]
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const { width } = useWindowDimensions();
  const SIZE = width * 1;
  const SPACER = (width - SIZE) / 2;
  const x = useSharedValue(0);

  const scrollRef = useRef<Animated.ScrollView>(null);  // Create a reference for ScrollView with proper typing
  let scrollPosition = 0;

  useEffect(() => {
    const interval = setInterval(() => {
      scrollPosition += SIZE;
      if (scrollPosition >= SIZE * (newData.length - 2)) {
        scrollPosition = 0; // Reset scroll position for looping
      }
      // Scroll to the calculated position
      scrollRef.current?.scrollTo({ x: scrollPosition, animated: true });
      setActiveIndex((prev) => (prev + 1) % (newData.length - 2));  // Update active index
    }, 3000); // 3 seconds interval for auto-scroll

    // Clear interval on component unmount to prevent memory leaks
    return () => clearInterval(interval);
  }, [newData.length]);


  const onScroll = (event: { nativeEvent: { contentOffset: { x: number; }; }; }) => {
    x.value = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(event.nativeEvent.contentOffset.x / SIZE);
    if (currentIndex !== activeIndex) setActiveIndex(currentIndex);
  };

  const navigation = useNavigation<any>();

  return (
    <View >
      <Animated.ScrollView
        horizontal
        ref={scrollRef}
        showsHorizontalScrollIndicator={false}
        bounces={true}
        scrollEventThrottle={16}
        snapToInterval={SIZE}
        decelerationRate="fast"
        onScroll={onScroll}
        contentContainerStyle={{
          paddingTop: 40,
        }}
      >
        {newData.map((item: any, index: number) => {

          const style = useAnimatedStyle(() => {
            const scale = interpolate(
              x.value,
              [(index - 2) * SIZE, (index - 1) * SIZE, index * SIZE],
              [0.8, 1, 0.8]
            );
            return {
              transform: [
                { scale },
              ],
            };
          });

          // if (!item.image) {
          //   return <View style={{ width: SPACER }} key={index} />;
          // }

          return (
            <View key={index} style={{ width: SIZE, }}>
              <Animated.View style={[style]}>
                <TouchableOpacity
                  activeOpacity={.9}
                  onPress={() => { console.log(CONFIG.APP_URL + "/uploads/banner/" + item.image) }}
                  style={{
                    height: 150,
                    width: "100%",
                    shadowColor: "#025135",
                    shadowOffset: {
                      width: 0,
                      height: 15,
                    },
                    shadowOpacity: 0.34,
                    shadowRadius: 31.27,
                    elevation: 8,
                    justifyContent: "center",
                    alignItems: "center",

                  }}
                >
                  <View style={{ alignItems: 'center', height: 150, width: "100%", }}>
                    <Image
                      style={{ height: 150, width: "100%", resizeMode: 'cover', marginVertical: -20, borderRadius: 10, backgroundColor: colors.card }}
                      source={{ uri: item.image }}
                    />
                  </View>
                  {/* <View style={{ paddingHorizontal: 25 }}>
                  <Text style={{ ...FONTS.fontSemiBold, fontSize: 16, color: COLORS.card, }}>{item.title}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 5, marginTop: 10 }}>
                    <Text style={{ ...FONTS.fontSemiBold, fontSize: 14, color: COLORS.card, }}>$</Text>
                    <Text style={{ ...FONTS.fontSemiBold, fontSize: 24, color: COLORS.card, lineHeight: 32 }}>{item.price}</Text>
                    <Text style={{ ...FONTS.fontMedium, fontSize: 16, color: '#6CAE97', textDecorationLine: 'line-through' }}>{item.discount}</Text>
                  </View>
                </View> */}
                </TouchableOpacity>
              </Animated.View>

            </View>

          );
        })}
      </Animated.ScrollView>
      <View style={styles.indicatorContainer}>
        {newData.slice(1, -1).map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === activeIndex ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
    </View >


  );
};
const styles = StyleSheet.create({
  imageContainer: {
    height: 90,
    width: "100%",
    borderRadius: 15,
    shadowColor: "#025135",
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.34,
    shadowRadius: 31.27,
    elevation: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  imageWrapper: {
    alignItems: 'center',
    height: 100,
    width: "100%",
  },
  image: {
    height: 100,
    width: "100%",
    resizeMode: 'cover',
    marginTop: -40,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    width: '100%',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: COLORS.primary,
    width: 10,
    height: 10,
  },
  inactiveDot: {
    backgroundColor: COLORS.secondary,
  },
});


export default ImageSwiper;
