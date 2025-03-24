import { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';
import { useWorkouts } from '@/hooks/useWorkouts';
import { useSettings } from '@/hooks/useSettings';
import { Beer } from 'lucide-react-native';

const CALORIES_PER_BEER = 150;

export default function CalculatorScreen() {
  const workouts = useWorkouts();
  const { settings } = useSettings();
  const [selectedWorkout, setSelectedWorkout] = useState('');
  const [duration, setDuration] = useState(30);

  const results = useMemo(() => {
    if (!selectedWorkout || !workouts.length) return null;

    const workout = workouts.find(w => w.workout === selectedWorkout);
    if (!workout) return null;

    const weightInKg = settings.unit === 'metric' 
      ? settings.weight 
      : settings.weight * 0.453592;

    const hours = duration / 60;
    const calories = weightInKg * workout.calories_per_kg_hour * hours;
    const beers = calories / CALORIES_PER_BEER;

    return {
      calories: Math.round(calories * 10) / 10,
      beers: Math.round(beers * 10) / 10
    };
  }, [selectedWorkout, duration, settings.weight, settings.unit, workouts]);

  const getMessage = (beers: number) => {
  const messages = {
    0: [
      "Keep pushing! You're almost at beer o'clock! 🏃‍♂️",
      "Just a bit more effort, and that frosty pint is yours! 🍺",
      "Don't stop now! The beer gods are watching! 🍻",
      "Almost there! That first sip is within reach!",
      "Push through! The reward is a cold one waiting for you!"
    ],
    1: [
      "Nice work! You've earned that cold one! 🍺",
      "Cheers to you! Enjoy your well-deserved beer! 🍻",
      "One beer coming right up for the champ! 🏆",
      "Great job! Time to savor that pint!",
      "You've hit the mark! Enjoy your brew!"
    ],
    2: [
      "Impressive! Time for a proper celebration! 🎉",
      "Two beers? You're on a roll! Keep it up! 🍺🍺",
      "Double the beers, double the fun! Cheers!",
      "Fantastic effort! Enjoy those two pints!",
      "You're brewing up success! Two beers earned!"
    ],
    3: [
      "Whoa! You're a beast! Party time! 🎊",
      "Three beers down! You're unstoppable! 🍺🍺🍺",
      "Triple threat! Enjoy those brews!",
      "Hat trick of beers! Keep the momentum!",
      "Three cheers for three beers! Well done!"
    ],
    4: [
      "Fantastic work! A beer hat would suit you now! 🧢",
      "Four beers earned! You're a legend in the making! 🍺🍺🍺🍺",
      "Quadruple cheers to you! Keep smashing those goals!",
      "Four pints for your phenomenal effort!",
      "You're on fire! Four beers well deserved!"
    ],
    5: [
      "You're on fire! Grab a six-pack and celebrate! 🔥",
      "Five beers? You're a beer-chieving superstar! 🍺🍺🍺🍺🍺",
      "High five! Enjoy those well-deserved brews!",
      "Five-fold success! Time to toast!",
      "Five stars for five beers! Outstanding!"
    ],
    6: [
      "Superb! You've unlocked the beer keg! 🛢️",
      "Six beers earned! Time to tap into the fun! 🍺🍺🍺🍺🍺🍺",
      "Half a dozen cheers to you! Keep it flowing!",
      "Six-pack secured! Celebrate your strength!",
      "Six sensational beers for your hard work!"
    ],
    7: [
      "Outstanding! Time for a beer tower challenge! 🗼",
      "Seven beers? You're stacking up the achievements! 🍺🍺🍺🍺🍺🍺🍺",
      "Lucky number seven! Cheers to your hard work!",
      "Seven wonders of beer! You've earned them!",
      "Seventh heaven! Enjoy your beers!"
    ],
    8: [
      "Incredible! You've reached beer pong champion status! 🏆",
      "Eight beers earned! You're the reigning beer pong master! 🍺🍺🍺🍺🍺🍺🍺🍺",
      "Elite eight! Time to celebrate your victory!",
      "Eight is great! Toast to your success!",
      "Octet of beers for your outstanding effort!"
    ],
    9: [
      "Phenomenal! A beer festival is in order! 🎪",
      "Nine beers? You're the life of the party! 🍺🍺🍺🍺🍺🍺🍺🍺🍺",
      "Ninth wonder of the beer world! Cheers to you!",
      "Nine cheers for nine beers! Exceptional!",
      "Cloud nine! Enjoy your well-earned beers!"
    ],
    10: [
      "Legendary performance! You've become the Beer King! 👑",
      "Ten beers earned! You're the ruler of the beer realm! 🍺🍺🍺🍺🍺🍺🍺🍺🍺🍺",
      "Deca-beer champion! Time to celebrate royally!",
      "Tenfold triumph! Raise your glass!",
      "Perfect ten! Enjoy your beers, legend!"
    ],
    1000000: [
      "You've reached the ultimate level: one million beers! 🏆",
      "One million beers achieved! You're a living legend! 🌟",
      "Incredible! You've unlocked the 'One Million Beers' status! 🍻",
      "A million beers milestone! Unbelievable achievement!",
      "Cheers to one million beers! You're in a league of your own!"
    ]
  };

  const beerLevel = beers >= 10 ? 10 : beers >= 1000000 ? 1000000 : Math.floor(beers);
  const randomIndex = Math.floor(Math.random() * messages[beerLevel].length);
  
  return messages[beerLevel][randomIndex];
};


  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Fitness to Beer Calculator</Text>
        
        <View style={styles.card}>
          <Text style={styles.label}>Select Workout</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedWorkout}
              onValueChange={setSelectedWorkout}
              style={styles.picker}>
              <Picker.Item label="Choose a workout..." value="" />
              {workouts.map((workout) => (
                <Picker.Item
                  key={workout.workout}
                  label={workout.workout}
                  value={workout.workout}
                />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>
            Duration: {duration} minutes
          </Text>
          <Slider
            style={styles.slider}
            minimumValue={5}
            maximumValue={360}
            step={5}
            value={duration}
            onValueChange={setDuration}
            minimumTrackTintColor="#3b82f6"
            maximumTrackTintColor="#e5e7eb"
          />

          {results && (
            <View style={styles.results}>
              <View style={styles.resultCard}>
                <Text style={styles.resultValue}>
                  {results.calories}
                </Text>
                <Text style={styles.resultLabel}>Calories Burned</Text>
              </View>

              <View style={styles.resultCard}>
                <View style={styles.beerContainer}>
                  <Text style={styles.resultValue}>
                    {results.beers}
                  </Text>
                  <Beer size={24} color="#3b82f6" style={styles.beerIcon} />
                </View>
                <Text style={styles.resultLabel}>Beers Earned</Text>
              </View>

              <Text style={styles.message}>
                {getMessage(results.beers)}
              </Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  content: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#1f2937',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#4b5563',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: '#f9fafb',
  },
  picker: {
    height: 50,
  },
  slider: {
    height: 40,
    marginBottom: 20,
  },
  results: {
    marginTop: 20,
    alignItems: 'center',
  },
  resultCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    width: '100%',
    alignItems: 'center',
  },
  resultValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  resultLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  beerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  beerIcon: {
    marginLeft: 8,
  },
  message: {
    fontSize: 16,
    color: '#4b5563',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
});