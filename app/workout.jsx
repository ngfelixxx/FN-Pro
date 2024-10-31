import { StyleSheet, Text, View, Button } from 'react-native';
import React, { useState } from 'react';

const Workout = () => {
  const [workoutStarted, setWorkoutStarted] = useState(false);

  const startWorkout = () => {
    setWorkoutStarted(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Workout Session</Text>
      {workoutStarted ? (
        <Text style={styles.inProgressText}>Workout in progress... Keep going!</Text>
      ) : (
        <Button title="Start Workout" onPress={startWorkout} color="#1E90FF" />
      )}
    </View>
  );
};

export default Workout;

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
});
