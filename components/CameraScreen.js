// Import necessary modules from React Navigation
import { createStackNavigator } from '@react-navigation/stack';

// Import your screens
import CameraScreen from './CameraScreen';
import Header from './Header';

// Create a stack navigator
const Stack = createStackNavigator();

// Define your navigation stack
function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Header" component={Header} options={{ headerShown: false }} />
      <Stack.Screen name="Camera" component={CameraScreen} />
      {/* Add other screens here */}
    </Stack.Navigator>
  );
}

export default AppStack;
