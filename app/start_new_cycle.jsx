import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function StartNewCycle() {
  const navigation = useNavigation();
  
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [strengthLevels, setStrengthLevels] = useState({});
  const [responses, setResponses] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const questions = {
    Beginner: {
      Planche: ["How many Pseudo Planche Push-Ups can you do?", "How long can you hold the Pseudo Planche Lean?(seconds)"],
      "Front Lever": ["How many Australian Pull-Ups can you do?", "How long can you hold a Tuck Front Lever?(seconds)"],
    },
    Intermediate: {
      Planche: ["How long can you hold a straddle planche?(seconds)", "How many straddle planche push-ups can you do?", "How many straddle planche presses can you do?"],
      "Front Lever": ["How long can you hold a full front lever?(seconds)", "How many front lever raises can you do?", "How many front lever pull-ups can you do?"],
    },
    Advanced: {
      Planche: ["How long can you hold a full planche?(seconds)", "How many full planche push-ups can you do?", "How many full planche presses can you do?"],
      "Front Lever": ["How long can you front lever touch?(seconds)", "How long can you hold a wide front lever?(seconds)", "How many wide front lever raises can you do?"],
    },
  };

  const handleGoalSelection = (goal) => {
    setSelectedGoals((prevGoals) =>
      prevGoals.includes(goal) ? prevGoals.filter((g) => g !== goal) : [...prevGoals, goal]
    );
  };

  const handleStrengthLevelSelection = (goal, level) => {
    setStrengthLevels((prevLevels) => ({ ...prevLevels, [goal]: level }));
  };

  const handleResponseChange = (goal, questionIndex, value) => {
    setResponses((prevResponses) => ({
      ...prevResponses,
      [`${goal}-${strengthLevels[goal]}-${questionIndex}`]: value,
    }));
  };

  const clearAsyncStorageExceptName = async () => {
    try {
        await AsyncStorage.clear();
    
        // Reset all state variables to their initial values
        setSelectedGoals([]);
        setStrengthLevels({});
        setResponses({});
      } catch (error) {
        console.log("Error clearing data", error);
      }
  };
  
  const handleSubmit = async () => {
    try {
      // Clear AsyncStorage (except 'name')
      await clearAsyncStorageExceptName();
  
      // Store the new values in AsyncStorage
      await AsyncStorage.setItem('selectedGoals', JSON.stringify(selectedGoals));
      await AsyncStorage.setItem('strengthLevels', JSON.stringify(strengthLevels));
      await AsyncStorage.setItem('responses', JSON.stringify(responses));
  
      // Return to the home screen
      navigation.navigate('index');
    } catch (error) {
      console.log("Error saving data", error);
    }
  };
  

  if (!isSubmitted) {
    return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <Text style={styles.title}>Start New Cycle</Text>

            <Text style={styles.question}>What are your goals?</Text>
            <TouchableOpacity
              style={[styles.goalButton, selectedGoals.includes('Planche') && styles.goalButtonSelected]}
              onPress={() => handleGoalSelection('Planche')}
            >
              <Text style={styles.goalText}>Planche</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.goalButton, selectedGoals.includes('Front Lever') && styles.goalButtonSelected]}
              onPress={() => handleGoalSelection('Front Lever')}
            >
              <Text style={styles.goalText}>Front Lever</Text>
            </TouchableOpacity>

            {selectedGoals.map((goal) => (
              <View key={goal}>
                <Text style={styles.question}>Select your strength level for {goal}:</Text>
                {["Beginner", "Intermediate", "Advanced"].map((level) => (
                  <TouchableOpacity
                    key={level}
                    style={[styles.levelButton, strengthLevels[goal] === level && styles.levelButtonSelected]}
                    onPress={() => handleStrengthLevelSelection(goal, level)}
                  >
                    <Text style={styles.levelText}>{level}</Text>
                  </TouchableOpacity>
                ))}

                {strengthLevels[goal] &&
                  questions[strengthLevels[goal]][goal].map((question, index) => (
                    <View key={`${goal}-${index}`}>
                      <Text style={styles.question}>{question}</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter your response"
                        placeholderTextColor="#888"
                        keyboardType="numeric"
                        onChangeText={(text) => handleResponseChange(goal, index, text)}
                        value={responses[`${goal}-${strengthLevels[goal]}-${index}`]}
                      />
                    </View>
                  ))}
              </View>
            ))}

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Save Goal Info</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  return null;
}

const styles = StyleSheet.create({
    scrollContainer: {
      flexGrow: 1,
      backgroundColor: '#121212',
      paddingVertical: 20,
    },
    container: {
      flex: 1,
      backgroundColor: '#121212',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 20,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#ffffff',
      marginBottom: 30,
    },
    question: {
      fontSize: 20,
      color: '#ffffff',
      marginBottom: 10,
    },
    levelButton: {
      backgroundColor: '#333333',
      padding: 10,
      margin: 5,
      borderRadius: 5,
    },
    levelButtonSelected: {
      backgroundColor: '#00bfff',
    },
    levelText: {
      color: '#ffffff',
    },
    input: {
      width: '100%', // Full width
      backgroundColor: '#333333',
      color: '#ffffff',
      padding: 10,
      borderRadius: 5,
      marginBottom: 20,
    },
    goalButton: {
      width: '100%', // Full width
      backgroundColor: '#333333',
      padding: 10,
      marginVertical: 5,
      borderRadius: 5,
      alignItems: 'center', // Center text horizontally
      justifyContent: 'center', // Center text vertically
    },
    goalButtonSelected: {
      width: '100%', // Full width for selected state as well
      backgroundColor: '#00bfff',
      alignItems: 'center', // Center text horizontally
      justifyContent: 'center', // Center text vertically
    },
    submitButton: {
      width: '100%', // Full width
      backgroundColor: '#1e90ff',
      padding: 15,
      borderRadius: 5,
      marginTop: 20,
      alignItems: 'center', // Center text horizontally
      justifyContent: 'center', // Center text vertically
    },
    submitButtonText: {
      color: '#ffffff',
      fontSize: 18,
      fontWeight: 'bold',
    },
    infoBox: {
      marginTop: 20,
      padding: 20,
      backgroundColor: '#333333',
      borderRadius: 5,
      width: '100%',
    },
    infoText: {
      color: '#ffffff',
      marginBottom: 10,
    },
    goalBox: {
      marginTop: 10,
    },
    goalText: {
      color: '#ffffff', // White text by default
    },
    startNewCycleButton: {
      width: '100%', // Full width
      backgroundColor: '#1e90ff',
      padding: 15,
      borderRadius: 5,
      marginTop: 'auto', // Push it to the bottom
      marginBottom: 20, // Adjust this value to shift the button lower
      alignItems: 'center', // Center text horizontally
      justifyContent: 'center', // Center text vertically
    },
    startNewCycleButtonText: {
      color: '#ffffff',
      fontSize: 18,
      fontWeight: 'bold',
    },
  });
  