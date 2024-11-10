import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform, StyleSheet, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Video } from 'expo-av';

export default function StartNewCycle() {
  const navigation = useNavigation();
  
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [strengthLevels, setStrengthLevels] = useState({});
  const [responses, setResponses] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [videoSource, setVideoSource] = useState(null);

  const openVideoModal = (questionText) => {
    const videoMap = {
      "How many Pseudo Planche Push-Ups can you do?": require('../assets/videos/Pseudo Planche Push-Ups.mp4'),
      "How long can you hold the Pseudo Planche Lean?(seconds)": require('../assets/videos/Pseudo Planche Leans.mp4'),
      // Add other questions and corresponding video sources here
    };

    // Check if video exists in the map
    if (videoMap[questionText]) {
      setVideoSource(videoMap[questionText]);
      setModalVisible(true);
    } else {
      console.warn(`No video found for question: ${questionText}`);
    }
  };

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

  // Helper function to retrieve data with a fallback to default value
  const safeGetItem = async (key, defaultValue) => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value !== null ? JSON.parse(value) : defaultValue;
    } catch (error) {
      console.error(`Error retrieving key ${key}`, error);
      return defaultValue;
    }
  };

  // Load stored data when component mounts
  useEffect(() => {
    (async () => {
      setSelectedGoals(await safeGetItem('selectedGoals', []));
      setStrengthLevels(await safeGetItem('strengthLevels', {}));
      setResponses(await safeGetItem('responses', {}));
    })();
  }, []);

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
        console.log("clearAsyncStorageExceptName called");

        // Get all the keys from AsyncStorage
        const keys = await AsyncStorage.getAllKeys();
        
        // Log the current values of all keys
        console.log("All keys before removal:", keys);
        
        // Get values associated with the keys before clearing
        for (const key of keys) {
            const value = await AsyncStorage.getItem(key);
            console.log(`Value of ${key}:`, value);
        }
        
        // Filter out the 'name' key so it is not cleared
        const keysToRemove = keys.filter(key => key !== 'name');
        
        // Remove all keys except 'name'
        await AsyncStorage.multiRemove(keysToRemove);
        
        console.log("Remaining keys after clear:", await AsyncStorage.getAllKeys());

        // Reset all state variables to their initial values
        setSelectedGoals([]);
        setStrengthLevels({});
        setResponses({});
        setIsSubmitted(false);
    } catch (error) {
        console.log("Error clearing data", error);
    }
};

const handleSubmit = async () => {
    try {
        console.log("handleSubmit called");

        // Log state before clearing AsyncStorage
        console.log("State before clear:", { selectedGoals, strengthLevels, responses });
        
        // Clear AsyncStorage (except 'name')
        await clearAsyncStorageExceptName();
  
        // Store the new values in AsyncStorage
        await AsyncStorage.setItem('selectedGoals', JSON.stringify(selectedGoals));
        await AsyncStorage.setItem('strengthLevels', JSON.stringify(strengthLevels));
        await AsyncStorage.setItem('responses', JSON.stringify(responses));

        // Log state after saving
        console.log("State after save:", { selectedGoals, strengthLevels, responses });
  
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
              style={[
                styles.goalButton,
                selectedGoals.includes('Planche') && styles.goalButtonSelected
              ]}
              onPress={() => handleGoalSelection('Planche')}
            >
              <Text style={styles.goalText}>Planche</Text>
            </TouchableOpacity>
  
            <TouchableOpacity
              style={[
                styles.goalButton,
                selectedGoals.includes('Front Lever') && styles.goalButtonSelected,
                !selectedGoals.includes('Front Lever') && styles.goalButtonDisabled, // Disable Front Lever if not selected
              ]}
              onPress={() => handleGoalSelection('Front Lever')}
              disabled={!selectedGoals.includes('Front Lever')} // Disable Front Lever button if not selected
            >
              <Text style={[
                styles.goalText,
                !selectedGoals.includes('Front Lever') && styles.goalTextDisabled, // Apply disabled text style
              ]}>Front Lever</Text>
            </TouchableOpacity>
  
            {selectedGoals.map((goal) => (
              <View key={goal}>
                <Text style={styles.question}>Select your strength level for {goal}:</Text>
                {["Beginner", "Intermediate", "Advanced"].map((level) => {
                  // Disable Intermediate and Advanced if Beginner is selected
                  const isDisabled = (level !== "Beginner" && !strengthLevels[goal]) || 
                                     (strengthLevels[goal] === "Beginner" && level !== "Beginner");
                  return (
                    <TouchableOpacity
                      key={level}
                      style={[
                        styles.levelButton,
                        strengthLevels[goal] === level && styles.levelButtonSelected,
                        isDisabled && styles.levelButtonDisabled, // Apply disabled style
                      ]}
                      onPress={() => !isDisabled && handleStrengthLevelSelection(goal, level)}
                    >
                      <Text style={[
                        styles.levelText,
                        isDisabled && styles.levelTextDisabled, // Apply disabled text style
                      ]}>{level}</Text>
                    </TouchableOpacity>
                  );
                })}
  
                {strengthLevels[goal] &&
                  questions[strengthLevels[goal]][goal].map((question, index) => (
                    <View key={`${goal}-${index}`} style={styles.questionContainer}>
                      <View style={styles.questionHeader}>
                        <Text style={styles.question}>{question}</Text>
                        <TouchableOpacity
                          onPress={() => openVideoModal(question)}
                          style={styles.questionMarkButton}
                        >
                          <Text style={styles.questionMark}>?</Text>
                        </TouchableOpacity>
                      </View>
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
          <Modal
            visible={modalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                {videoSource ? (
                  <Video
                    source={videoSource}
                    rate={1.0}
                    volume={1.0}
                    isMuted={false}
                    resizeMode="cover"
                    shouldPlay
                    style={styles.video}
                  />
                ) : (
                  <Text style={styles.errorMessage}>Video not available</Text>
                )}
                <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
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
    goalButtonDisabled: { 
        backgroundColor: "#ccc", // Gray background for disabled state
        opacity: 0.5, // Reduced opacity for disabled appearance
    },
    goalTextDisabled: {
    color: '#ffffff', // Disabled text color
    },
    levelButtonDisabled: {
    backgroundColor: "#ccc", // Gray background for disabled state
    opacity: 0.5, // Reduced opacity for disabled appearance
    },
    levelTextDisabled: {
    color: "#ffffff", // Lighter color for the disabled text
    },      
    questionContainer: {
      marginBottom: 16,
    },
    questionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    questionMarkButton: {
      marginLeft: 8,
      backgroundColor: '#00bfff',
      width: 20,
      height: 20,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    questionMark: {
      color: '#fff',
      fontSize: 12,
      fontWeight: 'bold',
    },  
  });
  
