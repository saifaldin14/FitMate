import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, KeyboardAvoidingView, TextInput, Keyboard } from 'react-native';
import colors from './Colors';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { FlatList } from 'react-native-gesture-handler';

const TodoModal = ({ list, closeModal, updateList }) => {
  // const [name, setName] = useState(list.name);
  // const [color, setColor] = useState(list.color);
  // const [todos, setTodos] = useState(list.todos);

  const [newTodo, setNewTodo] = useState("");

  const toggleTodoCompleted = index => {
    let newList = list;
    newList.todos[index].completed = !newList.todos[index].completed;
    updateList(newList);
  };

  const addTodo = () => {
    let newList = list;
    newList.todos.push({ title: newTodo, completed: false });
    updateList(newList);
    setNewTodo("");

    Keyboard.dismiss();
  };

  const renderTodo = (todo, index) => {
    return (
      <View style={styles.todoContainer}>
        <TouchableOpacity onPress={() => toggleTodoCompleted(index)}>
          <Ionicons
            name={todo.completed ? "ios-square" : "ios-square-outline"}
            size={24}
            color={colors.gray}
            style={{ width: 32 }}
          />
        </TouchableOpacity>

        <Text
          style=
          {[
            styles.todo,
            {
              textDecorationLine: todo.completed ? 'line-through' : 'none',
              color: todo.completed ? colors.gray : colors.black
            }
          ]}>
          {todo.title}
        </Text>
      </View>
    );
  };
  const taskCount = list.todos.length;
  const completedCount = list.todos.filter(todo => todo.completed).length;
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <SafeAreaView style={styles.container}>
        <TouchableOpacity
          style={{ position: 'absolute', top: 64, right: 32, zIndex: 10 }}
          onPress={closeModal}
        >
          <AntDesign name="close" size={24} color={colors.black} />
        </TouchableOpacity>

        <View style={[styles.section, styles.header, { borderBottomColor: list.color }]}>
          <View>
            <Text style={styles.title}>{list.name}</Text>
            <Text style={styles.taskCount}>
              {completedCount} of {taskCount} tasks
          </Text>
          </View>
        </View>

        <View style={[styles.section, { flex: 3 }]}>
          <FlatList
            data={list.todos}
            renderItem={({ item, index }) => renderTodo(item, index)}
            keyExtractor={item => item.title}
            contentContainerStyle={{ paddingHorizontal: 32, paddingVertical: 64 }}
            showsVerticalScrollIndicator={false}
          />
        </View>

        <View
          style={[styles.section, styles.footer]}
        >
          <TextInput
            style={[styles.input, { borderColor: list.color }]}
            onChangeText={text => setNewTodo(text)}
            value={newTodo}
          />
          <TouchableOpacity
            style={[styles.addTodo, { backgroundColor: list.color }]}
            onPress={() => addTodo()}
          >
            <AntDesign name="plus" size={16} color={colors.white} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  section: {
    flex: 1,
    alignSelf: 'stretch'
  },
  header: {
    justifyContent: 'flex-end',
    marginLeft: 64,
    borderBottomWidth: 3
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: colors.black
  },
  taskCount: {
    marginTop: 4,
    marginBottom: 16,
    color: colors.gray,
    fontWeight: '600'
  },
  footer: {
    paddingHorizontal: 32,
    flexDirection: 'row',
    alignItems: 'center'
  },
  input: {
    flex: 1,
    height: 48,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 6,
    marginRight: 8,
    paddingHorizontal: 8
  },
  addTodo: {
    borderRadius: 4,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  todoContainer: {
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center'
  },
  todo: {
    color: colors.black,
    fontWeight: '700',
    fontSize: 16
  }
})
export default TodoModal;
