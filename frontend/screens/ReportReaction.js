import React, { useState } from 'react';
import { StyleSheet, Text, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback, ScrollView, TextInput, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';

//get from backend
const whealSize = 10;


const whealData = [
  { label: `Less than ${whealSize} mm`, value: '1' },
  { label: `${whealSize} mm or larger`, value: '1' },
];

const vialData = [
    { label: `Vial 1: Insects`, value: '1' },
    { label: `Vial 2: Mold`, value: '2' },
    { label: `Vial 3: Pollen`, value: '3' },
  ];

const DropdownComponent = () => {
  const [whealValue, setWhealValue] = useState(null);
  const [isFocusWheal, setIsFocusWheal] = useState(false);

  const [vialValue, setVialValue] = useState(null);
  const [isFocusVial, setIsFocusVial] = useState(false);

  const [notesValue, onChangeNotes] = React.useState(null);

  const renderWhealSizeLabel = () => {
   
      return (
        <Text style={[styles.label]}>
          Wheal size
        </Text>
      );

  };

  const renderVialNumLabel = () => {
   
    return (
      <Text style={[styles.label]}>
        Which injection are you reporting a reaction for?
      </Text>
    );

    const handleSubmit = () => {
        // send data to backend
      };

};

  return (
    <KeyboardAvoidingView style={styles.container}>
    <ScrollView>
<View style = {styles.titleContainer}>
<Text style = {styles.title}>Report a Reaction </Text>
<Text style = {styles.subtitle}>If you are experiencing an adverse reaction to a recent injection, report it here. </Text>
        
<View style={styles.dropdownContainer}>
      {renderVialNumLabel()}
      <Dropdown
        style={[styles.dropdown, isFocusVial && { borderColor: 'blue' }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={vialData}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocusVial ? 'Select...' : '...'}
        searchPlaceholder="Search..."
        value={vialValue}
        onFocus={() => setIsFocusVial(true)}
        onBlur={() => setIsFocusVial(false)}
        onChange={item => {
          setVialValue(item.value);
          setIsFocusVial(false);
        }}
        
      />
    </View>


    <View style={styles.dropdownContainer}>
      {renderWhealSizeLabel()}
      <Dropdown
        style={[styles.dropdown, isFocusWheal && { borderColor: 'blue' }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={whealData}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocusWheal ? 'Select...' : '...'}
        searchPlaceholder="Search..."
        value={whealValue}
        onFocus={() => setIsFocusWheal(true)}
        onBlur={() => setIsFocusWheal(false)}
        onChange={item => {
          setWhealValue(item.value);
          setIsFocusWheal(false);
        }}
        
      />
    </View>

    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={styles.dropdownContainer}>
        <Text style = {styles.label}>Notes</Text>
        <TextInput
        editable
        multiline
        numberOfLines={4}
        maxLength={40}
        placeholder={'Add any notes about your reaction here.'}
        onChangeNotes={notes => onChangeNotes(notes)}
        value={notesValue}
        style={styles.notesContainer}
      />
      </View>
      </TouchableWithoutFeedback>
    </View>
    </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default DropdownComponent;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginTop: 8,

  },
  dropdownContainer: {
    backgroundColor: 'white',
    padding: 18,
    paddingTop: 15,
    borderRadius: 10,
    marginTop: 40

  },
  titleContainer: {
    //backgroundColor: '#f06460',
    padding: 10,
    borderRadius: 10,
    marginTop: 20

  },
  notesContainer: {
    backgroundColor: 'white',
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 2,
    padding: 10,
    paddingVertical: 80,
    color: '#878787',
    fontStyle: 'italic'

  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginTop: 5,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'relative',
    fontSize: 14,
    marginBottom: 4
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e55555',
    marginLeft: 10,
    marginBottom: 5,
  },


subtitle: {
    fontWeight: '500',
    fontSize: 14,
    marginBottom: 4,
   marginLeft: 12,
   color: '#878787',
   fontStyle: 'italic',
},

subtitle2: {
    fontWeight: '400',
    fontSize: 14,
    marginBottom: 4,
    marginTop: 3,
   color: '#878787',
   fontStyle: 'italic'
}, 

});