import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator, Text, ScrollView, FlatList } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Fire from '../api/Fire';
import todoColors from '../components/Colors';
import DistanceChart from '../components/DistanceChart';
import AverageSpeedChart from '../components/AverageSpeedChart';
import { Card, CardItem, Body } from 'native-base';

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
          <CardItem>
            <Body>
              <Text>{data.distance.toFixed(2)} km</Text>
              <Text>{data.averageSpeed.toFixed(2)} km/h</Text>
              <Text>{data.time}</Text>
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
      <View style={{ height: 275, paddingLeft: 32 }}>
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
  loadingContainer: {
    marginTop: 80,
    justifyContent: 'center'
  },
  text: {
    color: '#ffffff',
    fontSize: 16
  },
  loadingModelContainer: {
    flexDirection: 'row',
    marginTop: 10
  },
  imageWrapper: {
    width: 280,
    height: 280,
    padding: 10,
    borderColor: '#cf667f',
    borderWidth: 5,
    borderStyle: 'dashed',
    marginTop: 40,
    marginBottom: 10,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageContainer: {
    width: 250,
    height: 250,
    position: 'absolute',
    top: 10,
    left: 10,
    bottom: 10,
    right: 10
  },
  predictionWrapper: {
    height: 100,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center'
  },
  transparentText: {
    color: '#ffffff',
    opacity: 0.7
  },
  footer: {
    marginTop: 40
  },
  poweredBy: {
    fontSize: 20,
    color: '#e69e34',
    marginBottom: 6
  },
  tfLogo: {
    width: 125,
    height: 70
  }
});
