import React, { Component } from 'react';
import { Text, AppRegistry, View, Button, StyleSheet } from 'react-native';


class WelcomeScreen extends Component {
  render() {
    return (
      <View>
        <View>
          <Text style={styles.welcome}>
            SKYbudget
          </Text>
          <Text style={styles.instructions}>
            Money is Emotional
          </Text>
        </View>
        <View style={styles.startButton}>
          <Button title='Get Started' onPress={this.props.toggleWelcome} color='#2A6972'>
            Get Started
          </Button>
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
    color: '#2A6972',
    marginBottom: 5,
  },
  startButton: {
    marginTop: 20,
  }
})

export default WelcomeScreen
