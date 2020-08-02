import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Animated, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';

export default class FloatingButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isPlay: true,
    };
  }

  animation = new Animated.Value(0);

  toggleMenu = () => {
    //this.setState({ isPlay: !this.state.isPlay })
    const toValue = this.open ? 0 : 1;
    Animated.spring(this.animation, {
      toValue,
      friction: 5
    }).start();
    this.open = !this.open;
  }

  changePlay = () => {
    this.setState({ isPlay: !this.state.isPlay })
    this.toggleMenu();
  }

  render() {
    const pinStyle = {
      transform: [
        { scale: this.animation },
        {
          translateY: this.animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -80]
          })
        }
      ]
    }
    const heartStyle = {
      transform: [
        { scale: this.animation },
        {
          translateY: this.animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -140]
          })
        }
      ]
    }
    const rotation = {
      transform: [
        {
          rotate: this.animation.interpolate({
            inputRange: [0, 1],
            outputRange: ["0deg", "45deg"]
          })
        }
      ]
    }

    const opacity = this.animation.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 0, 1]
    })

    return (
      <View style={[styles.container, this.props.style]}>
        <TouchableWithoutFeedback
          onPress={this.props.toggleModal}>
          <Animated.View style={[styles.button, styles.secondary, heartStyle, opacity]}>
            <AntDesign name='hearto' size={20} color='#F02A4B' />
          </Animated.View>
        </TouchableWithoutFeedback>

        {this.state.isPlay === true && (
          <TouchableWithoutFeedback
            onPress={this.props.openIsActive}
            onPressOut={this.changePlay}>
            <Animated.View style={[styles.button, styles.secondary, pinStyle, opacity]}>
              {/*<Entypo name='location-pin' size={20} color='#F02A4B' />*/}
              <MaterialIcons name="directions-run" size={20} color="#F02A4B" />
            </Animated.View>
          </TouchableWithoutFeedback>
        )}
        {this.state.isPlay === false && (
          <TouchableWithoutFeedback
            onPress={this.props.openIsActive}
            onPressOut={this.changePlay}
            onLongPress={this.props.endRun}>
            <Animated.View style={[styles.button, styles.secondary, pinStyle, opacity]}>
              {/*<Entypo name='location-pin' size={20} color='#F02A4B' />*/}
              <AntDesign name="pause" size={20} color="#F02A4B" />
            </Animated.View>
          </TouchableWithoutFeedback>
        )}

        <TouchableWithoutFeedback onPress={this.toggleMenu}>
          <Animated.View style={[styles.button, styles.menu, rotation]}>
            <AntDesign name='plus' size={24} color='#FFF' />
          </Animated.View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    position: 'absolute',
  },
  button: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 60 / 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowRadius: 10,
    shadowColor: '#F02A4B',
    shadowOpacity: 0.3,
    shadowOffset: { height: 10 }

  },
  menu: {
    backgroundColor: '#F02A4B',
  },
  secondary: {
    width: 48,
    height: 48,
    borderRadius: 48 / 2,
    backgroundColor: '#FFF',
  },
});