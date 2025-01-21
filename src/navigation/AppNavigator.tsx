import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import AlertScreen from '../screens/Alert/AlertScreen';
import WatchlistScreen from '../screens/Watchlist/WatchlistScreen';
import {ChartScreen} from '../screens/Chart/ChartScreen';
import {useAuth0} from 'react-native-auth0';
import LoginScreen from '../screens/Login/LoginScreen';

const Stack = createStackNavigator();

function AppNavigator() {
  const {user} = useAuth0();

  const loggedIn = user !== undefined && user !== null;

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: {backgroundColor: '#000'},
      }}>
      {!loggedIn ? (
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
      ) : (
        <>
          <Stack.Screen name="WatchlistScreen" component={WatchlistScreen} />
          <Stack.Screen name="AlertScreen" component={AlertScreen} />
          <Stack.Screen name="ChartScreen" component={ChartScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default AppNavigator;
