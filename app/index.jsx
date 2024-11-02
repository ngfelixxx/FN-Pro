import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import { Link } from 'expo-router';
import { useNavigation } from '@react-navigation/native';

export default function App() {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [strengthLevels, setStrengthLevels] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isGoalSubmitted, setIsGoalSubmitted] = useState(false);
  const [responses, setResponses] = useState({});

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
        "How long can you hold the Pseudo Lean?",
      ],
      "Front Lever": [
        "How many Australian Pull-Ups can you do?",
        "How long can you hold a Tuck Front Lever?",
      ],
    },
    Intermediate: {
      Planche: [
        "How long can you hold a straddle planche?",
        "How many straddle planche push-ups can you do?",
        "How many straddle planche presses can you do?",
      ],
      "Front Lever": [
        "How long can you hold a full front lever?",
        "How many front lever raises can you do?",
        "How many front lever pull-ups can you do?",
      ],
    },
    Advanced: {
      Planche: [
        "How long can you hold a full planche?",
        "How many full planche push-ups can you do?",
        "How many full planche presses can you do?",
      ],
      "Front Lever": [
        "How long can you front lever touch?",
        "How long can you hold a wide front lever?",
        "How many wide front lever raises can you do?",
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
  
      {/* Updated Link to Profile with Parameters */}
      <Link 
        href={{
          pathname: "/profile",
          params: { 
            name: name, 
            selectedGoals: selectedGoals, 
            strengthLevels: strengthLevels, 
            responses: responses 
          }
        }} 
        style={styles.link}
      >
        <View style={styles.button}>
          <Text style={styles.buttonText}>Go to Profile</Text>
        </View>
      </Link>
  
      <Link href="/workout" style={styles.link}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>Start Workout</Text>
        </View>
      </Link>
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
  input: {
    width: '100%',
    backgroundColor: '#333333',
    color: '#ffffff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  goalButton: {
    backgroundColor: '#333333',
    padding: 10,
    margin: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  goalButtonSelected: {
    backgroundColor: '#1E90FF',
  },
  goalText: {
    color: '#ffffff',
    fontSize: 16,
  },
  levelButton: {
    backgroundColor: '#444444',
    padding: 10,
    margin: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  levelButtonSelected: {
    backgroundColor: '#32CD32',
  },
  submitButton: {
    backgroundColor: '#1E90FF',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  link: {
    width: '100%',
  },
  button: {
    backgroundColor: '#1E90FF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
  },
});

