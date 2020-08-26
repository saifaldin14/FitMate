import React, { memo } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import MapView, { Polyline } from "react-native-maps";
import { useTheme } from 'react-native-paper';
import { mapDarkStyle, mapStandardStyle } from '../model/mapData';

const { width, height } = Dimensions.get('window')

export const Map = memo(props => {
  const theme = useTheme();

  var backGroundColor = '#404040';

  return (
    <MapView
      provider="google"
      style={styles.map}
      mapType='standard'
      customMapStyle={theme.dark ? mapDarkStyle : mapStandardStyle}
      showsUserLocation={true}
      followUserLocation={true}
      region={props.getRegion}
      tintColor='#404040'
      overlays={[{
        coordinates: props.routeCoordinates,
        strokeColor: '#F02A4B',
        lineWidth: 10,
      }]}
    >
      <Polyline
        coordinates={props.routeCoordinates}
        strokeColor='#F02A4B'
        strokeWidth={8}
      />
    </MapView>
  );
});

const styles = StyleSheet.create({
  map: {
    //flex: 0.7,
    width: width,
    height: height
  },
});

/*
<MapView
  style={styles.map}
  mapType='standard'
  showsUserLocation={true}
  followUserLocation={true}
  region={getMapRegion()}
>
  <Polyline
    coordinates={state.routeCoordinates}
    strokeColor='#19B5FE'
    strokeWidth={8}
  />
</MapView>*/