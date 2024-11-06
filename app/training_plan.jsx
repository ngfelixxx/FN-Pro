import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

const TrainingPlan = ({ route }) => {
  console.log("Route parameters:", route ? route.params : "Route is undefined");
  //const { strengthLevel, goal, responses } = route.params;
  const { strengthLevel, goal, responses } = useLocalSearchParams();
  //const { strengthLevel, goal, responses } = useSearchParams();
  const [trainingStarted, setTrainingStarted] = useState(false);
  const [trainingPlan, setTrainingPlan] = useState([]);

  useEffect(() => {
    console.log("Strength Levels:", strengthLevel);
    console.log("Goals:", goal);
    console.log("Responses:", responses);
    generateTrainingPlan();
  }, []);

  const generateTrainingPlan = () => {
    const plan = [];
    if (strengthLevel === "Beginner" || strengthLevel === "Intermediate") {
      if (goal === "Planche") {
        const pseudoPlanchePushupCount = parseInt(responses["Planche-Beginner-0"], 10);
        const pseudoLeanHoldTime = parseInt(responses["Planche-Beginner-1"], 10);

        if (pseudoPlanchePushupCount === 0 || pseudoLeanHoldTime < 3) {
          plan.push(
            { name: "Regular Push-Ups", reps: 3, sets: 10, rest: "1 min" },
            { name: "Regular Dips (Assisted/Unassisted)", reps: 3, sets: 2, rest: "2 min" },
            { name: "Knee Pseudo Lean Hold", duration: "5 sec", sets: 5, rest: "1 min" },
            { name: "Warm-Up: Shoulder Dislocates", reps: 10, sets: 2, rest: "30 sec" },
            { name: "Cool Down: Knee Retracted Scapula Shrugs", reps: 3, sets: 5, rest: "1 min" },
            { name: "Resistance Training: Straight Arm Band Flies", reps: 10, sets: 3, rest: "30 sec" },
          );
          setTrainingPlan(plan);
        }
      }
    }
  };

  const startTraining = () => {
    setTrainingStarted(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Training Plan</Text>
      {trainingStarted ? (
        <ScrollView contentContainerStyle={styles.planContainer}>
          {trainingPlan.map((exercise, index) => (
            <View key={index} style={styles.exerciseBox}>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              <Text style={styles.exerciseDetails}>
                {exercise.reps ? `Reps: ${exercise.reps}` : `Duration: ${exercise.duration}`} | Sets: {exercise.sets} | Rest: {exercise.rest}
              </Text>
            </View>
          ))}
        </ScrollView>
      ) : (
        <Button title="See Training Plan" onPress={startTraining} color="#1E90FF" />
      )}
    </View>
  );
};

export default TrainingPlan;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
  },
  inProgressText: {
    fontSize: 20,
    color: '#32CD32',
    marginTop: 10,
  },
  planContainer: {
    padding: 20,
    alignItems: 'center',
  },
  exerciseBox: {
    backgroundColor: '#333333',
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
    width: '90%',
  },
  exerciseName: {
    fontSize: 18,
    color: '#00bfff',
    fontWeight: 'bold',
  },
  exerciseDetails: {
    fontSize: 16,
    color: '#ffffff',
    marginTop: 5,
  },
});
