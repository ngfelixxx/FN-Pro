import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

const TrainingPlan = () => {
  const { strengthLevel, goal, responses } = useLocalSearchParams();
  const [trainingPlan, setTrainingPlan] = useState([]);  // Initialize as an empty array
  const [completedDays, setCompletedDays] = useState({}); // Track completed days

  useEffect(() => {
    try {
      // Check if necessary params are present before proceeding
      if (!strengthLevel || !goal || !responses) return;

      // Parse JSON parameters into usable objects
      const parsedStrengthLevel = JSON.parse(strengthLevel);
      const parsedResponses = JSON.parse(responses);

      console.log("Parsed Strength Levels:", parsedStrengthLevel);
      console.log("Parsed Responses:", parsedResponses);

      // Pass parsed objects to generateTrainingPlan
      generateTrainingPlan(parsedStrengthLevel, goal, parsedResponses);
    } catch (error) {
      console.error("Error parsing JSON parameters:", error);
    }
  }, [strengthLevel, goal, responses]);

  const generateTrainingPlan = (level, goal, userResponses) => {
    const plan = [];
    
    if (level["Planche"] === "Beginner" && goal.includes("Planche")) {
      const pseudoPlanchePushupCount = parseInt(userResponses["Planche-Beginner-0"], 10);
      const pseudoLeanHoldTime = parseInt(userResponses["Planche-Beginner-1"], 10);

      if (pseudoPlanchePushupCount === 0 || pseudoLeanHoldTime < 3) {
        // First 3 weeks routine
        for (let week = 1; week <= 3; week++) {
          plan.push({ 
            week: `Week ${week}`,
            days: [
              { day: "Monday", workout: generateWeek1Workout() },
              { day: "Wednesday", workout: generateWeek1Workout() },
              { day: "Friday", workout: generateWeek1Workout() },
              { day: "Sunday", workout: generateWeek1Workout() }
            ]
          });
        }

        // 4th and 5th weeks routine (modified)
        for (let week = 4; week <= 5; week++) {
          plan.push({
            week: `Week ${week}`,
            days: [
              { day: "Monday", workout: generateWeek4_5Workout() },
              { day: "Wednesday", workout: generateWeek4_5Workout() },
              { day: "Friday", workout: generateWeek4_5Workout() },
              { day: "Sunday", workout: generateWeek4_5Workout() }
            ]
          });
        }
      }
    }

    setTrainingPlan(plan);  // Update state with the generated training plan
  };

  const toggleCompleted = (weekIndex, dayIndex) => {
    setCompletedDays(prevState => {
      const updatedState = { ...prevState };
      updatedState[`${weekIndex}-${dayIndex}`] = !updatedState[`${weekIndex}-${dayIndex}`];
      return updatedState;
    });
  };

  // Workout for Week 1, 2, and 3
  const generateWeek1Workout = () => [
    { name: "Warm-Up: Shoulder Dislocates", reps: 10, sets: 2, rest: "30 sec" },
    { name: "Skill Development: Regular Push-Ups", reps: 3, sets: 10, rest: "1 min" },
    { name: "Skill Development: Regular Dips (Band Assisted/Unassisted)", reps: 3, sets: 2, rest: "2 min" },
    { name: "Skill Development: Pseudo Lean Hold on Knees", duration: "5 sec", sets: 5, rest: "1 min" },
    { name: "Resistance Training: Straight Arm Band Flies", reps: 10, sets: 3, rest: "30 sec" },
    { name: "Cool Down: Retractive Scapula Shrugs", reps: 3, sets: 5, rest: "1 min" },
  ];

  // Workout for Week 4 and 5 (modified)
  const generateWeek4_5Workout = () => [
    { name: "Warm-Up: Shoulder Dislocates", reps: 10, sets: 2, rest: "30 sec" },
    { name: "Activation: Regular Push-Ups", reps: 3, sets: 3, rest: "1 min" },
    { name: "Skill Development: Pseudo Lean Hold (Band Assisted/Unassisted)", duration: "5 sec", sets: 5, rest: "3 min" },
    { name: "Skill Development: Pseudo Push-Ups (Band Assisted/Unassisted)", reps: 5, sets: 5, rest: "3 min" },
    { name: "Resistance Training: Straight Arm Band Flies", reps: 10, sets: 3, rest: "30 sec" },
    { name: "Cool Down: Retractive Scapula Shrugs", reps: 3, sets: 5, rest: "1 min" },
  ];

  // Check if trainingPlan is loaded before rendering
  if (!trainingPlan.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading Training Plan...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Training Plan</Text>
      <ScrollView contentContainerStyle={styles.planContainer}>
        {trainingPlan.map((week, weekIndex) => (
          <View key={weekIndex} style={styles.weekBox}>
            <Text style={styles.weekTitle}>{week.week}</Text>
            {week.days.map((day, dayIndex) => (
              <TouchableOpacity
                key={dayIndex}
                onPress={() => toggleCompleted(weekIndex, dayIndex)}
                style={[
                  styles.dayBox,
                  completedDays[`${weekIndex}-${dayIndex}`] && styles.completedDay
                ]}
              >
                <Text style={styles.dayName}>
                  {day.day} {completedDays[`${weekIndex}-${dayIndex}`] ? "(Completed)" : ""}
                </Text>
                {day.workout.map((exercise, exIndex) => (
                  <View key={exIndex} style={styles.exerciseBox}>
                    <Text style={styles.exerciseName}>{exercise.name}</Text>
                    <Text style={styles.exerciseDetails}>
                      {exercise.reps ? `Reps: ${exercise.reps}` : `Duration: ${exercise.duration}`} | Sets: {exercise.sets} | Rest: {exercise.rest}
                    </Text>
                  </View>
                ))}
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

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
  planContainer: {
    padding: 20,
    alignItems: 'center',
  },
  weekBox: {
    backgroundColor: '#333333',
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
    width: '90%',
  },
  weekTitle: {
    fontSize: 22,
    color: '#00bfff',
    fontWeight: 'bold',
  },
  dayBox: {
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
  },
  completedDay: {
    backgroundColor: '#006400',
  },
  dayName: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  exerciseBox: {
    backgroundColor: '#444444',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  exerciseName: {
    fontSize: 16,
    color: '#00bfff',
  },
  exerciseDetails: {
    fontSize: 14,
    color: '#ffffff',
  },
});

export default TrainingPlan;
