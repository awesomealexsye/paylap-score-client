import { View, Text } from "react-native";
import RadioButton from "../../screens/Components/RadioButton";
import { useState } from "react";
import { useTheme } from "@react-navigation/native";

type ReportFilterOptionSheetProps = {
    handleSelectedValue: (value: string) => void;
}
const ReportFilterOptionSheet = ({ handleSelectedValue: handlePress }: ReportFilterOptionSheetProps) => {
    const [selectedOption, setSelectedOption] = useState<string>("");
    const theme = useTheme();
    const { colors }: { colors: any; } = theme;
    const options = [
        { label: 'This Week', value: 'This Week' },
        { label: 'Last Week', value: 'Last Week' },
        { label: 'Last Month', value: 'Last Month' },
        { label: 'Date Range', value: 'Date Range' },
    ];

    return (
        <View style={{ backgroundColor: colors.card, padding: 30, borderRadius: 10 }}>
            {options.map((option) => (
                <RadioButton
                    key={option.value}
                    label={option.label}
                    selected={selectedOption === option.value}
                    onPress={() => { handlePress(option.value); setSelectedOption(option.value); }}
                />
            ))}
        </View>
    );
};
export default ReportFilterOptionSheet;