import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';

const SupportScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Support Screen</Text>
      <Button
        title="Click Here"
        onPress={() => Alert.alert('Button Clicked!')}
      />
    </View>
  );
};

export default SupportScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
});
