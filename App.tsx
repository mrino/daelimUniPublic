import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import MainScreen from "./screens/main-screen";

import EmergencyRoomScreen from "./screens/emergency-room/emergency-room-screen";

import EmergencyConditionSearchScreen from "./screens/emergency-condition-search/emergency-condition-search-screen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={MainScreen} />

        <Stack.Screen
          name="EmergencyRoomScreen"
          component={EmergencyRoomScreen}
        />

        <Stack.Screen
          name="EmergencyConditionSearchScreen"
          component={EmergencyConditionSearchScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
