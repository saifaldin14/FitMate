import firebase from 'firebase';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import {
  Avatar,
  Caption,
  Text, Title,
  TouchableRipple, useTheme
} from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { default as Icon, default as MaterialCommunityIcons } from 'react-native-vector-icons/MaterialCommunityIcons';

const ProfileScreen = () => {
  const { colors } = useTheme();
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    weight: "",
    email: "",
  });
  const [url, setUrl] = useState('https://api.adorable.io/avatars/80/abott@adorable.png');

  useEffect(() => {
    firebase.auth().onAuthStateChanged(async (user) => {
      var ref = firebase.database().ref(user.email.replace('.', ''));
      firebase.database().ref(ref).child("userData").once('value').then((snapshot) => {
        //console.log(snapshot.val().firstName)
        setUserData(userData => ({
          ...userData,
          firstName: snapshot.val().firstName,
          lastName: snapshot.val().lastName,
          age: snapshot.val().age,
          weight: snapshot.val().weight,
          email: user.email,
        }));
      });
      const iRef = "/images/" + user.email.replace('.', '');
      const imageRef = firebase.storage().ref(iRef);
      const tempUrl = await imageRef.getDownloadURL();
      setUrl(tempUrl);
    })
  }, []);

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.userInfoSection}>
        <View style={{ flexDirection: 'row', marginTop: 15 }}>
          <Avatar.Image
            source={{
              uri: url,
            }}
            size={80}
          />
          <View style={{ marginLeft: 20 }}>
            <Title style={[styles.title, {
              marginTop: 15,
              marginBottom: 5,
            }]}>{userData.firstName + " " + userData.lastName}</Title>
          </View>
        </View>
      </View>

      <View style={styles.userInfoSection}>
        <View style={styles.row}>
          <FontAwesome name="sun-o" color={colors.text} size={20} />
          <Text style={{ color: "#777777", marginLeft: 20 }}>{userData.age + " years old"}</Text>
        </View>
        <View style={styles.row}>
          <MaterialCommunityIcons name="scale-bathroom" color={colors.text} size={20} />
          <Text style={{ color: "#777777", marginLeft: 20 }}>{userData.weight + " kg"}</Text>
        </View>
        <View style={styles.row}>
          <Icon name="email" color="#777777" size={20} />
          <Text style={{ color: "#777777", marginLeft: 20 }}>{userData.email}</Text>
        </View>
      </View>

      <View style={styles.infoBoxWrapper}>
        <View style={[styles.infoBox, {
          borderRightColor: '#dddddd',
          borderRightWidth: 1
        }]}>
          <Title>$140</Title>
          <Caption>Wallet</Caption>
        </View>
        <View style={styles.infoBox}>
          <Title>12</Title>
          <Caption>Orders</Caption>
        </View>
      </View>

      <View style={styles.menuWrapper}>
        <TouchableRipple onPress={() => { }}>
          <View style={styles.menuItem}>
            <Icon name="heart-outline" color="#FF6347" size={25} />
            <Text style={styles.menuItemText}>Your Favorites</Text>
          </View>
        </TouchableRipple>
        <TouchableRipple onPress={() => { }}>
          <View style={styles.menuItem}>
            <Icon name="credit-card" color="#FF6347" size={25} />
            <Text style={styles.menuItemText}>Payment</Text>
          </View>
        </TouchableRipple>
        <TouchableRipple onPress={() => { }}>
          <View style={styles.menuItem}>
            <Icon name="share-outline" color="#FF6347" size={25} />
            <Text style={styles.menuItemText}>Tell Your Friends</Text>
          </View>
        </TouchableRipple>
        <TouchableRipple onPress={() => { }}>
          <View style={styles.menuItem}>
            <Icon name="account-check-outline" color="#FF6347" size={25} />
            <Text style={styles.menuItemText}>Support</Text>
          </View>
        </TouchableRipple>
        <TouchableRipple onPress={() => { }}>
          <View style={styles.menuItem}>
            <Icon name="settings-outline" color="#FF6347" size={25} />
            <Text style={styles.menuItemText}>Settings</Text>
          </View>
        </TouchableRipple>
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
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  infoBoxWrapper: {
    borderBottomColor: '#dddddd',
    borderBottomWidth: 1,
    borderTopColor: '#dddddd',
    borderTopWidth: 1,
    flexDirection: 'row',
    height: 100,
  },
  infoBox: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuWrapper: {
    marginTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  menuItemText: {
    color: '#777777',
    marginLeft: 20,
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 26,
  },
});