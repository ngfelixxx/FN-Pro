import { Stack, Slot } from 'expo-router';

const RootLayout = () => {
  return (
    <Stack screenOptions={{
      headerStyle: { backgroundColor: '#121212' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold' }
    }}>
      <Stack.Screen name="index" options={{ title: 'FN-Calisthenics' }} />
      <Slot />
    </Stack>
  );
};

export default RootLayout;
