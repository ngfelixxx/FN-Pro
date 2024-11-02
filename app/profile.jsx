import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useRoute } from '@react-navigation/native';

const Profile = () => {
  const route = useRoute();
  const { name = 'N/A', selectedGoals = [], responses = {}, strengthLevels = {} } = route.params || {};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Profile</Text>
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>Name: {name}</Text>

        {Array.isArray(selectedGoals) && selectedGoals.length > 0 ? (
          selectedGoals.forEach((goal) => (
            <View key={goal} style={styles.goalBox}>
              <Text style={styles.infoText}>Goal: {goal}</Text>
              <Text style={styles.infoText}>
                Strength Level: {strengthLevels[goal] || 'N/A'}
              </Text>

              {Object.keys(responses).forEach((key) => {
                if (key.startsWith(`${goal}-${strengthLevels[goal]}`)) {
                  return (
                    <Text key={key} style={styles.infoText}>
                      {key.split('-').slice(-1)[0]}: {responses[key] || 'N/A'}
                    </Text>
                  );
                }
              })}
            </View>
          ))
        ) : (
          <Text style={styles.infoText}>No goals selected</Text>
        )}
      </View>
    </View>
  );
};

export default Profile;

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
  infoBox: {
    backgroundColor: '#333333',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 16,
    color: '#ffffff',
    marginVertical: 5,
  },
  goalBox: {
    marginVertical: 15,
    alignItems: 'center',
  },
});
