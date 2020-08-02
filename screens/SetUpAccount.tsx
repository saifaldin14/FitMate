import { useTheme } from '@react-navigation/native';
import React from 'react';
import { Button, StatusBar, StyleSheet, Text, View } from 'react-native';

const SetUpAccount = ({ navigation }) => {
  const { colors } = useTheme();

  const theme = useTheme();

  return (
    <View style={styles.container}>
      <StatusBar barStyle={theme.dark ? "light-content" : "dark-content"} />
      <Text style={{ color: colors.text }}>Set Up Account</Text>
      <Button
        title="Go to Login screen"
        onPress={() => navigation.navigate("SignInScreen")}
      />
    </View>
  );
};

export default SetUpAccount;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
});