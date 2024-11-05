import React, { useState, useMemo, useCallback } from "react";
import {
    View,
    Text,
    Pressable,
    ScrollView,
    StyleSheet,
    TextInput,
    Platform,
    SafeAreaView,
    Modal,
    TouchableOpacity,} from "react-native";
import { Picker } from "@react-native-picker/picker";

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
const BLACK = '#18181b';

const plateWeights = [
    { weight: 45, color: BLACK },
    { weight: 25, color: BLACK },
    { weight: 10, color: BLACK },
    { weight: 5, color: BLUE },
    { weight: 2.5, color: GREEN },
    { weight: 1.25, color: WHITE },
    { weight: 1, color: RED },
    { weight: 0.75, color: BLUE },
    { weight: 0.5, color: YELLOW },
    { weight: 0.25, color: GREEN },
];

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#fff",
    },
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
    pickerButton: {
        backgroundColor: "#f0f0f0",
        padding: 12,
        borderRadius: 4,
        marginBottom: 8,
    },
    pickerButtonText: {
        fontSize: 16,
        color: "#333",
    },
    iosPicker: {
        backgroundColor: "#f0f0f0",
        borderRadius: 4,
        marginBottom: 8,
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
        justifyContent: "center",
        alignItems: "center",
        margin: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    smallPlate: {
        borderWidth: 1,
        borderColor: 'black',
    },
    plateText: {
        fontWeight: "bold",
    },
    noPlatesText: {
        textAlign: "center",
        color: "#666",
        marginTop: 8,
    },
    warningText: {
        color: 'red',
        fontSize: 14,
        marginTop: 5,
    },
    pickerTrigger: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
        backgroundColor: '#f0f0f0',
        borderRadius: 4,
    },
    pickerTriggerText: {
        fontSize: 16,
        color: '#333',
    },
    chevron: {
        fontSize: 12,
        color: '#666',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        maxHeight: '70%',
    },
    pickerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e5ea',
    },
    headerButton: {
        paddingHorizontal: 8,
    },
    headerButtonText: {
        fontSize: 17,
        color: '#6200ee',
    },
    headerButtonTextBold: {
        fontWeight: '600',
    },
    optionsContainer: {
        paddingVertical: 8,
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#fff',
    },
    optionItemSelected: {
        backgroundColor: '#f6f6f6',
    },
    optionText: {
        fontSize: 17,
        color: '#333',
    },
    optionTextSelected: {
        color: '#6200ee',
    },
    checkmark: {
        fontSize: 17,
        color: '#6200ee',
    },
});

const getPlateSize = (weight) => {
    if (weight > 5) {
        return 70;
    }

    // Non-linear scaling for plates 5 lbs and below
    const minSize = 35; // Minimum size for the smallest plate
    const maxSize = 50; // Maximum size

    const scale = (weight / 5) ** 0.5; // Square root for non-linear scaling

    return minSize + (maxSize - minSize) * scale;
};

