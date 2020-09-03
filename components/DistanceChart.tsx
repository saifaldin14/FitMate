import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { VictoryChart, VictoryBar, VictoryTheme, VictoryPolarAxis, VictoryAxis, VictoryLabel } from 'victory-native';
import todoColor from '../components/Colors';
import { Label } from 'native-base';

const DistanceChart = ({ defaultDistance, distance }) => {
  const { colors } = useTheme();
  const [data, setData] = useState(defaultDistance);

  useEffect(() => {
    setData(distance);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={[styles.text, { color: colors.text }]}>Distance</Text>
      <VictoryChart
        width={350}
        theme={VictoryTheme.material}
        domainPadding={20}
      >
        <VictoryBar
          style={{
            data: { fill: todoColor.lightBlue },
          }}
          animate={{ easing: 'exp' }}
          data={data}
          x="key"
          y="value"
        />
        <VictoryLabel x={125} y={340} text="Session Number" style={[styles.xAxis, { color: colors.text }]} />
        <VictoryLabel x={1} y={200} angle={270} text="Distance Travelled" style={[styles.yAxis, { color: colors.text }]} />
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
  },
  xAxis: {
    fontSize: 18
  },
  yAxis: {
    fontSize: 18,
  }

});
export default DistanceChart;