import Constants from 'expo-constants';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import firebase from 'firebase';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ImageBackground,
  Platform, StyleSheet, Text,
  TouchableOpacity, View
} from 'react-native';
import Modal from 'react-native-modal';
import { useTheme } from 'react-native-paper';
import Animated from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ProfileImagePicker = ({ image, onImagePicked }) => {

  const [selectedImage, setSelectedImage] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { colors } = useTheme();

  useEffect(() => {
    if (image) {
      //console.log("useEffect: " + image);
      setSelectedImage({ uri: image });
    }
    getPermissionAsync();
  }, [image])

  const getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        Alert.alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  };

  const pickImageHandler = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        setSelectedImage({ uri: result.uri });
        onImagePicked({ uri: result.uri });
        firebase.auth().onAuthStateChanged(async (user) => {
          //var ref = firebase.database().ref(user.email.replace('.', ''));
          uploadImage(result.uri, user.email.replace('.', '')).then(() => {
            Alert.alert("Success");
          })
            .catch((error) => {
              Alert.alert(error);
            });
        });
      }

      console.log(result);
      setIsModalVisible(!isModalVisible);
    } catch (E) {
      console.log(E);
    }
  };
  const uploadImage = async (uri, imageName) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    var ref = firebase.storage().ref().child("images/" + imageName);
    return ref.put(blob);
  }

  const fall = new Animated.Value(1);

  return (
    <View style={styles.container}>
      {/*<View style={styles.imageContainer}>
        <Image source={selectedImage} style={styles.previewImage} />
      </View>*/}
      <Animated.View style={{
        margin: 20,
        opacity: Animated.add(0.1, Animated.multiply(fall, 1.0)),
      }}>
        <TouchableOpacity onPress={() => setIsModalVisible(!isModalVisible)}>
          <View
            style={{
              height: 100,
              width: 100,
              borderRadius: 15,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <ImageBackground
              source={selectedImage}
              style={{ height: 100, width: 100 }}
              imageStyle={{ borderRadius: 15 }}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Icon
                  name="camera"
                  size={35}
                  //color="#fff"
                  style={{
                    color: colors.text,
                    opacity: 0.7,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 1,
                    borderColor: '#fff',
                    borderRadius: 10,
                  }}
                />
              </View>
            </ImageBackground>
          </View>
        </TouchableOpacity>
        {/*<View style={styles.button}>
          <Button title="Pick Image" onPress={pickImageHandler} />
                </View>*/}

      </Animated.View>
      <Modal testID={'modal'}
        isVisible={isModalVisible}
        onSwipeComplete={() => { setIsModalVisible(false) }}
        swipeDirection={['up', 'left', 'right', 'down']}
        style={styles.modalView}>
        <View style={styles.panel}>
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.panelTitle}>Upload Photo</Text>
            <Text style={styles.panelSubtitle}>Choose Your Profile Picture</Text>
          </View>
          {/* <TouchableOpacity style={styles.panelButton}>
            <Text style={styles.panelButtonTitle}>Take Photo</Text>
          </TouchableOpacity> */}
          <TouchableOpacity style={styles.panelButton} onPress={pickImageHandler}>
            <Text style={styles.panelButtonTitle}>Choose From Library</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.panelButton}
            onPress={() => setIsModalVisible(false)}>
            <Text style={styles.panelButtonTitle}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  )
}

export default ProfileImagePicker;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center'
  },
  imageContainer: {
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: '#eee',
    width: '90%',
    height: 150,
    borderRadius: 30,
  },
  button: {
    margin: 8
  },
  previewImage: {
    width: '100%',
    height: '100%'
  },
  commandButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#FF6347',
    alignItems: 'center',
    marginTop: 10,
  },
  panel: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
    // shadowColor: '#000000',
    // shadowOffset: {width: 0, height: 0},
    // shadowRadius: 5,
    // shadowOpacity: 0.4,
  },
  header: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#333333',
    shadowOffset: { width: -1, height: -3 },
    shadowRadius: 2,
    shadowOpacity: 0.4,
    // elevation: 5,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marginBottom: 10,
  },
  panelTitle: {
    fontSize: 27,
    height: 35,
  },
  panelSubtitle: {
    fontSize: 14,
    color: 'gray',
    height: 30,
    marginBottom: 10,
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: '#FF6347',
    alignItems: 'center',
    marginVertical: 7,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FF0000',
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#05375a',
  },
  modalView: {
    justifyContent: 'flex-end',
    margin: 0,
  },
})