export function WeightPlateCalculator() {
    const [barWeight, setBarWeight] = useState(45);
    const [targetWeight, setTargetWeight] = useState(45);
    const [inputWeight, setInputWeight] = useState("45");
    const [showWarning, setShowWarning] = useState(false);
    const [showPicker, setShowPicker] = useState(false);

    const clearPlates = () => {
        setTargetWeight(barWeight);
        setInputWeight(barWeight.toString());
        setShowWarning(false);
    };

    const handleTargetWeightChange = (text) => {
        setInputWeight(text);

        const newWeight = parseFloat(text);

        if (isNaN(newWeight)) {
            return;
        }

        if (newWeight >= barWeight) {
            setTargetWeight(newWeight);
        }

        setShowWarning(newWeight < barWeight);
    };

    const plates = useMemo(() => {
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

    const handleBarChange = useCallback((itemValue) => {
        const newBarWeight = Number(itemValue);
        setBarWeight(newBarWeight);

        let resetTargetWeight = false;

        for (const { value } of barTypes) {
            if (targetWeight === value) {
                resetTargetWeight = true;
                break;
            }
        }

        const inputWeightNum = Number(inputWeight);

        if (resetTargetWeight) {
            setTargetWeight(newBarWeight);
            setInputWeight(newBarWeight.toString());
            setShowWarning(false);
        } else {
            setShowWarning(inputWeightNum < newBarWeight);
        }

        if (inputWeightNum !== targetWeight && inputWeightNum >= newBarWeight) {
            setTargetWeight(inputWeightNum);
        }
    }, [targetWeight, inputWeight]);

    const renderPicker = () => {
        if (Platform.OS === 'ios') {
            return (
                <CustomIOSPicker
                    selectedValue={barWeight}
                    onValueChange={handleBarChange}
                    options={barTypes}
                />
            );
        }

        return (
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
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container}>
                <View style={styles.card}>
                    <Text style={styles.title}>Weight Plate Calculator</Text>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Select Bar Type:</Text>
                        {renderPicker()}
                    </View>
                    <View style={styles.weightContainer}>
                        <Text style={styles.label}>Target Weight (lbs):</Text>
                        <TextInput
                            style={styles.input}
                            value={inputWeight}
                            onChangeText={handleTargetWeightChange}
                            inputMode={'decimal'}
                        />

                        {showWarning && (
                            <Text style={styles.warningText}>
                                Target weight is lower than bar weight
                            </Text>
                        )}
                    </View>

                    <Pressable style={styles.clearButton} onPress={clearPlates}>
                        <Text style={styles.calculateButtonText}>Clear</Text>
                    </Pressable>
                </View>
                <View style={styles.card}>
                    <Text style={styles.subtitle}>Required Plates (each side):</Text>
                    <View style={styles.plateContainer}>
                        {plates.map((plate, index) => {
                            const size = getPlateSize(plate.weight);
                            return (
                                <View
                                    key={index}
                                    style={[
                                        styles.plate,
                                        { 
                                            backgroundColor: plate.color,
                                            width: size,
                                            height: size,
                                            borderRadius: size / 2,
                                        },
                                        plate.weight <= 5 && styles.smallPlate,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.plateText,
                                            { 
                                                color: plate.weight >= 10 ? "white" : "black",
                                                fontSize: Math.max(12, size / 3),
                                            },
                                        ]}
                                    >
                                        {plate.weight}
                                    </Text>
                                </View>
                            );
                        })}
                    </View>
                    {plates.length === 0 && (
                        <Text style={styles.noPlatesText}>No additional plates needed</Text>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const CustomIOSPicker = ({ selectedValue, onValueChange, options }) => {
    const [modalVisible, setModalVisible] = useState(false);
    
    const selectedOption = options.find(option => option.value === selectedValue);

    const handleSelect = (option) => {
        onValueChange(option.value);
        setModalVisible(false);
    };

    return (
        <View>
            <TouchableOpacity
                style={styles.pickerTrigger}
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.pickerTriggerText}>
                    {selectedOption ? selectedOption.label : 'Select bar type'}
                </Text>
                <Text style={styles.chevron}>▼</Text>
            </TouchableOpacity>

            <Modal
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <SafeAreaView>
                            <View style={styles.pickerHeader}>
                                <TouchableOpacity
                                    onPress={() => setModalVisible(false)}
                                    style={styles.headerButton}
                                >
                                    <Text style={styles.headerButtonText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => setModalVisible(false)}
                                    style={styles.headerButton}
                                >
                                    <Text style={[styles.headerButtonText, styles.headerButtonTextBold]}>Done</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.optionsContainer}>
                                {options.map((option) => (
                                    <TouchableOpacity
                                        key={option.value}
                                        style={[
                                            styles.optionItem,
                                            selectedValue === option.value && styles.optionItemSelected
                                        ]}
                                        onPress={() => handleSelect(option)}
                                    >
                                        <Text style={[
                                            styles.optionText,
                                            selectedValue === option.value && styles.optionTextSelected
                                        ]}>
                                            {option.label}
                                        </Text>
                                        {selectedValue === option.value && (
                                            <Text style={styles.checkmark}>✓</Text>
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </SafeAreaView>
                    </View>
                </View>
            </Modal>
        </View>
    );
};
