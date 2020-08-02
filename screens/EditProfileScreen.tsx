import { useTheme } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import ProfileForm from '../components/ProfileForm';
//To implement live workout visit:
//https://pusher.com/tutorials/workout-tracker-react-native#creating-a-pusher-app

const EditProfileScreen = ({ props, route, navigation }) => {
  const { colors } = useTheme();

  const theme = useTheme();
  const [data, setData] = useState({
    name: '',
    birthday: '',
    weight: '',
  })

  const dataAddedCallback = route.params?.dataAddedCallback;
  //const currFood = route.params?.food;
  //const route = useRoute();

  useEffect(() => {
    const currentData = route.params?.data;

    if (currentData) {
      //setState(state => ({
      //...state, }))
      setData(currentData);
    }
  });

  const onDataUpdated = (data) => {
    //console.log(data);
    navigation.popToTop();
  }
  return (
    <ProfileForm
      data={data}
      onDataAdded={dataAddedCallback}
      onDataUpdated={onDataUpdated}
    />
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
});

/*}
    <View style={styles.container}>
      <StatusBar barStyle={theme.dark ? "light-content" : "dark-content"} />
      <Text style={{ color: colors.text }}>Set Up Account</Text>
      <Button
        title="Go to Login screen"
        onPress={() => navigation.navigate("Profile")} // Don't forget to change profile with SignInScreen
      />
  </View>*/
