// export JAVA_HOME=/usr/local/android-studio/jre
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView,
  Dimensions,
  AppRegistry
} from 'react-native';

import WelcomeScreen from './android/app/src/components/WelcomeScreen'
import GettingStarted from './android/app/src/components/GettingStarted'
import BudgetHomePage from './android/app/src/components/BudgetHomePage'
import EStyleSheet from 'react-native-extended-stylesheet'

import { TotalSchema, HomeSchema, CurrentBalancesSchema, IndividualExpenseSchema, MonthlyBudgetSchema} from './android/app/src/components/Schemes'

const Realm = require('realm')

const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380})


export default class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      showWelcome: false,
      showBudgetHomePage: false,
    }
  }

  componentDidMount(){
    Realm.open({schema: [ TotalSchema ]})
      .then(realm => {
      let retrievedTotal = realm.objects('Total')
      if (retrievedTotal['0'].totalMonthlySpending !== undefined) {
        this.setState({totalMonthlySpending: retrievedTotal['0'].totalMonthlySpending,
                      entertainmentBudget: retrievedTotal['0'].entertainmentBudget,
                      billsBudget: retrievedTotal['0'].billsBudget,
                      transportBudget: retrievedTotal['0'].transportBudget,
                      foodBudget: retrievedTotal['0'].foodBudget,
                      miscBudget: retrievedTotal['0'].miscBudget,
                      reward: retrievedTotal['0'].reward})
      }
      realm.close()
      this.setState({showBudgetHomePage: true})
    })
  }

  toggleWelcome = () => {
    this.setState({showWelcome: true})
  }

  toggleHomeScreen = () => {
    this.setState({showBudgetHomePage: !this.state.showBudgetHomePage})

  }

  myCallback = (dataFromChild) => {
    this.setState({totalMonthlySpending: dataFromChild[0],
                    entertainmentBudget: dataFromChild[1],
                    billsBudget: dataFromChild[2],
                    transportBudget: dataFromChild[3],
                    foodBudget: dataFromChild[4],
                    miscBudget: dataFromChild[5],
                    reward: dataFromChild[6]})
  }



  render() {
    return (
      <View style={styles.container}>
      {this.state.showBudgetHomePage ? <BudgetHomePage toggleHomeScreen={this.toggleHomeScreen} entertainmentBudget={this.state.entertainmentBudget} billsBudget={this.state.billsBudget} foodBudget={this.state.foodBudget} transportBudget={this.state.transportBudget} miscBudget={this.state.miscBudget} totalData={this.state.totalMonthlySpending} reward={this.state.reward} /> :
       <View >
        {this.state.showWelcome ?  <GettingStarted callbackFromParent={this.myCallback} toggleHomeScreen={this.toggleHomeScreen} /> : <WelcomeScreen toggleWelcome={this.toggleWelcome}/>}
      </View>}
      </View>
    )
  }
}

const styles = EStyleSheet.create({
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
