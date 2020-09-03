import { useTheme } from '@react-navigation/native';
import React from 'react';
import {
    Dimensions,
    StatusBar, StyleSheet, Text,
    TouchableOpacity, View
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Animated from 'react-native-reanimated';

const SplashScreen = ({ navigation }) => {
    const { colors } = useTheme();

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor='#009387' barStyle="light-content" />
            <View style={styles.header}>
                <Animatable.Image
                    animation="bounceIn"
                    duraton="1500"
                    source={require('../assets/logo.png')}
                    style={styles.logo}
                    resizeMode="stretch"
                />
                <Animatable.Text
                    animation="bounceIn"
                    style={[styles.title, { color: 'white' }]}
                >
                    FitMate
                </Animatable.Text>
            </View>
            <Animatable.View
                style={[styles.footer, {
                    backgroundColor: colors.background
                }]}
                animation="fadeInUpBig"
            >
                <Text style={[styles.title, {
                    color: colors.text
                }]}>Your Handy Fitness Pal!</Text>
                <View style={styles.button}>
                    <TouchableOpacity onPress={() => navigation.navigate('SignInScreen')}>
                        <Text style={styles.textSign}>Get Started</Text>
                        {/* <MaterialIcons
                            name="navigate-next"
                            color="#fff"
                            size={20}
                        /> */}
                    </TouchableOpacity>
                </View>
            </Animatable.View>
        </View>
    );
};

export default SplashScreen;

const { height } = Dimensions.get("screen");
const height_logo = height * 0.35;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#009387'
    },
    header: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    footer: {
        flex: 1,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingVertical: 50,
        paddingHorizontal: 30
    },
    logo: {
        width: height_logo,
        height: height_logo
    },
    title: {
        color: '#05375a',
        fontSize: 30,
        fontWeight: 'bold'
    },
    text: {
        color: 'grey',
        marginTop: 5
    },
    button: {
        backgroundColor: '#009387',
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginTop: 60
    },
    textSign: {
        fontSize: 24,
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold'
    }
});

