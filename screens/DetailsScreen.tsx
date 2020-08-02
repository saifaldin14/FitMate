import { useTheme } from '@react-navigation/native';
import * as mobilenet from "@tensorflow-models/mobilenet";
import '@tensorflow/tfjs-backend-webgl';
import React, { useReducer, useRef, useState } from 'react';
import { Button, FlatList, StyleSheet, Text, View } from 'react-native';
import { ListItem } from 'react-native-elements';
import ProfileImagePicker from '../components/ProfileImagePicker';

const machine = {
  initial: "initial",
  states: {
    initial: { on: { next: "loadingModel" } },
    loadingModel: { on: { next: "modelReady" } },
    modelReady: { on: { next: "imageReady" } },
    imageReady: { on: { next: "identifying" }, showImage: true },
    identifying: { on: { next: "complete" } },
    complete: { on: { next: "modelReady" }, showImage: true, showResults: true }
  }
};

const DetailsScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [results, setResults] = useState([]);
  const [imageURL, setImageURL] = useState(null);
  const [model, setModel] = useState(null);
  const imageRef = useRef();
  const inputRef = useRef();

  const reducer = (state, event) =>
    machine.states[state].on[event] || machine.initial;

  const [appState, dispatch] = useReducer(reducer, machine.initial);
  const next = () => dispatch("next");

  const loadModel = async () => {
    next();
    const model = await mobilenet.load();
    setModel(model);
    next();
  };

  const identify = async () => {
    next();
    const results = await model.classify(imageRef.current);
    setResults(results);
    next();
  };

  const reset = async () => {
    setResults([]);
    next();
  };

  const upload = () => inputRef.current.click();

  const handleUpload = event => {
    const { files } = event.target;
    if (files.length > 0) {
      const url = URL.createObjectURL(event.target.files[0]);
      setImageURL(url);
      next();
    }
  };

  const actionButton = {
    initial: { action: loadModel, text: "Load Model" },
    loadingModel: { text: "Loading Model..." },
    modelReady: { action: upload, text: "Upload Image" },
    imageReady: { action: identify, text: "Identify Breed" },
    identifying: { text: "Identifying..." },
    complete: { action: reset, text: "Reset" }
  };

  const { showImage, showResults } = machine.states[appState];


  return (
    <View style={styles.container}>
      <Text style={{ color: colors.text }}>Details Screen</Text>
      <Button
        title="Go to details screen...again"
        onPress={() => navigation.push("Details")}
      />
      <Button
        title="Go to home"
        onPress={() => navigation.navigate("Home")}
      />
      <Button
        title="Go back"
        onPress={() => navigation.goBack()}
      />
      <ProfileImagePicker image={imageURL} onImagePicked={handleUpload} />
      {showResults && (
        <FlatList>
          {results.map(({ className, probability }) => (
            <ListItem key={className}>{`${className}: %${(probability * 100).toFixed(
              2
            )}`}</ListItem>
          ))}
        </FlatList>
      )}
      <Button onPress={actionButton[appState].action || (() => { })}>
        {actionButton[appState].text}
      </Button>
    </View>
  );
};

export default DetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
});
