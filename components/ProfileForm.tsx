import firebase from 'firebase';
import { withFormik } from 'formik';
import React from 'react';
import {
  Platform, StyleSheet,
  Text, TextInput, TouchableOpacity, View
} from 'react-native';
import { useTheme } from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as yup from 'yup';
import ProfileImagePicker from './ProfileImagePicker';

const ProfileForm = (props) => {
  const setProfileImage = (image) => {
    props.setFieldValue('imageUri', image.uri);
  }
  const { colors } = useTheme();
  const bs = React.createRef();

  return (
    <View style={styles.container}>
      <ProfileImagePicker image={props.data.image} onImagePicked={setProfileImage} />
      <View style={styles.action}>
        <FontAwesome name="user-o" color={colors.text} size={20} />
        <TextInput
          placeholder="First Name"
          placeholderTextColor="#666666"
          value={props.values.firstName}
          onChangeText={text => { props.setFieldValue('firstName', text) }}
          autoCorrect={false}
          style={[
            styles.textInput,
            {
              color: colors.text,
            },
          ]}
        />
      </View>
      <Text style={styles.validationText}> {props.errors.firstName}</Text>
      <View style={styles.action}>
        <FontAwesome name="user-o" color={colors.text} size={20} />
        <TextInput
          placeholder="Last Name"
          placeholderTextColor="#666666"
          value={props.values.lastName}
          onChangeText={text => { props.setFieldValue('lastName', text) }}
          autoCorrect={false}
          style={[
            styles.textInput,
            {
              color: colors.text,
            },
          ]}
        />
      </View>
      <Text style={styles.validationText}> {props.errors.lastName}</Text>
      {/*<TextInput
        value={props.values.name}
        style={styles.longFormInput}
        placeholder='Name'
        onChangeText={text => { props.setFieldValue('name', text) }}
      />*/}
      {/*<Text style={styles.validationText}> {props.errors.name}</Text>*/}
      <View style={styles.action}>
        <FontAwesome name="sun-o" color={colors.text} size={20} />
        <TextInput
          placeholder="Age"
          placeholderTextColor="#666666"
          value={props.values.age}
          keyboardType='number-pad'
          onChangeText={text => { props.setFieldValue('age', text) }}
          autoCorrect={false}
          style={[
            styles.textInput,
            {
              color: colors.text,
            },
          ]}
        />
      </View>
      <Text style={styles.validationText}> {props.errors.age}</Text>
      {/*<TextInput
        value={props.values.age}
        style={styles.longFormInput}
        placeholder='Age'
        onChangeText={text => { props.setFieldValue('age', text) }}
      />*/}
      <View style={styles.action}>
        <MaterialCommunityIcons name="scale-bathroom" color={colors.text} size={20} />
        <TextInput
          placeholder="Weight"
          placeholderTextColor="#666666"
          value={props.values.weight}
          keyboardType='number-pad'
          onChangeText={text => { props.setFieldValue('weight', text) }} autoCorrect={false}
          style={[
            styles.textInput,
            {
              color: colors.text,
            },
          ]}
        />
      </View>
      <Text style={styles.validationText}> {props.errors.weight}</Text>

      {/*<TextInput
        value={props.values.weight}
        style={styles.longFormInput}
        placeholder='Weight'
        keyboardType='number-pad'
        onChangeText={text => { props.setFieldValue('weight', text) }}
      />
      <Text style={styles.validationText}> {props.errors.weight}</Text>*/}
      <TouchableOpacity
        style={styles.commandButton}
        onPress={() => props.handleSubmit()}>
        <Text style={styles.panelButtonTitle}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}

//export default ProfileForm;

export default withFormik({
  mapPropsToValues: ({ data }) => ({
    firstName: data.firstName,
    lastName: data.lastName,
    weight: data.weight,
    imageUri: null
  }),
  enableReinitialize: true,
  validationSchema: () => yup.object().shape({
    firstName: yup.string().max(30).required(),
    lastName: yup.string().max(30).required(),
    age: yup.string().max(2).required(),
    weight: yup.string().max(4).required()
  }),
  handleSubmit: (values, { props }) => {
    firebase.auth().onAuthStateChanged((user) => {
      var ref = firebase.database().ref(user.email.replace('.', ''));
      var key = firebase.database().ref(ref).push().key;
      firebase.database().ref(ref).child("userData").set({
        firstName: values.firstName,
        lastName: values.lastName,
        weight: values.weight,
        age: values.age
      });
    });
  },
})(ProfileForm);

const styles = StyleSheet.create({
  row: {
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32
  },
  container: {
    width: 300,
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 32,
  },
  formInput: {
    borderColor: '#B5B4BC',
    borderWidth: 1,
    padding: 8,
    height: 50,
    color: 'black',
    width: '75%',
    marginBottom: 16,
    marginTop: 16,
    borderRadius: 100,
  },
  validationText: {
    color: 'red'
  },
  longFormInput: {
    width: '100%',
    height: 50,
    color: 'black',
    borderColor: '#B5B4BC',
    borderWidth: 1,
    padding: 8,
    margin: 16,
    borderRadius: 20,
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
});