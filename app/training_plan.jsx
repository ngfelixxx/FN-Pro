import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

const TrainingPlan = () => {
  const { strengthLevel, goal, responses } = useLocalSearchParams();
  const [trainingPlan, setTrainingPlan] = useState([]);  // Initialize as an empty array
  const [completedDays, setCompletedDays] = useState({}); // Track completed days

  useEffect(() => {
    try {
      if (!strengthLevel || !goal || !responses) return;

      const parsedStrengthLevel = JSON.parse(strengthLevel);
      const parsedResponses = JSON.parse(responses);

      console.log("Parsed Strength Levels:", parsedStrengthLevel);
      console.log("Parsed Responses:", parsedResponses);

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
        // First 2 weeks routine
        for (let week = 1; week <= 2; week++) {
          plan.push({ 
            week: `Week ${week}`,
            days: [
              { day: "Monday", workout: generateWeek1Workout() },
              { day: "Wednesday", workout: generateWeek1Workout() },
              { day: "Friday", workout: generateWeek1Workout() }
            ]
          });
        }

        // 3rd and 4th weeks routine (modified)
        for (let week = 3; week <= 4; week++) {
          plan.push({
            week: `Week ${week}`,
            days: [
              { day: "Monday", workout: generateWeek4_5Workout() },
              { day: "Wednesday", workout: generateWeek4_5Workout() },
              { day: "Friday", workout: generateWeek4_5Workout() }
            ]
          });
        }
      } else if (pseudoPlanchePushupCount >= 1 && pseudoPlanchePushupCount < 6 || pseudoLeanHoldTime > 3 && pseudoLeanHoldTime < 8) {
        // New conditional routine for weeks 1 and 2
        for (let week = 1; week <= 2; week++) {
          plan.push({
            week: `Week ${week}`,
            days: [
              { day: "Monday", workout: generateNewWeek1Workout() },
              { day: "Wednesday", workout: generateNewWeek1Workout() },
              { day: "Friday", workout: generateNewWeek1Workout() }
            ]
          });
        }

        // New conditional routine for weeks 3 and 4
        for (let week = 3; week <= 4; week++) {
          plan.push({
            week: `Week ${week}`,
            days: [
              { day: "Monday", workout: generateNewWeek4_5Workout() },
              { day: "Wednesday", workout: generateNewWeek4_5Workout() },
              { day: "Friday", workout: generateNewWeek4_5Workout() }
            ]
          });
        }
      } else if (pseudoPlanchePushupCount >= 6 || pseudoLeanHoldTime >= 8) {
        // New advanced conditional routine for weeks 1 and 2
        for (let week = 1; week <= 2; week++) {
          plan.push({
            week: `Week ${week}`,
            days: [
              { day: "Monday", workout: generateAdvancedWeek1Workout() },
              { day: "Wednesday", workout: generateAdvancedWeek1Workout() },
              { day: "Friday", workout: generateAdvancedWeek1Workout() }
            ]
          });
        }

        // New advanced conditional routine for weeks 3 and 4
        for (let week = 3; week <= 4; week++) {
          plan.push({
            week: `Week ${week}`,
            days: [
              { day: "Monday", workout: generateAdvancedWeek4_5Workout() },
              { day: "Wednesday", workout: generateAdvancedWeek4_5Workout() },
              { day: "Friday", workout: generateAdvancedWeek4_5Workout() }
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

  // Workout for Week 1 and 2
  const generateWeek1Workout = () => [
    { name: "Warm-Up: Shoulder Dislocates", reps: 10, sets: 2, rest: "30 sec" },
    { name: "Activation: Regular Push-Ups", reps: 3, sets: 3, rest: "1 min" },
    { name: "Skill Development: Regular Dips", reps: 3, sets: 2, rest: "2 min" },
    { name: "Skill Development: Pseudo Planche Leans On Knees", duration: "5 sec", sets: 5, rest: "1 min" },
    { name: "Resistance Training: Straight Arm Band Flies", reps: 10, sets: 3, rest: "30 sec" },
    { name: "Cool Down: Horizontal Retractive Scapula Pull Up", reps: 3, sets: 5, rest: "1 min" },
  ];

  // Workout for Week 3 and 4 (modified)
  const generateWeek4_5Workout = () => [
    { name: "Warm-Up: Shoulder Dislocates", reps: 10, sets: 2, rest: "30 sec" },
    { name: "Activation: Regular Push-Ups", reps: 3, sets: 3, rest: "1 min" },
    { name: "Skill Development: Pseudo Planche Leans On Knees", duration: "5 sec", sets: 5, rest: "3 min" },
    { name: "Skill Development: Pseudo Planche Push-Ups On Knees", reps: 5, sets: 5, rest: "3 min" },
    { name: "Resistance Training: Straight Arm Band Flies", reps: 10, sets: 3, rest: "30 sec" },
    { name: "Cool Down: Horizontal Retractive Scapula Pull Up", reps: 3, sets: 5, rest: "1 min" },
  ];

  // New Conditional Workouts for Pseudo Planche Push-Up Count >= 1 and < 6 or Pseudo Lean Hold > 3 seconds and < 8 seconds
  const generateNewWeek1Workout = () => [
    { name: "Warm-Up: Shoulder Dislocates", reps: 10, sets: 2, rest: "30 sec" },
    { name: "Activation: Explosive Pseudo Push-Ups on Knees", reps: 3, sets: 3, rest: "1 min" },
    { name: "Skill Development: Pseudo Planche Leans", duration: "5 sec", sets: 4, rest: "1 min" },
    { name: "Skill Development: Swing to Tuck Planche Support", reps: 3, sets: 5, rest: "2 min" },
    { name: "Skill Development: Banded Tuck Planche Hold", duration: "3 sec", sets: 10, rest: "3 min" },
    { name: "Skill Development: Pseudo Planche Push-Ups", reps: 3, sets: 5, rest: "3 min" },
    { name: "Resistance Training: Straight Arm Band Flies", reps: 10, sets: 3, rest: "30 sec" },
    { name: "Cool Down: Horizontal Retractive Scapula Pull Up", reps: 3, sets: 5, rest: "1 min" },
  ];

  const generateNewWeek4_5Workout = () => [
    { name: "Warm-Up: Shoulder Dislocates", reps: 10, sets: 2, rest: "30 sec" },
    { name: "Activation: Explosive Pseudo Push-Ups on Knees", reps: 3, sets: 3, rest: "1 min" },
    { name: "Skill Development: Pseudo Planche Leans", duration: "3 sec", sets: 5, rest: "1 min" },
    { name: "Skill Development: Swing to Tuck Planche Support", reps: 2, sets: 5, rest: "2 min" },
    { name: "Skill Development: Banded Tuck Planche Hold", duration: "3 sec", sets: 15, rest: "3 min" },
    { name: "Skill Development: Pseudo Planche Push-Ups", reps: 3, sets: 7, rest: "3 min" },
    { name: "Resistance Training: Straight Arm Band Flies", reps: 10, sets: 3, rest: "30 sec" },
    { name: "Cool Down: Horizontal Retractive Scapula Pull Up", reps: 3, sets: 5, rest: "1 min" },
  ];

  // Advanced Conditional Workouts for Pseudo Planche Push-Up Count >= 6 or Pseudo Lean Hold >= 8 seconds
  const generateAdvancedWeek1Workout = () => [
    { name: "Warm-Up: Shoulder Dislocates", reps: 10, sets: 2, rest: "30 sec" },
    { name: "Activation: Explosive Pseudo Push-Ups on Knees", reps: 3, sets: 3, rest: "1 min" },
    { name: "Skill Development: Advanced Tuck Planche Holds", duration: "3 sec", sets: 10, rest: "2 min" },
    { name: "Skill Development: Tuck Planche Hold", duration: "5 sec", sets: 10, rest: "3 min" },
    { name: "Skill Development: Swing to Tuck Planche Support", reps: 3, sets: 5, rest: "2 min" },
    { name: "Skill Development: Band Assisted Tuck Planche Push-Ups", reps: 3, sets: 5, rest: "3 min" },
    { name: "Resistance Training: Straight Arm Band Flies", reps: 10, sets: 3, rest: "30 sec" },
    { name: "Cool Down: Horizontal Retractive Scapula Pull Up", reps: 3, sets: 5, rest: "1 min" },
  ];

  const generateAdvancedWeek4_5Workout = () => [
    { name: "Warm-Up: Shoulder Dislocates", reps: 10, sets: 2, rest: "30 sec" },
    { name: "Activation: Explosive Pseudo Push-Ups on Knees", reps: 3, sets: 3, rest: "1 min" },
    { name: "Skill Development: Advanced Tuck Planche Holds", duration: "3 sec", sets: 10, rest: "2 min" },
    { name: "Skill Development: Tuck Planche Hold", duration: "3 sec", sets: 15, rest: "3 min" },
    { name: "Skill Development: Swing to Tuck Planche Support", reps: 3, sets: 5, rest: "2 min" },
    { name: "Skill Development: Band Assisted Tuck Planche Push-Ups", reps: 3, sets: 7, rest: "3 min" },
    { name: "Resistance Training: Straight Arm Band Flies", reps: 10, sets: 3, rest: "30 sec" },
    { name: "Cool Down: Horizontal Retractive Scapula Pull Up", reps: 3, sets: 5, rest: "1 min" },
  ];

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
