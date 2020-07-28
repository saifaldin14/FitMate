import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import SetUpAccount from './SetUpAccount';
import SignInScreen from './SignInScreen';
import SignUpScreen from './SignUpScreen';
import SplashScreen from './SplashScreen';



const RootStack = createStackNavigator();

const RootStackScreen = ({ navigation }) => (
    <RootStack.Navigator headerMode='none'>
        <RootStack.Screen name="SplashScreen" component={SplashScreen} />
        <RootStack.Screen name="SignInScreen" component={SignInScreen} />
        <RootStack.Screen name="SignUpScreen" component={SignUpScreen} />
        <RootStack.Screen name="SetUpAccount" component={SetUpAccount} />
    </RootStack.Navigator>
);

export default RootStackScreen;