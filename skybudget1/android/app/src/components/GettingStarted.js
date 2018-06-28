import React, { Component } from 'react';
import { Text, AppRegistry, View, StyleSheet, TextInput, Button, AsyncStorage } from 'react-native';
import { TotalSchema } from './Schemes'
const Realm = require('realm')



class GettingStarted extends Component {
  constructor(props) {
    super(props)
    this.state = {showCreateBudget: false,
                  totalMonthlySpending: 0,
                  billsBudget: 0,
                  entertainmentBudget: 0,
                  transportBudget: 0,
                  foodBudget: 0,
                  miscBudget: 0,
                  displayedTotalMonthlySpending: 0,
                  controlColors: styles.dollarSignBlue,
                  realm: null}
  }


  showCreateBudget = () => {
    this.setState({showCreateBudget : true})
  }

  changeInitialBudget = () => {
    Realm.open({schema: [TotalSchema]})
    .then(realm => {
      realm.write(() => {
        let allTotals = realm.objects('Total')
        realm.delete(allTotals)
      })
    })
    this.setState({showCreateBudget: false,
                  totalMonthlySpending: 0,
                  billsBudget: 0,
                  entertainmentBudget: 0,
                  transportBudget: 0,
                  foodBudget: 0,
                  miscBudget: 0,
                  displayedTotalMonthlySpending: 0,
                  controlColors: styles.dollarSignBlue})
  }


  updateBackgroundTotalMonthlySpending = () => {
    var variableCombinedSpent = parseInt(this.state.entertainmentBudget) + parseInt(this.state.billsBudget) + parseInt(this.state.foodBudget) + parseInt(this.state.transportBudget) + parseInt(this.state.miscBudget)

    this.setState({displayedTotalMonthlySpending: this.state.totalMonthlySpending - variableCombinedSpent},
      this.updateColor = () => {
        var variableDisplayedTotalMonthlySpending = parseInt(this.state.displayedTotalMonthlySpending)
        if (variableDisplayedTotalMonthlySpending == 0) {
          this.setState({controlColors: styles.dollarSignGreen})
        } else if (variableDisplayedTotalMonthlySpending >= 0){
          this.setState({controlColors: styles.dollarSignBlue})
        } else if (variableDisplayedTotalMonthlySpending < 0){
          this.setState({controlColors: styles.dollarSignRed})
        }

      })
    }

saveData = () => {
  Realm.open({schema: [TotalSchema]})
    .then(realm => {
      realm.write(() => {
        let myBudget = realm.create('Total', {
          totalMonthlySpending: parseInt(this.state.totalMonthlySpending),
          entertainmentBudget: parseInt(this.state.entertainmentBudget),
          billsBudget: parseInt(this.state.billsBudget),
          transportBudget: parseInt(this.state.transportBudget),
          foodBudget: parseInt(this.state.foodBudget),
          miscBudget: parseInt(this.state.miscBudget),
        })
      })
      this.props.toggleHomeScreen()
    })
}

displayData = () => {
  Realm.open({schema: [TotalSchema]})
  .then(realm => {
    let retrievedTotal = realm.objects('Total')
      alert(JSON.stringify(retrievedTotal['0'].totalMonthlySpending))
  })
}

  render() {
    return (
      <View style={styles.container}>
      {this.state.showCreateBudget ?
        <View style={styles.container}>
          <Text style={this.state.controlColors}>${this.state.totalMonthlySpending - ((parseInt(this.state.entertainmentBudget) + parseInt(this.state.billsBudget) + parseInt(this.state.foodBudget) + parseInt(this.state.transportBudget) + parseInt(this.state.miscBudget)))}</Text>
          <Text style={styles.instructions}>Alright, Lets fill out the budget!</Text>

          <View>
            <View style={styles.dollarInputView}>
              <Text style={styles.individualBudgetInputContainer}>Entertainment</Text>
              <TextInput onSubmitEditing={this.updateBackgroundTotalMonthlySpending} onChangeText={entertainmentBudget => this.setState({entertainmentBudget})} style={styles.dollarInput} keyboardType='numeric' placeholder='0'></TextInput>
            </View>
            <View style={styles.dollarInputView}>
              <Text style={styles.individualBudgetInputContainer}>Bills</Text>
              <TextInput onSubmitEditing={this.updateBackgroundTotalMonthlySpending} onChangeText={billsBudget => this.setState({billsBudget})} style={styles.dollarInput} keyboardType='numeric' placeholder='0'></TextInput>
            </View>
            <View style={styles.dollarInputView}>
              <Text style={styles.individualBudgetInputContainer}>Food</Text>
              <TextInput onSubmitEditing={this.updateBackgroundTotalMonthlySpending} onChangeText={foodBudget => this.setState({foodBudget})} style={styles.dollarInput} keyboardType='numeric' placeholder='0'></TextInput>
            </View>
            <View style={styles.dollarInputView}>
              <Text style={styles.individualBudgetInputContainer}>Transportation</Text>
              <TextInput onSubmitEditing={this.updateBackgroundTotalMonthlySpending} onChangeText={transportBudget => this.setState({transportBudget})} style={styles.dollarInput} keyboardType='numeric' placeholder='0'></TextInput>
            </View>
            <View style={styles.dollarInputView}>
              <Text style={styles.individualBudgetInputContainer}>Misc</Text>
              <TextInput onSubmitEditing={this.updateBackgroundTotalMonthlySpending} onChangeText={miscBudget => this.setState({miscBudget})} style={styles.dollarInput} keyboardType='numeric' placeholder='0'></TextInput>
            </View>
          </View>
          <Button onPress={this.saveData} color='#2A6972' title='submit' style={styles.startButton}></Button>
          <Button onPress={this.displayData} color='#2A6972' title='check saved data' style={styles.startButton}></Button>

          <Button title='Change Total Monthly Spending' onPress={this.changeInitialBudget}></Button>
        </View>


          :


        <View style={styles.container}>
          <Text style={styles.instructions}>How much would you like to spend a month?</Text>
          <View style={styles.dollarInputView}>
            <Text style={styles.dollarSign}>$</Text>
            <TextInput onChangeText={totalMonthlySpending => this.setState({totalMonthlySpending})} style={styles.dollarInput} keyboardType='numeric' placeholder='0'></TextInput>
          </View>
          <Button onPress={this.showCreateBudget} color='#2A6972' title='submit' style={styles.startButton}>Submit</Button>
          <View style={styles.toolTip}>
            <Text>This will contain a tip about starting a budget</Text>
          </View>
        </View> }
      </View>

    )
  }
}



const styles = StyleSheet.create({
  individualBudgetInputContainer: {
    fontSize: 20,
    color: 'white',
    justifyContent: 'space-between'
  },
  dollarSignBlue: {
    fontSize:30,
    color: 'white',
    paddingRight: 5,
    paddingLeft: 5,
    backgroundColor: 'blue',
  },
  dollarSignRed: {
    fontSize:30,
    color: 'white',
    paddingRight: 5,
    paddingLeft: 5,
    backgroundColor: 'red',
  },
  dollarSignGreen: {
    fontSize:30,
    color: 'white',
    paddingRight: 5,
    paddingLeft: 5,
    backgroundColor: 'green',
  },
  dollarSign: {
    fontSize:30,
    color: 'white',
    paddingRight: 5,
    paddingLeft: 5,
  },
  toolTip: {
    height: 100,
    backgroundColor: '#EAAF69',
  },
  dollarInput:{
    width: 200,
    backgroundColor: 'white',
    fontSize: 20,
    marginLeft: 20,
    marginBottom: 10,
  },
  dollarInputView:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
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

export default GettingStarted
