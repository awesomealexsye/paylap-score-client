import { useTheme } from "@react-navigation/native";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";

type props = {
    label: string,
    selected: boolean,
    onPress: () => void
}

const RadioButton = ({ label, selected, onPress }: props) => {
    const theme = useTheme();
    const { colors }: { colors: any; } = theme;
    return (
        <TouchableOpacity style={styles.radioButtonContainer} onPress={onPress}>
            <View style={[{ ...styles.radioButton, borderColor: colors.text }, selected && { backgroundColor: colors.text }]} />
            <Text style={{ ...styles.radioButtonLabel, color: colors.text }}>{label}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    radioButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    radioButton: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 2,
        marginRight: 10,
    },
    radioButtonLabel: {
        fontSize: 16,
    },
});

export default RadioButton;