import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useRoute } from '@react-navigation/native';

const Profile = () => {
  const route = useRoute();
  const { tuckPushUps, leanHoldTime } = route.params || {};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Profile</Text>
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>Goals: Planche</Text>
        <Text style={styles.infoText}>Tuck Planche Push-Ups: {tuckPushUps || 'N/A'}</Text>
        <Text style={styles.infoText}>Lean Hold Time: {leanHoldTime || 'N/A'} seconds</Text>
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
});
