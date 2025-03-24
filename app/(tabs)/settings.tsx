import { View, Text, StyleSheet, TextInput, Platform, Pressable } from 'react-native';
import { useSettings } from '@/hooks/useSettings';
import { useState } from 'react';

export default function SettingsScreen() {
  const { settings, updateSettings } = useSettings();
  const [weight, setWeight] = useState(settings.weight.toString());

  const handleWeightChange = (text: string) => {
    setWeight(text);
    const numWeight = parseFloat(text);
    if (!isNaN(numWeight) && numWeight > 0) {
      updateSettings({ weight: numWeight });
    }
  };

  const toggleUnit = () => {
    const newUnit = settings.unit === 'metric' ? 'imperial' : 'metric';
    const newWeight = settings.unit === 'metric'
      ? Math.round(settings.weight * 2.20462)
      : Math.round(settings.weight / 2.20462);
    
    updateSettings({ unit: newUnit, weight: newWeight });
    setWeight(newWeight.toString());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Your Weight</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={weight}
            onChangeText={handleWeightChange}
            keyboardType="numeric"
            placeholder="Enter your weight"
          />
          <Pressable onPress={toggleUnit} style={styles.unitButton}>
            <Text style={styles.unitButtonText}>
              {settings.unit === 'metric' ? 'kg' : 'lbs'}
            </Text>
          </Pressable>
        </View>

        <Text style={styles.hint}>
          Tap the unit button to switch between metric and imperial
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: '#f9fafb',
    marginRight: 8,
  },
  unitButton: {
    backgroundColor: '#3b82f6',
    height: 50,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  hint: {
    fontSize: 14,
    color: '#6b7280',
    fontStyle: 'italic',
  },
});