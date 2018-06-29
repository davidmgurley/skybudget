import React, { Component } from 'react';
import { Text, AppRegistry, View, StyleSheet, TextInput, Button, AsyncStorage, ScrollView, TouchableHighlight, Animated, TouchableOpacity, Modal } from 'react-native';



const Entertainment = (props) => {
  return (
    <View>
      <Text>{props.price}</Text>
    </View>
  )
}

export default Entertainment
