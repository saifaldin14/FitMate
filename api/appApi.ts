import "@firebase/firestore";
import * as firebase from "firebase";

export function updateData(data, updateComplete) {
  data.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
  console.log("Updating data in firebase");

  firebase
    .firestore()
    .collection("Data")
    .doc(data.id)
    .set(data)
    .then(() => updateComplete(data))
    .catch((error) => console.log(error));
}

export function deleteData(data, deleteComplete) {
  console.log(data);

  firebase
    .firestore()
    .collection("Data")
    .doc(data.id)
    .delete()
    .then(() => deleteComplete())
    .catch((error) => console.log(error));
}

export async function getData(dataRetreived) {
  let dataList = [];

  let snapshot = await firebase
    .firestore()
    .collection("Data")
    .orderBy("createdAt")
    .get();

  snapshot.forEach((doc) => {
    const dataItem = doc.data();
    dataItem.id = doc.id;
    dataList.push(dataItem);
  });

  dataRetreived(dataList);
}

function uuidFunc() {
  let uuid = "",
    i,
    random;

  for (i = 0; i < 32; i++) {
    random = (Math.random() * 16) | 0;

    if (i == 8 || i == 12 || i == 16 || i == 20) {
      uuid += "-";
    }

    uuid += (i == 12 ? 4 : i == 16 ? (random & 3) | 8 : random).toString(16);
  }

  return uuid;
}

function blobToFile(theBlob, fileName) {
  theBlob.lastModifiedDate = new Date();
  theBlob.name = fileName;
  return theBlob;
}

export function uploadData(data, onDataUploaded, { updating }) {
  if (data.imageUri) {
    const fileExtension = data.imageUri.split(".").pop();
    console.log("EXT: " + fileExtension);

    let uuid = uuidFunc();
    //console.log(uuid);
    const fileName = `${uuid}.${fileExtension}`;
    //console.log(fileName);

    let storageRef = firebase.storage().ref(`data/images/${fileName}`);
    console.log(typeof data.imageUri + " " + data.imageUri);

    let blob = new Blob([data.imageUri], { type: "text/plain" });
    let file = blobToFile(blob, fileName);
    storageRef.put(file).on(
      firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) => {
        console.log("snapshot: " + snapshot.state);
        console.log(
          "progress: " + (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );

        if (snapshot.state === firebase.storage.TaskState.SUCCESS) {
          console.log("Success");
        }
      },
      (error) => {
        unsubscribe();
        console.log("image upload error: " + error.toString());
      },
      () => {
        storageRef.getDownloadURL().then((downloadUrl) => {
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
        });
      }
    );
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

  firebase
    .firestore()
    .collection("Data")
    .add(data)
    .then((snapshot) => {
      data.id = snapshot.id;
      snapshot.set(data);
    })
    .then(() => addComplete(data))
    .catch((error) => console.log(error));
}
