import React, { Component } from 'react';
import { Text, AppRegistry, View, Button, StyleSheet, Image, TouchableOpacity, TouchableHighlight, Dimensions } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet'



class WelcomeScreen extends Component {
  render() {
    return (
      <View>
        <View style={{ justifyContent:'center'}}>
          <View style={{flexDirection:'row'}}>
          <Image style={styles.logo} source={require('./skybudget.png')} />
          <Image style={styles.rocket} source={require('./rocket.png')} />
          </View>

          <Text style={styles.instructions}>
            Things are Looking Up
          </Text>
        </View>
        <View >
          <TouchableOpacity  onPress={this.props.toggleWelcome}>
            <Text style={styles.startButton}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </View>
      )
  }
}

//background color #1B2F4A

const styles = EStyleSheet.create({

  welcome: {
    fontSize: 50,
    textAlign: 'center',
    margin: 10,
    color: '#2A6972',
  },
  logo:{
    width: '300rem',
    height: '100rem',
    marginLeft: '-15rem'
  },
  rocket: {
    width: '60rem',
    height:'69rem',
    marginLeft: '-50rem',
    marginTop: '-10rem'
  },
  instructions: {
    fontSize: '18rem',
    textAlign: 'center',
    color: '#EAAF69',
    marginTop: '-30rem',
    marginBottom: '5rem',
    fontFamily: 'Lato-Regular'
  },
  startButton: {
    color: '#2A6972',
    fontSize: '25rem',
    marginTop: '50rem',
    textAlign: 'center',
    fontFamily: 'Lato-Regular'

  }
})

export default WelcomeScreen
