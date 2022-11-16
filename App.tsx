import 'react-native-gesture-handler';
import React from 'react';
// import { Theme, ThemeProvider } from 'react-native-elements';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack';
import { ApolloProvider } from '@apollo/client';
import WelcomeScreen from './screens/Welcome';
import LoginScreen from './screens/Login';
import RegisterScreen from './screens/Register';
import HomeScreen from './screens/Home';
import GameScreen from './screens/Game';
import client from './apollo-client';
import useStore from './stores';

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Game: undefined;
}

const Stack = createStackNavigator<RootStackParamList>();

const generalHeaderOptions: StackNavigationOptions = {
  headerShown: false,
};

export default function App() {
  const token = useStore((state: any) => state.token);
  return (
    <ApolloProvider client={client}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={generalHeaderOptions}>
          {
            token
              ? (
                <>
                  <Stack.Screen name="Home" component={HomeScreen} />
                  <Stack.Screen name="Game" component={GameScreen} />
                </>
              )
              : (
                <>
                  <Stack.Screen name="Welcome" component={WelcomeScreen} />
                  <Stack.Screen name="Login" component={LoginScreen} />
                  <Stack.Screen name="Register" component={RegisterScreen} />
                </>
              )
          }
        </Stack.Navigator>
      </NavigationContainer>
    </ApolloProvider>
  );
}
