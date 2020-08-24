import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  TextInput,
  Keyboard,
  FlatList,
  Animated
} from 'react-native';
import todoColors from './Colors';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { useTheme } from '@react-navigation/native';

const TodoModal = ({ list, closeModal, updateList }) => {
  // const [name, setName] = useState(list.name);
  // const [color, setColor] = useState(list.color);
  // const [todos, setTodos] = useState(list.todos);
  const { colors } = useTheme();
  const theme = useTheme();

  const [newTodo, setNewTodo] = useState("");

  const toggleTodoCompleted = index => {
    let newList = list;
    newList.todos[index].completed = !newList.todos[index].completed;
    updateList(newList);
  };

  const addTodo = () => {
    let newList = list;

    if (!newList.todos.some(todo => todo.title === newTodo)) {
      newList.todos.push({ title: newTodo, completed: false });
      updateList(newList);
    }

    setNewTodo("");
    Keyboard.dismiss();
  };

  const deleteTodo = index => {
    let newList = list;
    newList.todos.splice(index, 1);

    updateList(newList);
  }

  const rightActions = (dragX, index) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0.9],
      extrapolate: "clamp"
    });

    const opacity = dragX.interpolate({
      inputRange: [-100, -20, 0],
      outputRange: [1, 0.9, 0],
      extrapolate: "clamp"
    })

    return (
      <TouchableOpacity onPress={() => deleteTodo(index)}>
        <Animated.View style={[styles.deleteButton, { opacity: opacity }]}>
          <Animated.Text
            style={{ color: todoColors.white, fontWeight: '800', transform: [{ scale }] }}
          >
            Delete
          </Animated.Text>
        </Animated.View>
      </TouchableOpacity>
    )
  }

  const renderTodo = (todo, index) => {
    return (
      <Swipeable renderRightActions={(_, dragX) => rightActions(dragX, index)}>
        <View style={styles.todoContainer}>
          <TouchableOpacity onPress={() => toggleTodoCompleted(index)}>
            <Ionicons
              name={todo.completed ? "ios-square" : "ios-square-outline"}
              size={24}
              color={todoColors.gray}
              style={{ width: 32 }}
            />
          </TouchableOpacity>

          <Text
            style=
            {[
              styles.todo,
              {
                textDecorationLine: todo.completed ? 'line-through' : 'none',
                color: todo.completed ? todoColors.gray : colors.text
              }
            ]}>
            {todo.title}
          </Text>
        </View>
      </Swipeable>
    );
  };

  const taskCount = list.todos.length;
  const completedCount = list.todos.filter(todo => todo.completed).length;

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.background }} behavior="padding">
      <SafeAreaView style={styles.container}>
        <TouchableOpacity
          style={{ position: 'absolute', top: 64, right: 32, zIndex: 10 }}
          onPress={closeModal}
        >
          <AntDesign name="close" size={24} color={colors.text} />
        </TouchableOpacity>

        <View style={[styles.section, styles.header, { borderBottomColor: list.color }]}>
          <View>
            <Text style={[styles.title, { color: colors.text }]}>{list.name}</Text>
            <Text style={styles.taskCount}>
              {completedCount} of {taskCount} tasks
          </Text>
          </View>
        </View>

        <View style={[styles.section, { flex: 3, marginVertical: 16 }]}>
          <FlatList
            data={list.todos}
            renderItem={({ item, index }) => renderTodo(item, index)}
            keyExtractor={item => item.title}
            showsVerticalScrollIndicator={false}
          />
        </View>

        <View
          style={[styles.section, styles.footer]}
        >
          <TextInput
            style={[styles.input, { borderColor: list.color, color: colors.text }]}
            onChangeText={text => setNewTodo(text)}
            value={newTodo}
          />
          <TouchableOpacity
            style={[styles.addTodo, { backgroundColor: list.color }]}
            onPress={() => addTodo()}
          >
            <AntDesign name="plus" size={16} color={colors.text} />
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
    alignSelf: 'stretch'
  },
  header: {
    justifyContent: 'flex-end',
    marginLeft: 64,
    borderBottomWidth: 3,
    paddingTop: 16
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    //color: colors.black
  },
  taskCount: {
    marginTop: 4,
    marginBottom: 16,
    color: todoColors.gray,
    fontWeight: '600'
  },
  footer: {
    paddingHorizontal: 32,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16
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
    alignItems: 'center',
    paddingLeft: 32
  },
  todo: {
    //color: colors.black,
    fontWeight: '700',
    fontSize: 16
  },
  deleteButton: {
    flex: 1,
    backgroundColor: todoColors.red,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80
  }
})
export default TodoModal;