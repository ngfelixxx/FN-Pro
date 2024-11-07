import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';   

export default function App() {
  const navigation = useNavigation();
  const router = useRouter();
  const [name, setName] = useState('');
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [strengthLevels, setStrengthLevels] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isGoalSubmitted, setIsGoalSubmitted] = useState(false);
  const [responses, setResponses] = useState({});

  const handleReset = async () => {
    try {
      // Clear AsyncStorage data
      await AsyncStorage.clear();
      
      // Reset all state variables to their initial values
      setName('');
      setSelectedGoals([]);
      setStrengthLevels({});
      setResponses({});
      setIsSubmitted(false);
      setIsGoalSubmitted(false);
    } catch (error) {
      console.log("Error clearing data", error);
    }
  };

  const loadData = async () => {
    try {
      // Retrieve stored data
      const storedName = await AsyncStorage.getItem('name');
      const storedGoals = await AsyncStorage.getItem('selectedGoals');
      const storedStrengthLevels = await AsyncStorage.getItem('strengthLevels');
      const storedResponses = await AsyncStorage.getItem('responses');
  
      // Set state with stored data if it exists
      if (storedName) setName(storedName);
      if (storedGoals) setSelectedGoals(JSON.parse(storedGoals));
      if (storedStrengthLevels) setStrengthLevels(JSON.parse(storedStrengthLevels));
      if (storedResponses) setResponses(JSON.parse(storedResponses));
  
      // Set `isSubmitted` and `isGoalSubmitted` if data exists
      if (storedName && storedGoals) {
        setIsSubmitted(true);
        setIsGoalSubmitted(true);
      }
    } catch (error) {
      console.log("Error loading data", error);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      title: 'FN-Calisthenics',
      headerRight: () => (
        <TouchableOpacity onPress={handleReset}>
          <Text style={{ color: '#ffffff', marginRight: 10 }}>Reset</Text>
        </TouchableOpacity>
      ),
    });
  
    loadData(); // Load data when component mounts
  }, [navigation]);
  

  useEffect(() => {
    navigation.setOptions({ title: 'FN-Calisthenics' });
  }, [navigation]);

  const handleGoalSelection = (goal) => {
    setSelectedGoals((prevGoals) =>
      prevGoals.includes(goal)
        ? prevGoals.filter((g) => g !== goal)
        : [...prevGoals, goal]
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

  const handleSubmit = () => {
    if (name) {
      setIsSubmitted(true);
    } else {
      alert("Please enter your name");
    }
  };

  const handleGoalSubmit = () => {
    const allGoalsAnswered = selectedGoals.every((goal) => {
      const level = strengthLevels[goal];
      const questionsCount = questions[level][goal].length;
      return Array.from({ length: questionsCount }).every((_, index) =>
        responses[`${goal}-${level}-${index}`]
      );
    });

    if (allGoalsAnswered) {
      setIsGoalSubmitted(true);
    } else {
      alert("Please complete all fields based on your selected goals and strength levels");
    }
  };

  const questions = {
    Beginner: {
      Planche: [
        "How many Pseudo Planche Push-Ups can you do?",
        "How long can you hold the Pseudo Planche Lean?(seconds)",
      ],
      "Front Lever": [
        "How many Australian Pull-Ups can you do?",
        "How long can you hold a Tuck Front Lever?(seconds)",
      ],
    },
    Intermediate: {
      Planche: [
        "How long can you hold a straddle planche?(seconds)",
        "How many straddle planche push-ups can you do?",
        "How many straddle planche presses can you do?",
      ],
      "Front Lever": [
        "How long can you hold a full front lever?(seconds)",
        "How many front lever raises can you do?",
        "How many front lever pull-ups can you do?",
      ],
    },
    Advanced: {
      Planche: [
        "How long can you hold a full planche?(seconds)",
        "How many full planche push-ups can you do?",
        "How many full planche presses can you do?",
      ],
      "Front Lever": [
        "How long can you front lever touch?(seconds)",
        "How long can you hold a wide front lever?(seconds)",
        "How many wide front lever raises can you do?",
      ],
    },
  };

  const questionsLabels = {
    Beginner: {
      Planche: [
        "Pseudo planche push-up count",
        "Pseudo planche lean hold time(seconds)",
      ],
      "Front Lever": [
        "Australian pull-up count",
        "Tuck front lever hold time(seconds)",
      ],
    },
    Intermediate: {
      Planche: [
        "Straddle planche hold time(seconds)",
        "Number of straddle planche push-ups",
        "Number of straddle planche presses",
      ],
      "Front Lever": [
        "Full front lever hold time(seconds)",
        "Number of front lever raises",
        "Number of front lever pull-ups",
      ],
    },
    Advanced: {
      Planche: [
        "Full planche hold time(seconds)",
        "Number of full planche push-ups",
        "Number of full planche presses",
      ],
      "Front Lever": [
        "Front lever touch hold time(seconds)",
        "Wide front lever hold time(seconds)",
        "Number of wide front lever raises",
      ],
    },
  };  

  if (!isSubmitted) {
    return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <Text style={styles.title}>Welcome to FN-Pro!</Text>
            <StatusBar style="light" />

            <Text style={styles.question}>What is your name?</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              placeholderTextColor="#888"
              onChangeText={(text) => setName(text)}
              value={name}
            />

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

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  if (isSubmitted && !isGoalSubmitted) {
    return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            {selectedGoals.map((goal) => (
              <View key={goal}>
                <Text style={styles.question}>Select your strength level for {goal}:</Text>
                {["Beginner", "Intermediate", "Advanced"].map((level) => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.levelButton,
                      strengthLevels[goal] === level && styles.levelButtonSelected,
                    ]}
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

            <TouchableOpacity style={styles.submitButton} onPress={handleGoalSubmit}>
              <Text style={styles.submitButtonText}>Save Goal Info</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to FN-Pro, {name}!</Text>
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>Name: {name}</Text>
        {Array.isArray(selectedGoals) && selectedGoals.length > 0 ? (
          selectedGoals.map((goal) => (
            <View key={goal} style={styles.goalBox}>
              <Text style={styles.infoText}>Goal: {goal}</Text>
              <Text style={styles.infoText}>
                Strength Level: {strengthLevels[goal] || 'N/A'}
              </Text>

              {questionsLabels[strengthLevels[goal]][goal].map((question, index) => (
                <Text key={`${goal}-${index}`} style={styles.infoText}>
                    {question}: {responses[`${goal}-${strengthLevels[goal]}-${index}`] || 'N/A'}
                </Text>
                ))}
            </View>
          ))
        ) : (
          <Text style={styles.infoText}>No goals selected</Text>
        )}
      </View>
        
      <TouchableOpacity
        style={styles.submitButton}
        onPress={() =>
            router.push({
            pathname: "/training_plan",
            params: {
                strengthLevel: JSON.stringify(strengthLevels),
                goal: selectedGoals,
                responses: JSON.stringify(responses),
            },
            })        
        }
        >
        <Text style={styles.submitButtonText}>See Training Plan</Text>
        </TouchableOpacity>
    </View>
  );
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
    alignItems: 'center',  // Center text horizontally
    justifyContent: 'center', // Center text vertically
  },
  goalButtonSelected: {
    width: '100%', // Full width for selected state as well
    backgroundColor: '#00bfff',
    alignItems: 'center',  // Center text horizontally
    justifyContent: 'center', // Center text vertically
  },
  submitButton: {
    width: '100%', // Full width
    backgroundColor: '#1e90ff',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',  // Center text horizontally
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
});