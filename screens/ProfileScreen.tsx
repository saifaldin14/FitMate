import firebase from "firebase";
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  AsyncStorage,
  Alert,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import {
  Avatar,
  Caption,
  Text,
  Title,
  TouchableRipple,
  useTheme,
} from "react-native-paper";
import ProfileFooter from "../components/ProfileFooter";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {
  default as Icon,
  default as MaterialCommunityIcons,
} from "react-native-vector-icons/MaterialCommunityIcons";

const ProfileScreen = () => {
  const { colors } = useTheme();
  const [userData, setUserData] = useState({
    firstName: "Jane",
    lastName: "Doe",
    age: "??",
    weight: "??",
    email: "",
  });
  const [url, setUrl] = useState(
    "https://api.adorable.io/avatars/80/abott@adorable.png"
  );
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(async (user) => {
      let ref = firebase.database().ref(user.email.replace(".", ""));
      firebase
        .database()
        .ref(ref)
        .child("userData")
        .once("value")
        .then((snapshot) => {
          //console.log(snapshot.val().firstName)
          if (snapshot.val().firstName !== null) {
            setUserData((userData) => ({
              ...userData,
              firstName: snapshot.val().firstName,
            }));
          }
          if (snapshot.val().lastName !== null) {
            setUserData((userData) => ({
              ...userData,
              lastName: snapshot.val().lastName,
            }));
          }
          if (snapshot.val().age !== null) {
            setUserData((userData) => ({
              ...userData,
              age: snapshot.val().age,
            }));
          }
          if (snapshot.val().weight !== null) {
            setUserData((userData) => ({
              ...userData,
              weight: snapshot.val().weight,
            }));
          }
          if (snapshot.val().email !== null) {
            setUserData((userData) => ({
              ...userData,
              email: snapshot.val().email,
            }));
          }
        });
      const iRef = "/images/" + user.email.replace(".", "");
      const imageRef = firebase.storage().ref(iRef);
      const tempUrl = await imageRef.getDownloadURL();
      setUrl(tempUrl);
    });
  }, []);

  useEffect(() => {
    async function getNotes() {
      const temp_notes = await AsyncStorage.getItem("notes");
      if (temp_notes && temp_notes.length > 0) {
        setNotes(JSON.parse(temp_notes));
      }
    }
    getNotes();
  }, []);

  const updateAsyncStorage = (send_notes) => {
    return new Promise(async (resolve, reject) => {
      try {
        await AsyncStorage.removeItem("notes");
        await AsyncStorage.setItem("notes", JSON.stringify(send_notes));
        return resolve(true);
      } catch (e) {
        return reject(e);
      }
    });
  };

  const cloneNotes = () => {
    return [...notes];
  };

  const addNote = async () => {
    if (note.length <= 0) return;
    try {
      const temp_notes = cloneNotes();
      temp_notes.push(note);

      await updateAsyncStorage(temp_notes);
      setNotes(temp_notes);
      setNote("");
    } catch (e) {
      Alert.alert(e);
    }
  };

  const removeNote = (i) => {
    Alert.alert(
      "Remove Goal?",
      "Have you accomplished your goal?",
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => removeNoteAux(i),
        },
      ],
      { cancelable: false }
    );
  };

  const removeNoteAux = async (i) => {
    try {
      const temp_notes = cloneNotes();
      temp_notes.splice(i, 1);

      await updateAsyncStorage(temp_notes);
      setNotes(temp_notes);
    } catch (e) {
      Alert.alert(e);
    }
  };

  const renderNotes = () => {
    return notes.map((n, i) => {
      return (
        <TouchableOpacity
          key={i}
          style={[styles.note, { backgroundColor: colors.background }]}
          onLongPress={() => removeNote(i)}
        >
          <Text style={styles.noteText}>{n}</Text>
        </TouchableOpacity>
      );
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.userInfoSection}>
        <View style={{ flexDirection: "row", marginTop: 15 }}>
          <Avatar.Image
            source={{
              uri: url,
            }}
            size={80}
          />
          <View style={{ marginLeft: 20 }}>
            <Title
              style={[
                styles.title,
                {
                  marginTop: 15,
                  marginBottom: 5,
                },
              ]}
            >
              {userData.firstName + " " + userData.lastName}
            </Title>
          </View>
        </View>
      </View>

      <View style={styles.userInfoSection}>
        <View style={styles.row}>
          <FontAwesome name="sun-o" color={colors.text} size={20} />
          <Text style={{ color: "#777777", marginLeft: 20 }}>
            {userData.age + " years old"}
          </Text>
        </View>
        <View style={styles.row}>
          <MaterialCommunityIcons
            name="scale-bathroom"
            color={colors.text}
            size={20}
          />
          <Text style={{ color: "#777777", marginLeft: 20 }}>
            {userData.weight + " kg"}
          </Text>
        </View>
        <View style={styles.row}>
          <Icon name="email" color="#777777" size={20} />
          <Text style={{ color: "#777777", marginLeft: 20 }}>
            {userData.email}
          </Text>
        </View>
      </View>
      <View style={styles.container}>
        <Text style={styles.goalText}>Fitness Goals</Text>
        <ScrollView
          style={[styles.scrollView, { backgroundColor: colors.background }]}
        >
          {renderNotes()}
        </ScrollView>

        <ProfileFooter
          onChangeText={(note) => setNote(note)}
          inputValue={note}
          onNoteAdd={() => addNote()}
        />
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userInfoSection: {
    paddingHorizontal: 30,
    marginBottom: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
  },
  scrollView: {
    maxHeight: "82%",
    marginBottom: 100,
  },
  goalText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  note: {
    margin: 20,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#ddd",
    borderRadius: 10,
  },
  noteText: {
    fontSize: 14,
    padding: 20,
  },
});
