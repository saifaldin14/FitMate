import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, TouchableOpacity, TextInput } from 'react-native';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import todoColors from '../components/Colors';
import { useTheme } from '@react-navigation/native';

const AddListModal = (props) => {
  const backgroundColors = ["#5CD859", "#24A6D9", "#595BD9", "#8022D9", "#D159D8", "#D85963", "#D88559"]
  const [name, setName] = useState("");
  const [color, setColor] = useState(backgroundColors[0]);

  const { colors } = useTheme();

  const createTodo = () => {
    const list = { name, color };
    props.addList(list);
    setName("");
    props.closeModal();
  }

  const renderColors = () => {
    return backgroundColors.map(c => {
      return (
        <TouchableOpacity
          key={c}
          style={[styles.colorSelect, { backgroundColor: c }]}
          onPress={() => setColor(c)} />
      )
    })
  }
  return (
    <KeyboardAvoidingView style={[styles.container, { backgroundColor: colors.background }]} behavior='padding'>
      <TouchableOpacity
        style={{ position: 'absolute', top: 64, right: 32 }}
        onPress={props.closeModal}>
        <AntDesign name="close" size={24} color={colors.text} />
      </TouchableOpacity>

      <View style={{ alignSelf: 'stretch', marginHorizontal: 32 }}>
        <Text style={[styles.title, { color: colors.text }]}>Create Todo List</Text>

        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder="List name?"
          onChangeText={text => setName(text)}
        />

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
          {renderColors()}
        </View>

        <TouchableOpacity
          style={[styles.create, { backgroundColor: color }]}
          onPress={createTodo}>
          <Text style={{ color: todoColors.white, fontWeight: '600' }}>Create!</Text>
        </TouchableOpacity>

      </View>
    </KeyboardAvoidingView>
  );
}

export default AddListModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: todoColors.black,
    alignSelf: 'center',
    marginBottom: 16
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: todoColors.blue,
    borderRadius: 6,
    height: 50,
    marginTop: 8,
    paddingHorizontal: 16,
    fontSize: 18
  },
  create: {
    marginTop: 24,
    height: 50,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center'
  },
  colorSelect: {
    width: 30,
    height: 30,
    borderRadius: 4
  }
});