import React, { Component } from 'react';
import {
    View,
    Image,
    Animated,
    Easing,
    Text,
    StyleProp,
    ViewStyle,
    ImageStyle,
    TextStyle,
    StyleSheet, Dimensions
} from 'react-native';


const { width: deviceWidth } = Dimensions.get('window');

interface Label {
    name: string;
    labelColor: string;
    activeBarColor: string;
}

interface ProfileScoreProps {
    value: number;
    defaultValue?: number;
    size?: number;
    minValue?: number;
    maxValue?: number;
    easeDuration?: number;
    allowedDecimals: number;
    labels: Label[];
    needleImage?: any;
    wrapperStyle?: StyleProp<ViewStyle>;
    outerCircleStyle?: StyleProp<ViewStyle>;
    halfCircleStyle?: StyleProp<ViewStyle>;
    imageWrapperStyle?: StyleProp<ViewStyle>;
    imageStyle?: StyleProp<ImageStyle>;
    innerCircleStyle?: StyleProp<ViewStyle>;
    labelWrapperStyle?: StyleProp<ViewStyle>;
    labelStyle?: StyleProp<TextStyle>;
    labelNoteStyle?: StyleProp<TextStyle>;
    useNativeDriver: boolean;
}

class ProfileScore extends Component<ProfileScoreProps> {



    static defaultProps = {
        defaultValue: 0,
        minValue: 0,
        maxValue: 900,
        easeDuration: 500,
        allowedDecimals: 0,
        labels: [
            {
                name: 'Poor',
                labelColor: '#ff2900',
                activeBarColor: '#ff2900',
            },
            {
                name: 'Fair',
                labelColor: '#ff5400',
                activeBarColor: '#ff5400',
            },
            {
                name: 'Good',
                labelColor: '#f4ab44',
                activeBarColor: '#f4ab44',
            },
            {
                name: 'Very Good',
                labelColor: '#f2cf1f',
                activeBarColor: '#f2cf1f',
            },
            {
                name: 'Excellent',
                labelColor: '#14eb6e',
                activeBarColor: '#14eb6e',
            },
        ],
        needleImage: require('../../assets/images/speedometer-needle.png'),
        wrapperStyle: {},
        outerCircleStyle: {},
        halfCircleStyle: {},
        imageWrapperStyle: {},
        imageStyle: {},
        innerCircleStyle: {},
        labelWrapperStyle: {},
        labelStyle: {},
        labelNoteStyle: {},
        useNativeDriver: true,
    };
    ProfileScoreValue: Animated.Value;

    constructor(props: ProfileScoreProps) {
        super(props);
        this.ProfileScoreValue = new Animated.Value(props.defaultValue ?? 50);
    }

    calculateDegreeFromLabels(degree: number, labels: Label[]): number {
        return degree / labels.length;
    }
    calculateLabelFromValue(value: number, labels: Label[], minValue: number, maxValue: number) {
        const currentValue = (value - minValue) / (maxValue - minValue);
        const currentIndex = Math.round((labels.length - 1) * currentValue);
        const label = labels[currentIndex];
        return label;
    }
    limitValue(
        value: number | string,
        minValue: number,
        maxValue: number,
        allowedDecimals: number
    ): number {
        let currentValue: number | string = 0;

        if (!isNaN(Number(value))) {
            if (!isNaN(allowedDecimals) && allowedDecimals > 0) {
                currentValue = parseFloat(value as string).toFixed(allowedDecimals < 4 ? Math.floor(allowedDecimals) : 4);
            } else {
                currentValue = parseInt(value as string, 10);
            }
        }

        return Math.min(Math.max(Number(currentValue), minValue), maxValue);
    }

    validateSize(current: number | string, original: number): number {
        let currentSize: number = original;

        if (!isNaN(Number(current))) {
            currentSize = parseInt(current as string, 10);
        }

        return currentSize;
    }

