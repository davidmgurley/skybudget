// export JAVA_HOME=/usr/local/android-studio/jre
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView,
  AppRegistry
} from 'react-native';

import WelcomeScreen from './android/app/src/components/WelcomeScreen'
import GettingStarted from './android/app/src/components/GettingStarted'
import TestRealm from './android/app/src/components/TestRealm'
import BudgetHomePage from './android/app/src/components/BudgetHomePage'
import { TotalSchema } from './android/app/src/components/Schemes'




export default class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      showWelcome: false,
      showBudgetHomePage: false,
      dataTest: 'nothing'
    }
  }

  componentDidMount(){
    Realm.open({schema: [TotalSchema]})
    .then(realm => {
      let retrievedTotal = realm.objects('Total')
      if (retrievedTotal['0'].totalMonthlySpending !== undefined) {
        this.setState({totalMonthlySpending: retrievedTotal['0'].totalMonthlySpending,
                        showBudgetHomePage: true})
      }
    })
  }

  toggleWelcome = () => {
    this.setState({showWelcome: true})
  }

  toggleHomeScreen = () => {
    this.setState({showBudgetHomePage: true})
  }



  render() {
    return (
      <View style={styles.container}>
      {this.state.showBudgetHomePage ? <BudgetHomePage /> :
       <View >
        {this.state.showWelcome ?  <GettingStarted toggleHomeScreen={this.toggleHomeScreen} /> : <WelcomeScreen toggleWelcome={this.toggleWelcome}/>}
      </View>}
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
