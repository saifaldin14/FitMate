import React, { memo } from 'react';
import { Button, Dimensions, StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'react-native-paper';
const { width, height } = Dimensions.get('window')

export const ModalView = memo(props => {
  const { colors } = useTheme();
  return (
    <View style={[styles.bottomBar, { backgroundColor: colors.background }]}>
      <View style={styles.bottomBarGroup}>
        <Text style={styles.bottomBarContent}>DURATION</Text>
        <Text style={styles.bottomBarContent}>{props.timeElapsed}</Text>
        <Text style={styles.bottomBarContent}>DISTANCE</Text>
        <Text style={styles.bottomBarContent}>{parseFloat(props.distanceTravelled).toFixed(2)} km</Text>
        <Text style={styles.bottomBarContent}>SPEED</Text>
        <Text style={styles.bottomBarContent}>{parseFloat(props.speed).toFixed(2)} km/h </Text>
        <Text style={styles.bottomBarContent}>AVERAGE SPEED</Text>
        <Text style={styles.bottomBarContent}>{parseFloat(props.averageSpeed).toFixed(2)} km/h </Text>
      </View>
      <Button style={styles.bottomBarContent} color="#F02A4B" title="Hide" onPress={props.toggleModal} />
    </View>
  );
});

const styles = StyleSheet.create({
  bottomBar: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    height: '40%',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    flexWrap: 'wrap',
    flexDirection: 'row'
    /*
    position: 'absolute',
    height: 100,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    width: width,
    padding: 20,
    flexWrap: 'wrap',
    flexDirection: 'row'*/
  },
  bottomBarGroup: {
    flex: 1
  },
  bottomBarHeader: {
    color: '#fff',
    fontWeight: "400",
    textAlign: 'center'
  },
  bottomBarContent: {
    color: '#fff',
    fontWeight: "700",
    fontSize: 18,
    marginTop: 10,
    color: '#f35872',
    //textAlign: 'center'
  },
  timer: {
    color: '#fff',
    fontWeight: "700",
    fontSize: 32,
    marginTop: 10,
    color: '#f35872',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalView: {
    justifyContent: 'flex-end',
    margin: 0,
  },
});