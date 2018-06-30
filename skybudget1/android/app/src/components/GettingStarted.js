import React, { Component } from 'react';
import { Text, AppRegistry, View, StyleSheet, TextInput, Button, AsyncStorage, ScrollView } from 'react-native';
import { TotalSchema, HomeSchema, CurrentBalancesSchema, IndividualExpenseSchema, MonthlyBudgetSchema} from './Schemes'

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
                  reward: 0,
                  displayedTotalMonthlySpending: 0,
                  controlColors: styles.dollarSignBlue,
                  realm: null}
  }


  showCreateBudget = () => {
    this.setState({showCreateBudget : true})
  }

  changeInitialBudget = () => {
    const realm = new Realm({schema: [TotalSchema]})

      realm.write(() => {
        let allTotals = realm.objects('Total')
        realm.delete(allTotals)
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
    var variableCombinedSpent = parseFloat(this.state.entertainmentBudget) + parseFloat(this.state.billsBudget) + parseFloat(this.state.foodBudget) + parseFloat(this.state.transportBudget) + parseFloat(this.state.miscBudget) + parseFloat(this.state.reward)

    this.setState({displayedTotalMonthlySpending: this.state.totalMonthlySpending - variableCombinedSpent},
      this.updateColor = () => {
        var variableDisplayedTotalMonthlySpending = parseFloat(this.state.displayedTotalMonthlySpending)
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
  var listInfo = this.state.totalMonthlySpending
  Realm.open({schema: [TotalSchema, CurrentBalancesSchema]})
    .then(realm => {
      realm.write(() => {
        let myBudget = realm.create('Total', {
          totalMonthlySpending: parseFloat(this.state.totalMonthlySpending),
          entertainmentBudget: parseFloat(this.state.entertainmentBudget),
          billsBudget: parseFloat(this.state.billsBudget),
          transportBudget: parseFloat(this.state.transportBudget),
          foodBudget: parseFloat(this.state.foodBudget),
          miscBudget: parseFloat(this.state.miscBudget),
          reward: parseFloat(this.state.reward)
        })
        let initialCurrentTotals = realm.create('CurrentBalances', {
          entertainmentCurrent: parseFloat(this.state.entertainmentBudget),
          billsCurrent: parseFloat(this.state.billsBudget),
          transportCurrent: parseFloat(this.state.transportBudget),
          foodCurrent: parseFloat(this.state.foodBudget),
          miscCurrent: parseFloat(this.state.miscBudget),
          reward: parseFloat(this.state.reward)

        })
      })
      realm.close()
    })
      this.props.toggleHomeScreen()
      this.props.callbackFromParent(listInfo)
}


  render() {
    return (
      <View style={styles.container}>
      {this.state.showCreateBudget ?
        <View style={styles.container}>
          <Text style={this.state.controlColors}>${this.state.totalMonthlySpending - ((parseFloat(this.state.entertainmentBudget) + parseFloat(this.state.billsBudget) + parseFloat(this.state.foodBudget) + parseFloat(this.state.transportBudget) + parseFloat(this.state.miscBudget) + parseFloat(this.state.reward)))}</Text>
          <Text style={styles.instructions}>Alright, Lets fill out the budget!</Text>

          <ScrollView>
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
            <View style={styles.dollarInputView}>
              <Text style={styles.individualBudgetInputContainer}>Reward</Text>
              <TextInput onSubmitEditing={this.updateBackgroundTotalMonthlySpending} onChangeText={reward => this.setState({reward})} style={styles.dollarInput} keyboardType='numeric' placeholder='0'></TextInput>
            </View>

            <Button onPress={this.saveData} color='#2A6972' title='submit' style={styles.startButton}></Button>

            <Button title='Change Total Monthly Spending' onPress={this.changeInitialBudget}></Button>
          </ScrollView>
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
