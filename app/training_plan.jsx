import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'react-native';

const TrainingPlan = () => {
  const { strengthLevel, goal, responses } = useLocalSearchParams();
  const [trainingPlan, setTrainingPlan] = useState([]);  // Initialize as an empty array
  const [completedDays, setCompletedDays] = useState({}); // Track completed days
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [imageSource, setImageSource] = useState(null); 

  const openImageModal = (exerciseName) => {
    const imageMap = {
      "Warm-Up: Shoulder Dislocates": require('../assets/images/Shoulder_Dislocates.png'),
      "Activation: Regular Push-Ups": require('../assets/images/Regular_Push_Ups.png'),
      "Skill Development: Regular Dips": require('../assets/images/Regular_Dips.png'),
      "Skill Development: Pseudo Planche Leans On Knees": require('../assets/images/Pseudo_Planche_Leans_On_Knees.png'),
      "Resistance Training: Straight Arm Band Flies": require('../assets/images/Straight_Arm_Band_Flies.png'),
      "Cool Down: Horizontal Retractive Scapula Pull Up": require('../assets/images/Horizontal_Retractive_Scapula_Pull_Up.png'),
      "Activation: Explosive Pseudo Push-Ups on Knees": require('../assets/images/Explosive_Pseudo_Push_Ups_on_Knees.png'),
      "Skill Development: Pseudo Planche Leans": require('../assets/images/Pseudo_Planche_Leans.png'),
      "Skill Development: Swing to Tuck Planche Support": require('../assets/images/Swing_to_Tuck_Planche_Support.png'),
      "Skill Development: Band Assisted Tuck Planche Hold": require('../assets/images/Band_Assisted_Tuck_Planche_Hold.png'),
      "Skill Development: Pseudo Planche Push-Ups": require('../assets/images/Pseudo_Planche_Push_Ups.png'),
      "Skill Development: Advanced Tuck Planche Holds": require('../assets/images/Advanced_Tuck_Planche_Holds.png'),
      "Skill Development: Tuck Planche Hold": require('../assets/images/Tuck_Planche_Hold.png'),
      "Skill Development: Band Assisted Tuck Planche Push-Ups": require('../assets/images/Band_Assisted_Tuck_Planche_Push_Ups.png'),
    };
  
    if (!exerciseName || !imageMap[exerciseName]) {
      console.warn(`No image found for exercise: ${exerciseName}`);
      return;
    }
  
    setImageSource(imageMap[exerciseName]);
    setModalVisible(true);
  };  

  useEffect(() => {
    const fetchCompletedDays = async () => {
        try {
            const storedCompletedDays = await AsyncStorage.getItem('completedDays');
            if (storedCompletedDays) {
                setCompletedDays(JSON.parse(storedCompletedDays));
            }
        } catch (error) {
            console.error('Error fetching completed days:', error);
        }
    };

    fetchCompletedDays();
}, []);

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

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    if (level["Planche"] === "Beginner" && goal.includes("Planche") && !goal.includes("FrontLever")) {
      const pseudoPlanchePushupCount = parseInt(userResponses["Planche-Beginner-0"], 10);
      const pseudoLeanHoldTime = parseInt(userResponses["Planche-Beginner-1"], 10);

      if (pseudoPlanchePushupCount === 0 || pseudoLeanHoldTime < 3) {
        // First 2 weeks routine
        for (let week = 1; week <= 2; week++) {
          plan.push({ 
            week: `Week ${week}`,
            days: [
              { day: "Monday", workout: generatePlancheEarlyBeginnerFirstHalf() },
              { day: "Wednesday", workout: generatePlancheEarlyBeginnerFirstHalf() },
              { day: "Friday", workout: generatePlancheEarlyBeginnerFirstHalf() }
            ]
          });
        }

        // 3rd and 4th weeks routine (modified)
        for (let week = 3; week <= 4; week++) {
          plan.push({
            week: `Week ${week}`,
            days: [
              { day: "Monday", workout: generatePlancheEarlyBeginnerSecondHalf() },
              { day: "Wednesday", workout: generatePlancheEarlyBeginnerSecondHalf() },
              { day: "Friday", workout: generatePlancheEarlyBeginnerSecondHalf() }
            ]
          });
        }
      } else if (pseudoPlanchePushupCount > 1 && pseudoPlanchePushupCount < 6 || pseudoLeanHoldTime > 3 && pseudoLeanHoldTime < 8) {
        // New conditional routine for weeks 1 and 2
        for (let week = 1; week <= 2; week++) {
          plan.push({
            week: `Week ${week}`,
            days: [
              { day: "Monday", workout: generatePlancheMidBeginnerFirstHalf() },
              { day: "Wednesday", workout: generatePlancheMidBeginnerFirstHalf() },
              { day: "Friday", workout: generatePlancheMidBeginnerFirstHalf() }
            ]
          });
        }

        // New conditional routine for weeks 3 and 4
        for (let week = 3; week <= 4; week++) {
          plan.push({
            week: `Week ${week}`,
            days: [
              { day: "Monday", workout: generatePlancheMidBeginnerSecondHalf() },
              { day: "Wednesday", workout: generatePlancheMidBeginnerSecondHalf() },
              { day: "Friday", workout: generatePlancheMidBeginnerSecondHalf() }
            ]
          });
        }
      } else if (pseudoPlanchePushupCount >= 6 && pseudoPlanchePushupCount <= 12 || pseudoLeanHoldTime >= 8 && pseudoLeanHoldTime <= 14) {
        // New advanced conditional routine for weeks 1 and 2
        for (let week = 1; week <= 2; week++) {
          plan.push({
            week: `Week ${week}`,
            days: [
              { day: "Monday", workout: generatePlancheLateBeginnerFirstHalf() },
              { day: "Wednesday", workout: generatePlancheLateBeginnerFirstHalf() },
              { day: "Friday", workout: generatePlancheLateBeginnerFirstHalf() }
            ]
          });
        }

        // New advanced conditional routine for weeks 3 and 4
        for (let week = 3; week <= 4; week++) {
          plan.push({
            week: `Week ${week}`,
            days: [
              { day: "Monday", workout: generatePlancheLateBeginnerSecondHalf() },
              { day: "Wednesday", workout: generatePlancheLateBeginnerSecondHalf() },
              { day: "Friday", workout: generatePlancheLateBeginnerSecondHalf() }
            ]
          });
        }
      }
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    if (level["FrontLever"] === "Beginner" && goal.includes("FrontLever") && !goal.includes("Planche")) {
      const australianPullUpsCount = parseInt(userResponses["FrontLever-Beginner-0"], 10);
      const tuckFrontLeverHoldTime = parseInt(userResponses["FrontLever-Beginner-1"], 10);
      if (australianPullUpsCount < 3 || tuckFrontLeverHoldTime < 3) {
        // Weeks 1 and 2 Routine
        for (let week = 1; week <= 2; week++) {
          plan.push({
            week: `Week ${week}`,
            days: [
              { day: "Monday", workout: generateFrontLeverEarlyBeginnerFirstHalf() },
              { day: "Wednesday", workout: generateFrontLeverEarlyBeginnerFirstHalf() },
              { day: "Friday", workout: generateFrontLeverEarlyBeginnerFirstHalf() },
            ],
          });
        }
      
        // Weeks 3 and 4 Routine (modified)
        for (let week = 3; week <= 4; week++) {
          plan.push({
            week: `Week ${week}`,
            days: [
              { day: "Monday", workout: generateFrontLeverEarlyBeginnerSecondHalf() },
              { day: "Wednesday", workout: generateFrontLeverEarlyBeginnerSecondHalf() },
              { day: "Friday", workout: generateFrontLeverEarlyBeginnerSecondHalf() },
            ],
          });
        }
      } else if (
        (australianPullUpsCount > 3 && australianPullUpsCount <= 10) ||
        (tuckFrontLeverHoldTime > 3 && tuckFrontLeverHoldTime <= 8)
      ) {
        // Weeks 1 and 2 Routine
        for (let week = 1; week <= 2; week++) {
          plan.push({
            week: `Week ${week}`,
            days: [
              { day: "Monday", workout: generateMidBeginnerFrontLeverBeginnerFirstHalf() },
              { day: "Wednesday", workout: generateMidBeginnerFrontLeverBeginnerFirstHalf() },
              { day: "Friday", workout: generateMidBeginnerFrontLeverBeginnerFirstHalf() },
            ],
          });
        }
      
        // Weeks 3 and 4 Routine (modified)
        for (let week = 3; week <= 4; week++) {
          plan.push({
            week: `Week ${week}`,
            days: [
              { day: "Monday", workout: generateMidBeginnerFrontLeverSecondHalf() },
              { day: "Wednesday", workout: generateMidBeginnerFrontLeverSecondHalf() },
              { day: "Friday", workout: generateMidBeginnerFrontLeverBeginnerSecondHalf() },
            ],
          });
        }
      } else if (australianPullUpsCount > 10 && australianPullUpsCount <= 20 || tuckFrontLeverHoldTime > 8 && tuckFrontLeverHoldTime <= 18) {
        // Weeks 1 and 2 Routine
        for (let week = 1; week <= 2; week++) {
          plan.push({
            week: `Week ${week}`,
            days: [
              { day: "Monday", workout: generateLateBeginnerFrontLeverFirstHalf() },
              { day: "Wednesday", workout: generateLateBeginnerFrontLeverFirstHalf() },
              { day: "Friday", workout: generateLateBeginnerFrontLeverFirstHalf() },
            ],
          });
        }
      
        // Weeks 3 and 4 Routine (modified)
        for (let week = 3; week <= 4; week++) {
          plan.push({
            week: `Week ${week}`,
            days: [
              { day: "Monday", workout: generateLateBeginnerFrontLeverSecondHalf() },
              { day: "Wednesday", workout: generateLateBeginnerFrontLeverSecondHalf() },
              { day: "Friday", workout: generateLateBeginnerFrontLeverSecondHalf() },
            ],
          });
        }
      }    
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////



    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    setTrainingPlan(plan);  // Update state with the generated training plan
  };

  const toggleCompleted = (weekIndex, dayIndex) => {
    setCompletedDays(prevState => {
      const updatedState = { ...prevState };
      updatedState[`${weekIndex}-${dayIndex}`] = !updatedState[`${weekIndex}-${dayIndex}`];
      AsyncStorage.setItem('completedDays', JSON.stringify(updatedState));
      return updatedState;
    });
  };

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // Workout for Week 1 and 2
  const generatePlancheEarlyBeginnerFirstHalf  = () => [
    { name: "Warm-Up: Shoulder Dislocates", reps: 10, sets: 2, rest: "30 sec" },
    { name: "Activation: Regular Push-Ups", reps: 3, sets: 3, rest: "1 min" },
    { name: "Skill Development: Regular Dips", reps: 3, sets: 2, rest: "2 min" },
    { name: "Skill Development: Pseudo Planche Leans On Knees", duration: "5 sec", sets: 5, rest: "1 min" },
    { name: "Resistance Training: Straight Arm Band Flies", reps: 10, sets: 3, rest: "30 sec" },
    { name: "Cool Down: Horizontal Retractive Scapula Pull Up", reps: 3, sets: 5, rest: "1 min" },
  ];

  // Workout for Week 3 and 4 (modified)
  const generatePlancheEarlyBeginnerSecondHalf  = () => [
    { name: "Warm-Up: Shoulder Dislocates", reps: 10, sets: 2, rest: "30 sec" },
    { name: "Activation: Regular Push-Ups", reps: 3, sets: 3, rest: "1 min" },
    { name: "Skill Development: Pseudo Planche Leans On Knees", duration: "5 sec", sets: 5, rest: "3 min" },
    { name: "Skill Development: Pseudo Planche Push-Ups On Knees", reps: 5, sets: 5, rest: "3 min" },
    { name: "Resistance Training: Straight Arm Band Flies", reps: 10, sets: 3, rest: "30 sec" },
    { name: "Cool Down: Horizontal Retractive Scapula Pull Up", reps: 3, sets: 5, rest: "1 min" },
  ];

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // New Conditional Workouts for Pseudo Planche Push-Up Count >= 1 and < 6 or Pseudo Lean Hold > 3 seconds and < 8 seconds
  const generatePlancheMidBeginnerFirstHalf  = () => [
    { name: "Warm-Up: Shoulder Dislocates", reps: 10, sets: 2, rest: "30 sec" },
    { name: "Activation: Explosive Pseudo Push-Ups on Knees", reps: 3, sets: 3, rest: "1 min" },
    { name: "Skill Development: Pseudo Planche Leans", duration: "5 sec", sets: 4, rest: "1 min" },
    { name: "Skill Development: Swing to Tuck Planche Support", reps: 3, sets: 5, rest: "2 min" },
    { name: "Skill Development: Band Assisted Tuck Planche Hold", duration: "3 sec", sets: 10, rest: "3 min" },
    { name: "Skill Development: Pseudo Planche Push-Ups", reps: 3, sets: 5, rest: "3 min" },
    { name: "Resistance Training: Straight Arm Band Flies", reps: 10, sets: 3, rest: "30 sec" },
    { name: "Cool Down: Horizontal Retractive Scapula Pull Up", reps: 3, sets: 5, rest: "1 min" },
  ];

  const generatePlancheMidBeginnerSecondHalf  = () => [
    { name: "Warm-Up: Shoulder Dislocates", reps: 10, sets: 2, rest: "30 sec" },
    { name: "Activation: Explosive Pseudo Push-Ups on Knees", reps: 3, sets: 3, rest: "1 min" },
    { name: "Skill Development: Pseudo Planche Leans", duration: "3 sec", sets: 5, rest: "1 min" },
    { name: "Skill Development: Swing to Tuck Planche Support", reps: 2, sets: 5, rest: "2 min" },
    { name: "Skill Development: Band Assisted Tuck Planche Hold", duration: "3 sec", sets: 15, rest: "3 min" },
    { name: "Skill Development: Pseudo Planche Push-Ups", reps: 3, sets: 7, rest: "3 min" },
    { name: "Resistance Training: Straight Arm Band Flies", reps: 10, sets: 3, rest: "30 sec" },
    { name: "Cool Down: Horizontal Retractive Scapula Pull Up", reps: 3, sets: 5, rest: "1 min" },
  ];

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // Advanced Conditional Workouts for Pseudo Planche Push-Up Count >= 6 or Pseudo Lean Hold >= 8 seconds
  const generatePlancheLateBeginnerFirstHalf = () => [
    { name: "Warm-Up: Shoulder Dislocates", reps: 10, sets: 2, rest: "30 sec" },
    { name: "Activation: Explosive Pseudo Push-Ups on Knees", reps: 3, sets: 3, rest: "1 min" },
    { name: "Skill Development: Advanced Tuck Planche Holds", duration: "3 sec", sets: 10, rest: "2 min" },
    { name: "Skill Development: Tuck Planche Hold", duration: "5 sec", sets: 10, rest: "3 min" },
    { name: "Skill Development: Swing to Tuck Planche Support", reps: 3, sets: 5, rest: "2 min" },
    { name: "Skill Development: Band Assisted Tuck Planche Push-Ups", reps: 3, sets: 5, rest: "3 min" },
    { name: "Resistance Training: Straight Arm Band Flies", reps: 10, sets: 3, rest: "30 sec" },
    { name: "Cool Down: Horizontal Retractive Scapula Pull Up", reps: 3, sets: 5, rest: "1 min" },
  ];

  const generatePlancheLateBeginnerSecondHalf = () => [
    { name: "Warm-Up: Shoulder Dislocates", reps: 10, sets: 2, rest: "30 sec" },
    { name: "Activation: Explosive Pseudo Push-Ups on Knees", reps: 3, sets: 3, rest: "1 min" },
    { name: "Skill Development: Advanced Tuck Planche Holds", duration: "3 sec", sets: 10, rest: "2 min" },
    { name: "Skill Development: Tuck Planche Hold", duration: "3 sec", sets: 15, rest: "3 min" },
    { name: "Skill Development: Swing to Tuck Planche Support", reps: 3, sets: 5, rest: "2 min" },
    { name: "Skill Development: Band Assisted Tuck Planche Push-Ups", reps: 3, sets: 7, rest: "3 min" },
    { name: "Resistance Training: Straight Arm Band Flies", reps: 10, sets: 3, rest: "30 sec" },
    { name: "Cool Down: Horizontal Retractive Scapula Pull Up", reps: 3, sets: 5, rest: "1 min" },
  ];

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  const generateFrontLeverEarlyBeginnerFirstHalf = () => [
    { name: "Warm Up: Band Pull-Aparts", reps: 10, sets: 3, rest: "30 sec" },
    { name: "Activation: Horizontal Retractive Scapula Pull Up", reps: 5, sets: 4, rest: "1 min" },
    { name: "Skill Development: Incline Australian Pull Ups", reps: 5, sets: 4, rest: "2 min" },
    { name: "Skill Development: Band Assisted Tuck Front Lever Hold", duration: "5 sec", sets: 5, rest: "3 min" },
    { name: "Skill Development: Knee Raises", reps: 3, sets: 5, rest: "3 min" },
    { name: "Resistance Training: Retractive Scapula Band Rows", reps: 5, sets: 4, rest: "1 min" },
    { name: "Cool Down: Pseudo Planche Scapula Push Ups", reps: 3, sets: 5, rest: "1 min" },
  ];
  
  const generateFrontLeverEarlyBeginnerSecondHalf = () => [
    { name: "Warm Up: Band Pull-Aparts", reps: 10, sets: 3, rest: "30 sec" },
    { name: "Activation: Horizontal Retractive Scapula Pull Up", reps: 5, sets: 4, rest: "1 min" },
    { name: "Skill Development: Incline Australian Pull Ups", reps: 3, sets: 5, rest: "2 min" },
    { name: "Skill Development: Band Assisted Tuck Front Lever Hold", duration: "5 sec", sets: 5, rest: "3 min" },
    { name: "Skill Development: Knee Raises", reps: 3, sets: 7, rest: "3 min" },
    { name: "Resistance Training: Retractive Scapula Band Rows", reps: 5, sets: 4, rest: "1 min" },
    { name: "Cool Down: Pseudo Planche Scapula Push Ups", reps: 3, sets: 5, rest: "1 min" },
  ];
  
  const generateMidBeginnerFrontLeverBeginnerFirstHalf = () => [
    { name: "Warm Up: Band Pull-Aparts", reps: 10, sets: 3, rest: "30 sec" },
    { name: "Activation: Horizontal Retractive Scapula Pull Up", reps: 5, sets: 4, rest: "1 min" },
    { name: "Skill Development: Regular Australian Pull Ups", reps: 5, sets: 4, rest: "2 min" },
    { name: "Skill Development: Tuck Front Lever Hold", duration: "3 sec", sets: 5, rest: "3 min" },
    { name: "Skill Development: Tuck Dragon Flag", reps: 2, sets: 5, rest: "3 min" },
    { name: "Skill Development: Knee Raises", reps: 3, sets: 7, rest: "3 min" },
    { name: "Resistance Training: Retractive Scapula Band Rows", reps: 5, sets: 4, rest: "1 min" },
    { name: "Cool Down: Pseudo Planche Scapula Push Ups", reps: 3, sets: 5, rest: "1 min" },
  ];
  
  const generateMidBeginnerFrontLeverSecondHalf = () => [
    { name: "Warm Up: Band Pull-Aparts", reps: 10, sets: 3, rest: "30 sec" },
    { name: "Activation: Horizontal Retractive Scapula Pull Up", reps: 5, sets: 4, rest: "1 min" },
    { name: "Skill Development: Regular Australian Pull Ups", reps: 3, sets: 7, rest: "2 min" },
    { name: "Skill Development: Tuck Front Lever Hold", duration: "3 sec", sets: 10, rest: "3 min" },
    { name: "Skill Development: Tuck Dragon Flag", reps: 2, sets: 5, rest: "3 min" },
    { name: "Skill Development: Knee Raises", reps: 3, sets: 7, rest: "3 min" },
    { name: "Resistance Training: Retractive Scapula Band Rows", reps: 5, sets: 4, rest: "1 min" },
    { name: "Cool Down: Pseudo Planche Scapula Push Ups", reps: 3, sets: 5, rest: "1 min" },
  ];
  
  const generateLateBeginnerFrontLeverFirstHalf = () => [
    { name: "Warm Up: Band Pull-Aparts", reps: 10, sets: 3, rest: "30 sec" },
    { name: "Activation: Horizontal Retractive Scapula Pull Up", reps: 5, sets: 4, rest: "1 min" },
    { name: "Skill Development: Advanced Tuck Front Lever Hold", duration: "5 sec", sets: 10, rest: "3 min" },
    { name: "Skill Development: Tuck Dragon Flag", reps: 2, sets: 8, rest: "3 min" },
    { name: "Skill Development: Tuck Front Lever Raises", reps: 2, sets: 10, rest: "2 min" },
    { name: "Resistance Training: Retractive Scapula Band Rows", reps: 5, sets: 4, rest: "1 min" },
    { name: "Cool Down: Pseudo Planche Scapula Push Ups", reps: 3, sets: 5, rest: "1 min" },
  ];
  
  const generateLateBeginnerFrontLeverSecondHalf = () => [
    { name: "Warm Up: Band Pull-Aparts", reps: 10, sets: 3, rest: "30 sec" },
    { name: "Activation: Horizontal Retractive Scapula Pull Up", reps: 5, sets: 4, rest: "1 min" },
    { name: "Skill Development: Advanced Tuck Front Lever Hold", duration: "3 sec", sets: 15, rest: "3 min" },
    { name: "Skill Development: Advanced Tuck Dragon Flag", reps: 1, sets: 10, rest: "3 min" },
    { name: "Skill Development: Tuck Front Lever Raises", reps: 2, sets: 10, rest: "2 min" },
    { name: "Resistance Training: Retractive Scapula Band Rows", reps: 5, sets: 4, rest: "1 min" },
    { name: "Cool Down: Pseudo Planche Scapula Push Ups", reps: 3, sets: 5, rest: "1 min" },
  ];  

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  

  if (!trainingPlan.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Unable To Load Training Plan</Text>
      </View>
    );
  }

  const handleStartNewCycle = async () => {
    try {
      // Set empty default values for AsyncStorage
      await AsyncStorage.setItem('selectedGoals', JSON.stringify([]));
      await AsyncStorage.setItem('strengthLevels', JSON.stringify({}));
      await AsyncStorage.setItem('responses', JSON.stringify({}));
  
      // Now navigate to the start new cycle page
      navigation.navigate('start_new_cycle');
    } catch (error) {
      console.error("Error resetting AsyncStorage for new cycle:", error);
    }
  };

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
                    <View style={styles.exerciseHeader}>
                      <Text style={styles.exerciseName}>{exercise.name}</Text>
                      <TouchableOpacity onPress={() => openImageModal(exercise.name)} style={styles.questionMarkButton}>
                        <Text style={styles.questionMark}>?</Text>
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.exerciseDetails}>
                      {exercise.reps ? `Reps: ${exercise.reps}` : `Duration: ${exercise.duration}`} | Sets: {exercise.sets} | Rest: {exercise.rest}
                    </Text>
                  </View>
                ))}
              </TouchableOpacity>
            ))}
          </View>
        ))}
        <View style={styles.container}>
        <TouchableOpacity style={styles.startNewCycleButton} onPress={handleStartNewCycle}>
          <Text style={styles.startNewCycleButtonText}>Start Next Cycle</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>

        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {imageSource ? (
                <Image
                  source={imageSource}
                  style={styles.modalImage}
                />
              ) : (
                <Text style={styles.errorMessage}>Image not available</Text>
              )}
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
    paddingBottom: 1500,
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
  startNewCycleButton: {
    position: 'absolute', // Position at the bottom of the screen
    bottom: 20, // Space from the bottom
    width: '90%', // Make the button take most of the width
    backgroundColor: '#1e90ff', // Blue background
    padding: 15,
    borderRadius: 10, // Rounded corners
    alignItems: 'center', // Center text inside the button
    justifyContent: 'center', // Center text vertically
    marginTop: 'auto', // Push the button to the bottom of the scrollable area
    marginBottom: -100, // Adjust this value to shift the button lower
  },
  startNewCycleButtonText: {
    color: '#ffffff', // White text
    fontSize: 18, // Text size
    fontWeight: 'bold', // Bold text
  },
  questionMark: {
    fontSize: 20,
    color: '#00bfff',
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalImage: {
    width: '100%',
    height: 200,
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#1e90ff',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exerciseName: {
    fontSize: 16,
    color: '#00bfff',
    flex: 1,
  },
  questionMarkButton: {
    marginLeft: 8,
    backgroundColor: '#00bfff',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionMark: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default TrainingPlan;