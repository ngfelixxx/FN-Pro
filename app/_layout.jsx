import { Stack, Slot } from 'expo-router';

const RootLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#121212' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      {/* Each child screen must be wrapped in a Screen component */}
      <Stack.Screen name="index" options={{ title: 'FN-Calisthenics' }} />
      <Stack.Screen name="training_plan" options={{ title: 'Training Plan' }} />
      
      {/* Use Slot to render children */}
      <Slot />
    </Stack>
  );
};

export default RootLayout;
