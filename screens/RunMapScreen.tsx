import * as firebase from "firebase";
import haversine from "haversine";
import * as _ from "lodash";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Alert, Button, Dimensions, StyleSheet, View } from "react-native";
import Modal from "react-native-modal";
import { useTheme } from "react-native-paper";
import FloatingButton from "../components/FloatingButton";
import { Map } from "../components/Map";
import { ModalView } from "../components/ModalView";
import GetLocation from "react-native-get-location";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
import Fire from "../api/Fire";
import { mapDarkStyle, mapStandardStyle } from "../model/mapData";
// import Geolocation from '@react-native-community/geolocation';

// Geolocation.setRNConfiguration(config);
const { width, height } = Dimensions.get("window");
const LATITUDE_DELTA = 0.007;
const LONGITUDE_DELTA = 0.007;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;

// const LOCATION_SETTINGS = {
//   accuracy: Location.Accuracy.Balanced,
//   timeInterval: 200,
//   distanceInterval: 0,
// };

let email = "ttt";

const RunMapScreen = ({ navigation }) => {
  const paperTheme = useTheme();
  //const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [state, setState] = useState({
    isActive: false,
    close: true,
    routeCoordinates: [],
    distanceTravelled: 0,
    prevLatLng: {},
    latitude: LATITUDE,
    longitude: LONGITUDE,
    seconds: 0,
    now: moment(),
    then: moment(),
    timeElapsed: "00:00:00",
    startCounter: 0,
    speedCounter: 1,
    speed: 0,
    averageSpeed: 0,
    isModalVisible: false,
    email: "grt",
  });
  const [isModalVisible, setModalVisible] = useState(false);
  useEffect(() => {
    async function getPos() {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied. Unable to track run");
      }
    }
    getPos();
  }, []);

  useEffect(() => {
    let watchId: any;
    watchId = navigator.geolocation.watchPosition(
      (position) => {
        handleUpdates(
          position,
          position.coords.latitude,
          position.coords.longitude,
          position.coords.speed
        );
      },
      (error) => {
        console.log(error);
      }
    );

    return () => {
      // this.watchId.remove();
      navigator.geolocation.clearWatch(watchId);
    };
  }, [state]);

  const handleUpdates = (position, lat, long, speedVal) => {
    const newLatLngs = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };
    const positionLatLngs = _.pick(position.coords, ["latitude", "longitude"]);
    setState((state) => ({ ...state, latitude: lat, longitude: long }));
    //setRouteCoordinates(routeCoordinates.concat(positionLatLngs))
    if (state.isActive) {
      setState((state) => ({
        ...state,
        routeCoordinates: state.routeCoordinates.concat(positionLatLngs),
        distanceTravelled: state.distanceTravelled + calcDistance(newLatLngs),
        prevLatLng: newLatLngs,
        now: moment(),
        timeElapsed: moment
          .utc(
            moment(state.now, "DD/MM/YYYY HH:mm:ss").diff(
              moment(state.then, "DD/MM/YYYY HH:mm:ss")
            )
          )
          .format("HH:mm:ss"),
        speedCounter: state.speedCounter + 1,
        speed: speedVal,
        averageSpeed:
          (state.averageSpeed * (state.speedCounter - 1) + state.speed) /
          state.speedCounter,
      }));
    }
  };

  const calcDistance = (newLatLng) => {
    const prevLatLng = state.prevLatLng;
    return haversine(prevLatLng, newLatLng) || 0;
  };

  const openIsActive = () => {
    let now;
    if (!state.isActive && state.startCounter === 0) {
      setState((state) => {
        return {
          ...state,
          timeElapsed: moment.duration(state.now.diff(state.then)),
          then: moment(),
          startCounter: 1,
        };
      });
    } else if (state.isActive && state.startCounter === 1) {
      now = { ...state.now };
    } else if (!state.isActive && state.startCounter === 1) {
      let then = { ...state.then };
      let diff = -state.now.diff(now);
      setState((state) => ({ ...state, then: moment(then).add(diff) }));
    }
    setState((state) => ({ ...state, isActive: !state.isActive }));
    //toggleModal();
  };

  const saveData = () => {
    let f = new Fire((error, user) => {
      f.addRun({
        distance: state.distanceTravelled,
        time: state.timeElapsed,
        speed: state.speed,
        averageSpeed: state.averageSpeed,
      });
    });

    setState((state) => ({
      ...state,
      isActive: false,
      routeCoordinates: [],
      distanceTravelled: 0,
      prevLatLng: {},
      seconds: 0,
      now: moment(),
      then: moment(),
      timeElapsed: "00:00:00",
      startCounter: 0,
      speedCounter: 1,
      speed: 0,
      averageSpeed: 0,
    }));
    navigation.navigate("Details");
  };

  const endRun = () => {
    if (state.isActive) {
      setState((state) => ({ ...state, isActive: false }));
      Alert.alert(
        "End Run",
        "Do you want to end the run?",
        [
          {
            text: "Cancel",
            onPress: () => {
              setState((state) => ({ ...state, isActive: true }));
            },
            style: "cancel",
          },
          {
            text: "OK",
            onPress: () => saveData(),
          },
        ],
        { cancelable: false }
      );
    } else {
      Alert.alert(
        "Error",
        "You cannot end run that hasn't started",
        [
          {
            text: "OK",
            //onPress: () => toggleModal(),
            style: "cancel",
          },
        ],
        { cancelable: false }
      );
    }
  };

  const toggleModal = () => {
    setState((state) => ({ ...state, isModalVisible: !state.isModalVisible }));
  };

  useEffect(() => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then((pos) => {
        setState((state) => ({
          ...state,
          latitude: pos.latitude,
          longitude: pos.longitude,
        }));
      })
      .catch((error) => {
        const { code, message } = error;
        console.log(code, message);
      });
  });

  const getMapRegion = () => ({
    latitude: state.latitude,
    longitude: state.longitude,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });
  const { colors } = useTheme();

  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Map
        routeCoordinates={state.routeCoordinates}
        getRegion={getMapRegion()}
      />

      <Button title="Show modal" onPress={toggleModal} />

      <Modal
        testID={"modal"}
        isVisible={state.isModalVisible}
        onSwipeComplete={() => {
          setModalVisible(false);
        }}
        swipeDirection={["up", "left", "right", "down"]}
        style={styles.modalView}
      >
        <ModalView
          timeElapsed={state.timeElapsed}
          distanceTravelled={state.distanceTravelled}
          speed={state.speed}
          averageSpeed={state.averageSpeed}
          toggleModal={toggleModal}
        />
      </Modal>
      <FloatingButton
        openIsActive={openIsActive}
        endRun={endRun}
        toggleModal={toggleModal}
        style={{ bottom: 100 }}
        themeColors={colors}
      />
    </View>
  );
};

export default RunMapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  navBar: {
    backgroundColor: "rgba(0,0,0,0.7)",
    height: 64,
    width: width,
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  navBarText: {
    color: "#19B5FE",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    paddingTop: 30,
  },
  map: {
    //flex: 0.7,
    width: width,
    height: height,
  },
  modalView: {
    justifyContent: "flex-end",
    margin: 0,
  },
});
