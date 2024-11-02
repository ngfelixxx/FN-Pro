import React, { useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

const TrainingPlan = () => {
  const [trainingStarted, setTrainingStarted] = useState(false);

  const startTraining = () => {
    setTrainingStarted(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Training Plan</Text>
      {trainingStarted ? (
        <Text style={styles.inProgressText}>Training in progress... Keep going!</Text>
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
});
