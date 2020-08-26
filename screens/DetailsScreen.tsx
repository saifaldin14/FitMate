import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator, Text, ScrollView, FlatList } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Fire from '../api/Fire';
import todoColors from '../components/Colors';
import DistanceChart from '../components/DistanceChart';
import AverageSpeedChart from '../components/AverageSpeedChart';
import { Card, CardItem, Body } from 'native-base';
import todoColor from '../components/Colors';

const DetailsScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [run, setRun] = useState([]);
  const [loading, setLoading] = useState(true);
  const [distanceGraph, setDistanceGraph] = useState([]);
  const [defDistanceGraph, setDefDistanceGraph] = useState([]);
  const [avgSpeedGraph, setAvgSpeedGraph] = useState([]);

  useEffect(() => {
    let firebase = new Fire((error, user) => {
      if (error) {
        return Alert.alert("Uh oh, something went wrong!");
      }

      firebase.getRun(theRun => {
        // theRun.forEach(data => {
        //   //distance.push(data.distance);
        // });
        setRun(theRun);
        let distance = [];
        let defaultDistance = [];
        let averageSpeed = [];
        var i;
        for (i = 0; i < theRun.length; i++) {
          var objDist = {};
          var objAvgSpd = {};
          objDist[i + 1] = theRun[i].distance;
          objAvgSpd[i + 1] = theRun[i].averageSpeed;
          //var obj = { i: theRun[i].distance };
          distance.push({
            key: i + 1,
            value: theRun[i].distance
          });

          defaultDistance.push({
            key: i + 1,
            value: 0
          });

          averageSpeed.push({
            x: i + 1,
            y: theRun[i].averageSpeed
          });
        }
        setDistanceGraph(distance);
        setDefDistanceGraph(defaultDistance);
        setAvgSpeedGraph(averageSpeed);

        setLoading(false);
      });
    });
    // makeGraphData(run);

    return () => {
      firebase.detach();
    }
  }, []);

  const renderItem = data => {
    return (
      <View>
        <Card>
          <CardItem style={{ backgroundColor: colors.background }}>
            <Body>
              <Text style={[styles.text, { color: colors.text }]}>Distance: {data.distance.toFixed(2)} km</Text>
              <Text style={[styles.text, { color: colors.text }]}>Average Speed: {data.averageSpeed.toFixed(2)} km/h</Text>
              <Text style={[styles.text, { color: colors.text }]}>Time: {data.time}</Text>
            </Body>
          </CardItem>
        </Card>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={todoColors.blue} />
      </View>
    );
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <DistanceChart
          defaultDistance={defDistanceGraph}
          distance={distanceGraph}
        />
        <AverageSpeedChart avgSpeed={avgSpeedGraph} />
      </View>
      <View style={{ padding: 15 }}>
        <Text style={[styles.textHeader, { color: colors.text }]}>Running History</Text>
        <FlatList
          data={run}
          keyExtractor={item => item.id.toString()}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => renderItem(item)}
          keyboardShouldPersistTaps="always"
        />
      </View>
    </ScrollView>
  );
};

export default DetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    fontSize: 16,
    fontWeight: '300',
    padding: 5
  },
  textHeader: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '800',
    paddingTop: 25
  }
});
