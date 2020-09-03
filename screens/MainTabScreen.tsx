import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { View } from 'react-native-animatable';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DetailsScreen from './DetailsScreen';
import EditProfileScreen from './EditProfileScreen';
import HomeScreen from './HomeScreen';
import ProfileScreen from './ProfileScreen';
import RunMapScreen from './RunMapScreen';

const HomeStack = createStackNavigator();
const DetailsStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const RunMapStack = createStackNavigator();

const Tab = createMaterialBottomTabNavigator();

const MainTabScreen = () => (
  <Tab.Navigator
    initialRouteName="Home"
    activeColor="#fff"
  >
    <Tab.Screen
      name="Home"
      component={HomeStackScreen}
      options={{
        tabBarLabel: 'Home',
        tabBarColor: '#009387',
        tabBarIcon: ({ color }) => (
          <Icon name="ios-home" color={color} size={26} />
        ),
      }}
    />
    <Tab.Screen
      name="Details"
      component={DetailsStackScreen}
      options={{
        tabBarLabel: 'Details',
        tabBarColor: '#1f65ff',
        tabBarIcon: ({ color }) => (
          <Icon name="ios-notifications" color={color} size={26} />
        ),
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileStackScreen}
      options={{
        tabBarLabel: 'Profile',
        tabBarColor: '#694fad',
        tabBarIcon: ({ color }) => (
          <Icon name="ios-person" color={color} size={26} />
        ),
      }}
    />
    <Tab.Screen
      name="RunMap"
      component={RunMapStackScreen}
      options={{
        tabBarLabel: 'RunMap',
        tabBarColor: '#d02860',
        tabBarIcon: ({ color }) => (
          <Icon name="ios-aperture" color={color} size={26} />
        ),
      }}
    />
  </Tab.Navigator>
);

export default MainTabScreen;

const HomeStackScreen = ({ navigation }) => (
  <HomeStack.Navigator screenOptions={{
    headerStyle: {
      backgroundColor: '#009387',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold'
    }
  }}>
    <HomeStack.Screen name="Home" component={HomeScreen} options={{
      title: 'Workout Programs',
      headerLeft: () => (
        <Icon.Button name="ios-menu" size={25} backgroundColor="#009387" onPress={() => navigation.openDrawer()}></Icon.Button>
      )
    }} />
  </HomeStack.Navigator>
);

const DetailsStackScreen = ({ navigation }) => (
  <DetailsStack.Navigator screenOptions={{
    headerStyle: {
      backgroundColor: '#1f65ff',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold'
    }
  }}>
    <DetailsStack.Screen name="Details" component={DetailsScreen} options={{
      headerLeft: () => (
        <Icon.Button name="ios-menu" size={25} backgroundColor="#1f65ff" onPress={() => navigation.openDrawer()}></Icon.Button>
      )
    }} />
  </DetailsStack.Navigator>
);

const ProfileStackScreen = ({ navigation }) => {
  const { colors } = useTheme();

  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#694fad',
          shadowColor: colors.background, // iOS
          elevation: 0, // Android
        },
        headerTintColor: colors.text,
      }}>
      <ProfileStack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: '',
          headerLeft: () => (
            <View style={{ marginLeft: 10 }}>
              <Icon.Button
                name="ios-menu"
                size={25}
                backgroundColor='#694fad'
                color='#fff'
                onPress={() => navigation.openDrawer()}
              />
            </View>
          ),
          headerRight: () => (
            <View style={{ marginRight: 10 }}>
              <MaterialCommunityIcons.Button
                name="account-edit"
                size={25}
                backgroundColor='#694fad'
                color='#fff'
                onPress={() => navigation.navigate('EditProfile')}
              />
            </View>
          ),
        }}
      />
      <ProfileStack.Screen
        name="EditProfile"
        options={{
          title: 'Edit Profile'
        }}
        component={EditProfileScreen}
      />
    </ProfileStack.Navigator>
  )
};

const RunMapStackScreen = ({ navigation }) => (
  <RunMapStack.Navigator screenOptions={{
    headerStyle: {
      backgroundColor: '#d02860',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold'
    }
  }}>
    <RunMapStack.Screen name="RunMap" component={RunMapScreen} options={{
      headerLeft: () => (
        <Icon.Button name="ios-menu" size={25} backgroundColor="#d02860" onPress={() => navigation.openDrawer()}></Icon.Button>
      )
    }} />
  </RunMapStack.Navigator>
);
