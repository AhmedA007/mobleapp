//Referenced: https://reactnative.dev/docs/navigation
 
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './App';
import Analytics from './Analytics';
import Assistant from './Assistant';
import Alarm from './Alarm';
 
const Stack = createStackNavigator();
 
const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Analytics" component={Analytics} />
        <Stack.Screen name="Assistant" component={Assistant} />
        <Stack.Screen name="Alarm" component={Alarm} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
 
export default Navigation;