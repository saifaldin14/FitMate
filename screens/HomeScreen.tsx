import { useTheme } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Modal } from 'react-native';
import ProfileForm from '../components/ProfileForm';
import colors from '../components/Colors';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import tempData from './tempData';
import TodoList from '../components/TodoList';
import AddListModal from '../components/AddListModal';

//To implement live workout visit:
//https://pusher.com/tutorials/workout-tracker-react-native#creating-a-pusher-app

const HomeScreen = ({ props, route, navigation }) => {
  const { colors } = useTheme();

  const theme = useTheme();
  const [addTodoVisible, setAddTodoVisible] = useState(false);
  const [lists, setLists] = useState(tempData);
  const toggleAddModal = () => {
    setAddTodoVisible(!addTodoVisible);
  }

  const renderList = list => {
    return <TodoList list={list} updateList={updateList} />
  };

  const addList = list => {
    setLists([...lists, { ...list, id: lists.length + 1, todos: [] }])
  };

  const updateList = list => {
    setLists(lists.map(item => {
      return item.id === list.id ? list : item;
    }));
  };

  useEffect(() => {
  });

  const onDataUpdated = (data) => {
    //console.log(data);
    navigation.popToTop();
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
        <Text style={styles.title}>
          Todo
          <Text style={{ fontWeight: '300', color: colors.blue }}>Lists</Text>
        </Text>
        <View style={styles.divider} />
      </View>
      <View style={{ marginVertical: 48 }}>
        <TouchableOpacity style={styles.addList} onPress={() => toggleAddModal()}>
          <AntDesign name="plus" size={16} color={colors.blue} />

        </TouchableOpacity>
        <Text style={styles.add}>Add List</Text>
      </View>

      <View style={{ height: 275, paddingLeft: 32 }}>
        <FlatList
          data={lists}
          keyExtractor={item => item.name}
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
    backgroundColor: colors.lightBlue,
    height: 1,
    flex: 1,
    alignSelf: 'center'
  },
  title: {
    fontSize: 38,
    fontWeight: "800",
    color: colors.black,
    paddingHorizontal: 64
  },
  addList: {
    borderWidth: 2,
    borderColor: colors.lightBlue,
    borderRadius: 4,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  add: {
    color: colors.blue,
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
