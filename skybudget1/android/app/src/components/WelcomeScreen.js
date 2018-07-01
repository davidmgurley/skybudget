import React, { Component } from 'react';
import { Text, AppRegistry, View, Button, StyleSheet, Image, TouchableOpacity, TouchableHighlight } from 'react-native';


class WelcomeScreen extends Component {
  render() {
    return (
      <View>
        <View style={{ justifyContent:'center'}}>
          <View style={{flexDirection:'row'}}>
          <Image style={{width: 250, height:250}} source={require('./skybudget.png')} />
          <Image style={{width: 80, height:120, marginTop:30}} source={require('./rocket.png')} />
          </View>

          <Text style={styles.instructions}>
            Money is Emotional
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1B2F4A',
  },
  welcome: {
    fontSize: 50,
    textAlign: 'center',
    margin: 10,
    color: '#2A6972',
  },
  instructions: {
    fontSize: 20,
    textAlign: 'center',
    color: '#EAAF69',
    marginBottom: 5,
  },
  startButton: {
    color: '#2A6972',
    fontSize: 30,
    marginTop: 20,
    textAlign: 'center'
  }
})

export default WelcomeScreen
