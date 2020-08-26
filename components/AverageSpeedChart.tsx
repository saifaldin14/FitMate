import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { VictoryChart, VictoryTheme, VictoryLine } from 'victory-native';
import todoColor from '../components/Colors';

const AverageSpeedChart = ({ avgSpeed }) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.text, { color: colors.text }]}>Average Speed</Text>
      <VictoryChart width={350} theme={VictoryTheme.material}>
        <VictoryLine
          data={avgSpeed}
          style={{
            data: { stroke: todoColor.blue },
            parent: { border: "1px solid #ccc" }
          }} />
      </VictoryChart>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    fontSize: 24,
    fontWeight: '800',
    paddingTop: 25
  }
});
export default AverageSpeedChart;