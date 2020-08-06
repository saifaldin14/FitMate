import { useTheme } from '@react-navigation/native';
import * as mobilenet from '@tensorflow-models/mobilenet';
import * as tf from '@tensorflow/tfjs';
import { fetch } from '@tensorflow/tfjs-react-native';
import Constants from 'expo-constants';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import * as jpeg from 'jpeg-js';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,



  Alert,
  Button, Image, StatusBar, StyleSheet,
  Text,




  TouchableOpacity, View
} from 'react-native';

const DetailsScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [isTfReady, setIsTfReady] = useState(false);
  const [isModelReady, setIsModelReady] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [image, setImage] = useState(null);
  const [model, setModel] = useState(null);

  useEffect(() => {
    loadTf();
  }, []);

  const loadTf = async () => {
    await tf.ready()
    setIsTfReady(true);
    const tempModel = await mobilenet.load()
    setModel(tempModel);
    setIsModelReady(true);
    getPermissionAsync();
  };

  const getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL)
      if (status !== 'granted') {
        Alert.alert('Sorry, we need camera roll permissions to make this work!')
      }
    }
  }

  const imageToTensor = (rawImageData) => {
    const TO_UINT8ARRAY = true
    const { width, height, data } = jpeg.decode(rawImageData, TO_UINT8ARRAY)
    // Drop the alpha channel info for mobilenet
    const buffer = new Uint8Array(width * height * 3)
    let offset = 0 // offset into original data
    for (let i = 0; i < buffer.length; i += 3) {
      buffer[i] = data[offset]
      buffer[i + 1] = data[offset + 1]
      buffer[i + 2] = data[offset + 2]

      offset += 4
    }

    return tf.tensor3d(buffer, [height, width, 3])
  }

  const classifyImage = async () => {
    try {
      const imageAssetPath = Image.resolveAssetSource(image)
      const response = await fetch(imageAssetPath.uri, {}, { isBinary: true })
      const rawImageData = await response.arrayBuffer()
      const imageTensor = imageToTensor(rawImageData)
      const predictions = await model.classify(imageTensor)
      setPrediction(predictions);
      console.log(predictions)
    } catch (error) {
      console.log(error)
    }
  }

  const selectImage = async () => {
    try {
      let response = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3]
      })

      if (!response.cancelled) {
        const source = { uri: response.uri }
        setImage(source);
        classifyImage()
      }
    } catch (error) {
      console.log(error)
    }
  }

  const renderPrediction = prediction => {
    return (
      <Text key={prediction.className} style={styles.text}>
        {prediction.className}
      </Text>
    )
  }
  return (
    <View style={styles.container}>
      <StatusBar barStyle='light-content' />
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
      <View style={styles.loadingContainer}>
        <Text style={styles.text}>
          TFJS ready? {isTfReady ? <Text>✅</Text> : ''}
        </Text>

        <View style={styles.loadingModelContainer}>
          <Text style={styles.text}>Model ready? </Text>
          {isModelReady ? (
            <Text style={styles.text}>✅</Text>
          ) : (
              <ActivityIndicator size='small' />
            )}
        </View>
      </View>
      <TouchableOpacity
        style={styles.imageWrapper}
        onPress={isModelReady ? selectImage : undefined}>
        {image && <Image source={image} style={styles.imageContainer} />}

        {isModelReady && !image && (
          <Text style={styles.transparentText}>Tap to choose image</Text>
        )}
      </TouchableOpacity>
      <View style={styles.predictionWrapper}>
        {isModelReady && image && (
          <Text style={styles.text}>
            Predictions: {prediction ? '' : 'Predicting...'}
          </Text>
        )}
        {isModelReady &&
          prediction &&
          prediction.map(p => renderPrediction(p))}
      </View>
    </View>
  );
};

export default DetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#171f24',
    alignItems: 'center'
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
