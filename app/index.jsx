import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { Link } from 'expo-router';
import { useNavigation } from '@react-navigation/native';

export default function App() {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [selectedGoal, setSelectedGoal] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [tuckPushUps, setTuckPushUps] = useState('');
  const [leanHoldTime, setLeanHoldTime] = useState('');
  const [isGoalSubmitted, setIsGoalSubmitted] = useState(false);

  useEffect(() => {
    navigation.setOptions({ title: 'FN-Calisthenics' });
  }, [navigation]);

  const handleGoalSelection = () => {
    setSelectedGoal(!selectedGoal);
  };

  const handleSubmit = () => {
    if (name) {
      setIsSubmitted(true);
    } else {
      alert("Please enter your name");
    }
  };

  const handleGoalSubmit = () => {
    if (tuckPushUps && leanHoldTime) {
      setIsGoalSubmitted(true);
    } else {
      alert("Please enter your tuck planche push-ups and lean hold time");
    }
  };

  if (!isSubmitted) {
    return (
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

        <Text style={styles.question}>What is your goal?</Text>
        <TouchableOpacity
          style={[
            styles.goalButton,
            selectedGoal && styles.goalButtonSelected,
          ]}
          onPress={handleGoalSelection}
        >
          <Text style={styles.goalText}>Planche</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (isSubmitted && !isGoalSubmitted) {
    return (
      <View style={styles.container}>
        <Text style={styles.question}>How many tuck planche push-ups can you do?</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter number"
          placeholderTextColor="#888"
          keyboardType="numeric"
          onChangeText={(text) => setTuckPushUps(text)}
          value={tuckPushUps}
        />

        <Text style={styles.question}>How long can you hold a lean for? (in seconds)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter time in seconds"
          placeholderTextColor="#888"
          keyboardType="numeric"
          onChangeText={(text) => setLeanHoldTime(text)}
          value={leanHoldTime}
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleGoalSubmit}>
          <Text style={styles.submitButtonText}>Save Goal Info</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to FN-Pro, {name}!</Text>

      <Link href={{
        pathname: "/profile",
        params: { tuckPushUps, leanHoldTime }
      }} style={styles.link}>
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
  submitButton: {
    backgroundColor: '#1E90FF',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  link: {
    marginVertical: 10,
    width: '100%',
  },
  button: {
    backgroundColor: '#1E90FF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
