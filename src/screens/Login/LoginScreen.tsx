import React from 'react';
import {View, Text, Pressable} from 'react-native';
import {useAuth0} from 'react-native-auth0';
import {styles} from './styles';

const LoginScreen = () => {
  const {authorize} = useAuth0();

  const onLogin = async () => {
    try {
      await authorize();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.instructionText}>
        Stay on top of the market—anytime, anywhere. 📈
      </Text>
      {/* <Text style={styles.subtitle}>Log in now to track your stocks!</Text> */}
      <Pressable onPress={onLogin} style={styles.button}>
        <Text style={styles.btnText}>Log in</Text>
      </Pressable>
    </View>
  );
};

export default LoginScreen;
