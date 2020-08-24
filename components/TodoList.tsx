import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native';
import todoColors from './Colors';
import TodoModal from './TodoModal';
import { accessibilityProps } from 'react-native-paper/lib/typescript/src/components/MaterialCommunityIcon';
import { useTheme } from '@react-navigation/native';

const TodoList = ({ list, updateList }) => {
  const { colors } = useTheme();
  const theme = useTheme();

  const [showListVisible, setShowListVisible] = useState(false);
  const completedCount = list.todos.filter(todo => todo.completed).length;
  const remainingCount = list.todos.length - completedCount;

  const toggleListModal = () => {
    setShowListVisible(!showListVisible);
  }
  return (
    <View>
      <Modal
        animationType='slide'
        visible={showListVisible}
        onRequestClose={() => toggleListModal()}
      >
        <TodoModal
          list={list}
          closeModal={() => toggleListModal()}
          updateList={updateList}
        />
      </Modal>
      <TouchableOpacity
        style={[styles.listContainer, { backgroundColor: list.color }]}
        onPress={() => toggleListModal()}
      >
        <Text style={styles.listTitle} numberOfLines={1}>
          {list.name}
        </Text>

        <View>
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.count}>{remainingCount}</Text>
            <Text style={styles.subtitle}>Remaining</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.count}>{completedCount}</Text>
            <Text style={styles.subtitle}>Completed</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  listContainer: {
    paddingVertical: 32,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginHorizontal: 12,
    alignItems: 'center',
    width: 200
  },
  listTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: todoColors.white,
    marginBottom: 18
  },
  count: {
    fontSize: 48,
    fontWeight: '200',
    color: todoColors.white
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: todoColors.white
  }
})
export default TodoList;