import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { VictoryChart, VictoryBar, VictoryTheme } from 'victory-native';
import todoColor from '../components/Colors';

const DistanceChart = ({ defaultDistance, distance }) => {
  // const data = [
  //   { quarter: 1, earnings: 13000 },
  //   { quarter: 2, earnings: 16500 },
  //   { quarter: 3, earnings: 14250 },
  //   { quarter: 4, earnings: 19000 }
  // ];
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
          style={{ data: { fill: todoColor.lightBlue } }}
          animate={{ easing: 'exp' }}
          data={data}
          x="key"
          y="value"
        />
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

});
export default DistanceChart;