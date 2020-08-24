import { useTheme } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Modal, Alert, ActivityIndicator } from 'react-native';
import todoColors from '../components/Colors';
import { AntDesign } from '@expo/vector-icons';
import TodoList from '../components/TodoList';
import AddListModal from '../components/AddListModal';
import Fire from '../api/Fire';

//To implement live workout visit:
//https://pusher.com/tutorials/workout-tracker-react-native#creating-a-pusher-app

const HomeScreen = ({ props, route, navigation }) => {
  const { colors } = useTheme();

  const theme = useTheme();
  const [addTodoVisible, setAddTodoVisible] = useState(false);
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});

  const toggleAddModal = () => {
    setAddTodoVisible(!addTodoVisible);
  }

  useEffect(() => {
    let firebase = new Fire((error, user) => {
      if (error) {
        return Alert.alert("Uh oh, something went wrong!");
      }

      firebase.getLists(theLists => {
        setLists(theLists);
        setLoading(false);
      })

      setUser(user);
    });

    return () => {
      firebase.detach();
    }
  }, [])

  const renderList = list => {
    return <TodoList list={list} updateList={updateList} />
  };

  const addList = list => {
    let firebase = new Fire((error, user) => {
      firebase.addList({
        name: list.name,
        color: list.color,
        todos: []
      });
    });
    // setLists([...lists, { ...list, id: lists.length + 1, todos: [] }])
  };

  const updateList = list => {
    let firebase = new Fire((error, user) => {
      firebase.updateList(list);
    });
  };

  const onDataUpdated = (data) => {
    //console.log(data);
    navigation.popToTop();
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={todoColors.blue} />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Modal
        animationType='slide'
        visible={addTodoVisible}
        onRequestClose={() => toggleAddModal()}
      >
        <AddListModal closeModal={() => toggleAddModal()} addList={addList} />
      </Modal>
      <View style={{ flexDirection: 'row' }}>
        <View style={styles.divider} />
        <Text style={[styles.title, { color: colors.text }]}>
          Workout
          <Text style={{ fontWeight: '300', color: colors.text }}> Programs</Text>
        </Text>
        <View style={styles.divider} />
      </View>
      <View style={{ marginVertical: 48 }}>
        <TouchableOpacity style={styles.addList} onPress={() => toggleAddModal()}>
          <AntDesign name="plus" size={16} color={colors.text} />

        </TouchableOpacity>
        <Text style={styles.add}>Add New Program</Text>
      </View>

      <View style={{ height: 275, paddingLeft: 32 }}>
        <FlatList
          data={lists}
          keyExtractor={item => item.id.toString()}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => renderList(item)}
          keyboardShouldPersistTaps="always"
        />
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  divider: {
    backgroundColor: todoColors.lightBlue,
    height: 1,
    flex: 1,
    alignSelf: 'center'
  },
  title: {
    fontSize: 38,
    fontWeight: "800",
    //color: colors.text,
    paddingHorizontal: 64
  },
  addList: {
    borderWidth: 2,
    borderColor: todoColors.lightBlue,
    borderRadius: 4,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  add: {
    color: todoColors.blue,
    fontWeight: '600',
    fontSize: 14,
    marginTop: 8
  }
});

/*}
    <View style={styles.container}>
      <StatusBar barStyle={theme.dark ? "light-content" : "dark-content"} />
      <Text style={{ color: colors.text }}>Set Up Account</Text>
      <Button
        title="Go to Login screen"
        onPress={() => navigation.navigate("Profile")} // Don't forget to change profile with SignInScreen
      />
  </View>*/