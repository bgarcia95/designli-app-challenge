import React from 'react';
import {Pressable, Text, View} from 'react-native';
import {styles} from '../screens/Watchlist/styles';

const ListEmptyComponent = ({onPress}: {onPress: () => void}) => (
  <View style={styles.emptyContainer}>
    <Text>Start adding stocks to your watchlist.</Text>
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.textBlack}>Let's start!</Text>
    </Pressable>
  </View>
);

export default ListEmptyComponent;
