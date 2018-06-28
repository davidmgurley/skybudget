import React, { Component } from 'react';
import { Text, AppRegistry, View, StyleSheet, TextInput, Button, AsyncStorage } from 'react-native';

const Realm = require('realm');

class TestRealm extends Component {
  constructor(props) {
    super(props);
    this.state = { realm: null };
  }

  componentWillMount() {
    Realm.open({
      schema: [{name: 'Dog', properties: {name: 'string'}}]
    }).then(realm => {
      realm.write(() => {
        realm.create('Dog', {name: 'Rex'})
        realm.create('Dog', {name: 'Buddy'});
      });
      this.setState({ realm });
    });
  }

  showData = () => {
    Realm.open({schema: [Dog]})
    .then(realm => {
      let thisDog = this.state.realm.objects('Dog')
      alert(thisDog)
    })
  }

  render() {
    const info = this.state.realm
      ? 'Number of dogs in this Realm: ' + this.state.realm.objects('Dog').length
      : 'Loading...';

    return (
      <View style={styles.container}>
        <Button onPress={this.showData} title='test'></Button>
        <Text style={styles.welcome}>
          {info}
        </Text>
      </View>
    );
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

export default TestRealm
