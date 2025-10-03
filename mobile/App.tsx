import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TemplateListScreen from './src/screens/TemplateListScreen';
import AuditFormScreen from './src/screens/AuditFormScreen';
import AuditSuccessScreen from './src/screens/AuditSuccessScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="TemplateList"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0f172a',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="TemplateList"
          component={TemplateListScreen}
          options={{ title: 'Audit Templates' }}
        />
        <Stack.Screen
          name="AuditForm"
          component={AuditFormScreen}
          options={{ title: 'Complete Audit' }}
        />
        <Stack.Screen
          name="AuditSuccess"
          component={AuditSuccessScreen}
          options={{ title: 'Success', headerLeft: () => null }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
