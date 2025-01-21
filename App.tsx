import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import {NavigationContainer} from '@react-navigation/native';
import {AppProvider} from './src/context/AppContext';
import {Auth0Provider} from 'react-native-auth0';
import {AUTH0_CLIENT_ID, AUTH0_DOMAIN} from '@env';
import {LogBox} from 'react-native';

const App = () => {
  LogBox.ignoreAllLogs();
  return (
    <NavigationContainer>
      <Auth0Provider domain={AUTH0_DOMAIN} clientId={AUTH0_CLIENT_ID}>
        <AppProvider>
          <AppNavigator />
        </AppProvider>
      </Auth0Provider>
    </NavigationContainer>
  );
};

export default App;
