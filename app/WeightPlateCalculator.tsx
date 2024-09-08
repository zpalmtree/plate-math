import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    TextInput,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { StatusBar } from "expo-status-bar";

const barTypes = [
    { label: "Standard (45 lbs)", value: 45 },
    { label: "Women's (33 lbs)", value: 33 },
    { label: "Training (22 lbs)", value: 22 },
];

const BLUE = '#1572b6';
const GREEN = '#15a03e';
const WHITE = '#efefef';
const RED = '#cf3239';
const YELLOW = '#ffd32b';

const plateWeights = [
    { weight: 45, color: "#000000" },
    { weight: 25, color: "#000000" },
    { weight: 10, color: "#000000" },
    { weight: 5, color: BLUE },
    { weight: 2.5, color: GREEN },
    { weight: 1.25, color: WHITE },
    { weight: 1, color: RED },
    { weight: 0.75, color: BLUE },
    { weight: 0.5, color: YELLOW },
    { weight: 0.25, color: GREEN },
];

export function WeightPlateCalculator() {
    const [barWeight, setBarWeight] = useState(45);
    const [targetWeight, setTargetWeight] = useState(45);
    const [inputWeight, setInputWeight] = useState("45");

    const clearPlates = () => {
        setTargetWeight(barWeight);
        setInputWeight(barWeight.toString());
    };

    const adjustWeight = (amount: number) => {
        const newWeight = Math.max(barWeight, targetWeight + amount);
        setTargetWeight(newWeight);
        setInputWeight(newWeight.toString());
    };

    const handleTargetWeightChange = (text: string) => {
        setInputWeight(text);
        const newWeight = parseFloat(text);
        if (!isNaN(newWeight) && newWeight >= barWeight) {
            setTargetWeight(newWeight);
        }
    };

    const plates = React.useMemo(() => {
        let remainingWeight = (targetWeight - barWeight) / 2;
        const newPlates = [];

        for (const plate of plateWeights) {
            while (remainingWeight >= plate.weight) {
                newPlates.push(plate);
                remainingWeight -= plate.weight;
            }
        }

        return newPlates;
    }, [targetWeight, barWeight]);

    const handleBarChange = React.useCallback((itemValue) => {
        const newBarWeight = Number(itemValue);
        setBarWeight(newBarWeight);
        setTargetWeight(newBarWeight);
        setInputWeight(newBarWeight.toString());
    }, []);

    return (
        <ScrollView style={styles.container}>
            <StatusBar style="auto" />
            <View style={styles.card}>
                <Text style={styles.title}>Weight Plate Calculator</Text>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Select Bar Type:</Text>
                    <Picker
                        selectedValue={barWeight}
                        onValueChange={handleBarChange}
                        style={styles.picker}
                    >
                        {barTypes.map((bar) => (
                            <Picker.Item
                                key={bar.value}
                                label={bar.label}
                                value={bar.value}
                            />
                        ))}
                    </Picker>
                </View>
                <View style={styles.weightContainer}>
                    <Text style={styles.label}>Target Weight (lbs):</Text>
                    <TextInput
                        style={styles.input}
                        value={inputWeight}
                        onChangeText={handleTargetWeightChange}
                        keyboardType="numeric"
                    />
                </View>

                <TouchableOpacity style={styles.clearButton} onPress={clearPlates}>
                    <Text style={styles.calculateButtonText}>Clear</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.card}>
                <Text style={styles.subtitle}>Required Plates (each side):</Text>
                <View style={styles.plateContainer}>
                    {plates.map((plate, index) => (
                        <View
                            key={index}
                            style={[
                                styles.plate,
                                { backgroundColor: plate.color },
                                plate.weight <= 5 && styles.smallPlate,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.plateText,
                                    { color: plate.weight >= 10 ? "white" : "black" },
                                ]}
                            >
                                {plate.weight}
                            </Text>
                        </View>
                    ))}
                </View>
                {plates.length === 0 && (
                    <Text style={styles.noPlatesText}>No additional plates needed</Text>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 16,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#6200ee",
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#6200ee",
        marginBottom: 16,
    },
    inputContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        color: "#333",
    },
    picker: {
        backgroundColor: "#f0f0f0",
        borderRadius: 4,
    },
    weightContainer: {
        marginBottom: 16,
    },
    buttonContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginTop: 8,
    },
    button: {
        padding: 8,
        borderRadius: 4,
        marginBottom: 8,
        minWidth: "22%",
        alignItems: "center",
        borderWidth: 1.5,
        borderColor: 'black',
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    calculateButton: {
        backgroundColor: "#6200ee",
        padding: 12,
        borderRadius: 4,
        alignItems: "center",
    },
    calculateButtonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 18,
    },
    clearButton: {
        backgroundColor: "#6200ee",
        padding: 12,
        borderRadius: 4,
        marginTop: 8,
        alignItems: "center",
    },
    input: {
        backgroundColor: "#f0f0f0",
        borderRadius: 4,
        padding: 8,
        marginBottom: 8,
        fontSize: 16,
    },
    plateContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: 'center',
        rowGap: 5,
    },
    plate: {
        width: 60,
        height: 60,
        borderRadius: 30,
        margin: 4,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    smallPlate: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: 'black',
    },
    plateText: {
        color: "white",
        fontWeight: "bold",
    },
    noPlatesText: {
        textAlign: "center",
        color: "#666",
        marginTop: 8,
    },
});
