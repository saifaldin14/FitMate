import '@firebase/firestore';
import * as firebase from 'firebase';
//import 'react-native-get-random-values';
//import { v4 as uuidv4 } from 'uuid';
//import { uuid as uuidv4 } from 'uuidv4';

/*export function login({ email, password }) {
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((value) => console.log(value))
}

export function signup({ email, password, displayName }) {
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userInfo) => {
      console.log(userInfo)
      userInfo.user.updateProfile({ displayName: displayName.trim() })
        .then(() => { })
    })
}

export function subscribeToAuthChanges(authStateChanged) {
  firebase.auth().onAuthStateChanged((user) => {
    authStateChanged(user);
  })
}

export function signout(onSignedOut) {
  firebase.auth().signOut()
    .then(() => {
      onSignedOut();
    })
}*/

export function updateData(data, updateComplete) {
  data.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
  console.log("Updating data in firebase");

  firebase.firestore()
    .collection('Data')
    .doc(data.id).set(data)
    .then(() => updateComplete(data))
    .catch((error) => console.log(error));
}

export function deleteData(data, deleteComplete) {
  console.log(data);

  firebase.firestore()
    .collection('Data')
    .doc(data.id).delete()
    .then(() => deleteComplete())
    .catch((error) => console.log(error));
}

export async function getData(dataRetreived) {

  var dataList = [];

  var snapshot = await firebase.firestore()
    .collection('Data')
    .orderBy('createdAt')
    .get()

  snapshot.forEach((doc) => {
    const dataItem = doc.data();
    dataItem.id = doc.id;
    dataList.push(dataItem);
  });

  dataRetreived(dataList);
}

function uuidFunc() {
  var uuid = "", i, random;

  for (i = 0; i < 32; i++) {
    random = Math.random() * 16 | 0;

    if (i == 8 || i == 12 || i == 16 || i == 20) {
      uuid += "-";
    }

    uuid += (i == 12 ? 4 : (i == 16 ? (random & 3 | 8) : random)).toString(16);
  }

  return uuid;
}

function blobToFile(theBlob, fileName) {
  //A Blob() is almost a File() - it's just missing the two properties below which we will add
  theBlob.lastModifiedDate = new Date();
  theBlob.name = fileName;
  return theBlob;
}

export function uploadData(data, onDataUploaded, { updating }) {
  if (data.imageUri) {
    const fileExtension = data.imageUri.split('.').pop();
    console.log("EXT: " + fileExtension);

    var uuid = uuidFunc();
    console.log(uuid);
    const fileName = `${uuid}.${fileExtension}`;
    console.log(fileName);

    var storageRef = firebase.storage().ref(`data/images/${fileName}`);
    console.log(typeof (data.imageUri) + " " + data.imageUri);
    var blob = new Blob([data.imageUri], { type: 'text/plain' });
    var file = blobToFile(blob, fileName);
    storageRef.put(file)
      .on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        snapshot => {
          console.log("snapshot: " + snapshot.state);
          console.log("progress: " + (snapshot.bytesTransferred / snapshot.totalBytes) * 100);

          if (snapshot.state === firebase.storage.TaskState.SUCCESS) {
            console.log("Success");
          }
        },
        error => {
          unsubscribe();
          console.log("image upload error: " + error.toString());
        },
        () => {
          storageRef.getDownloadURL()
            .then((downloadUrl) => {
              console.log("File available at: " + downloadUrl);

              data.image = downloadUrl;

              delete data.imageUri;

              if (updating) {
                console.log("Updating....");
                updateData(data, onDataUploaded);
              } else {
                console.log("adding...");
                addData(data, onDataUploaded);
              }
            })
        }
      )
  } else {
    console.log("Skipping image upload");

    delete data.imageUri;

    if (updating) {
      console.log("Updating....");
      updateData(data, onDataUploaded);
    } else {
      console.log("adding...");
      addData(data, onDataUploaded);
    }
  }
}

export function addData(data, addComplete) {
  data.createdAt = firebase.firestore.FieldValue.serverTimestamp();

  firebase.firestore()
    .collection('Data')
    .add(data)
    .then((snapshot) => {
      data.id = snapshot.id;
      snapshot.set(data);
    }).then(() => addComplete(data))
    .catch((error) => console.log(error));
}