    render() {
        const {
            value,
            size,
            minValue,
            maxValue,
            easeDuration,
            allowedDecimals,
            labels,
            needleImage,
            wrapperStyle,
            outerCircleStyle,
            halfCircleStyle,
            imageWrapperStyle,
            imageStyle,
            innerCircleStyle,
            labelWrapperStyle,
            labelStyle,
            labelNoteStyle,
            useNativeDriver,
        } = this.props;
        const degree = 180;
        const perLevelDegree = this.calculateDegreeFromLabels(degree, labels);
        const label = this.calculateLabelFromValue(
            this.limitValue(value, Number(minValue), Number(maxValue), allowedDecimals), labels, Number(minValue), Number(maxValue),
        );
        // console.log('label', label)
        Animated.timing(this.ProfileScoreValue, {
            toValue: this.limitValue(value, Number(minValue), Number(maxValue), allowedDecimals),
            duration: easeDuration,
            easing: Easing.linear,
            useNativeDriver,
        }).start();
        const rotate = this.ProfileScoreValue.interpolate({
            inputRange: [Number(minValue), Number(maxValue)],
            outputRange: ['-90deg', '90deg'],
        });

        const currentSize = this.validateSize(size ?? 200, deviceWidth - 20);



        return (
            <View
                style={[
                    style.wrapper,
                    {
                        width: currentSize,
                        height: currentSize / 2,
                    },
                    wrapperStyle,
                ]}
            >
                <View
                    style={[
                        style.outerCircle,
                        {
                            width: currentSize,
                            height: currentSize / 2,
                            borderTopLeftRadius: currentSize / 2,
                            borderTopRightRadius: currentSize / 2,
                        },
                        outerCircleStyle,
                    ]}
                >
                    {labels?.map((level, index) => {

                        const circleDegree = 90 + index * perLevelDegree;
                        return (
                            <View
                                key={level.name}
                                style={[
                                    style.halfCircle,
                                    {
                                        backgroundColor: level.activeBarColor,
                                        width: currentSize / 2,
                                        height: currentSize,
                                        borderRadius: currentSize / 2,
                                        transform: [
                                            { translateX: currentSize / 4 },
                                            { rotate: `${circleDegree}deg` },
                                            { translateX: -(currentSize / 4) },
                                        ],
                                    },
                                    halfCircleStyle,
                                ]}
                            />
                        );
                    })}
                    <Animated.View
                        style={[
                            style.imageWrapper,
                            {
                                top: -(currentSize / 15),
                                transform: [{ rotate }],
                            },
                            imageWrapperStyle,
                        ]}
                    >
                        <Image
                            style={[
                                style.image,
                                {
                                    width: currentSize,
                                    height: currentSize,
                                },
                                imageStyle,
                            ]}
                            source={needleImage}
                        />
                    </Animated.View>
                    <View
                        style={[
                            style.innerCircle,
                            {
                                width: currentSize * 0.9,
                                height: (currentSize / 2) * 0.9,
                                borderTopLeftRadius: currentSize / 2,
                                borderTopRightRadius: currentSize / 2,
                            },
                            innerCircleStyle,
                        ]}
                    />
                </View>
                <View style={[style.labelWrapper, labelWrapperStyle]}>
                    <Text style={[style.label, labelStyle]}>
                        {this.limitValue(value, Number(minValue), Number(maxValue), allowedDecimals)}
                    </Text>
                    <Text style={[style.labelNote, { color: label.labelColor }, labelNoteStyle]}>
                        {label.name}
                    </Text>
                </View>
            </View>
        );
    }
}

// Define custom AnimatedCircle to work with Animated API
//const AnimatedCircle = Animated.createAnimatedComponent();

// Styles
const style = StyleSheet.create({
    wrapper: {
        marginVertical: 5,
        alignSelf: 'center',
    },
    // Circular Container
    circleWrapper: {
        overflow: 'hidden',
    },
    outerCircle: {
        justifyContent: 'flex-end',
        alignItems: 'center',
        overflow: 'hidden',
        borderColor: '#ffffff',
        backgroundColor: '#e6e6e6',
    },
    halfCircle: {
        position: 'absolute',
        top: 0,
        left: 0,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
    },
    imageWrapper: {
        position: 'absolute',
        left: 0,
        zIndex: 10,
    },
    image: {
        resizeMode: 'stretch',
        height: deviceWidth - 20,
        width: deviceWidth - 20,
    },
    innerCircle: {
        overflow: 'hidden',
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: deviceWidth * 0.6,
        height: (deviceWidth / 2) * 0.6,
        borderTopLeftRadius: deviceWidth / 2 - 10,
        borderTopRightRadius: deviceWidth / 2 - 10,
    },
    labelWrapper: {
        marginVertical: 5,
        alignItems: 'center',
    },
    label: {
        fontSize: 25,
        fontWeight: 'bold',
    },
    labelNote: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ProfileScore;
