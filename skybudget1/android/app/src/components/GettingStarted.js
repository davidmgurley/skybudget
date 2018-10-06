import React, { Component } from 'react';
import { Text, AppRegistry, View, StyleSheet, TextInput, Button, AsyncStorage, ScrollView, TouchableOpacity, Image } from 'react-native';
import { TotalSchema, HomeSchema, CurrentBalancesSchema, IndividualExpenseSchema, MonthlyBudgetSchema} from './Schemes'
import EStyleSheet from 'react-native-extended-stylesheet'

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
  var listInfo = [this.state.totalMonthlySpending, this.state.entertainmentBudget, this.state.billsBudget, this.state.foodBudget, this.state.transportBudget, this.state.miscBudget, this.state.reward]
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
          <Image style={styles.rocket} source={require('./rocket.png')} />

          <Text style={this.state.controlColors}>${this.state.totalMonthlySpending - ((parseFloat(this.state.entertainmentBudget) + parseFloat(this.state.billsBudget) + parseFloat(this.state.foodBudget) + parseFloat(this.state.transportBudget) + parseFloat(this.state.miscBudget) + parseFloat(this.state.reward)))}</Text>
          <Text style={styles.instructions2}>Alright, time to fill out the budget!</Text>

          <ScrollView style={{backgroundColor: '#1B2F4A'}}>
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
            <View style={styles.twoButtonGroup}>
            <TouchableOpacity  onPress={this.saveData}>
              <Text style={styles.startSubmitButton}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity  onPress={this.changeInitialBudget}>
              <Text style={styles.startOverButton}>Start Over</Text>
            </TouchableOpacity>
          </View>
          </ScrollView>
        </View>


          :


        <View style={styles.container}>
          <Image style={styles.rocket} source={require('./rocket.png')} />

          <Text style={styles.instructions}>How much would you like to spend each month?</Text>
          <View style={styles.dollarInputView}>
            <Text style={styles.dollarSignInitial}>$</Text>
            <TextInput onChangeText={totalMonthlySpending => this.setState({totalMonthlySpending})} style={styles.dollarInputInitial} keyboardType='numeric' placeholder='0'></TextInput>
          </View>
          <TouchableOpacity  onPress={this.showCreateBudget}>
            <Text style={styles.startButton}>Submit</Text>
          </TouchableOpacity>
          <View style={styles.toolTip}>
            <Text style={styles.toolTipTextTitle}>Budget Tip!</Text>
            <Text style={styles.toolTipText}>We recommend putting your entire monthly income as your monthly spending budget. Every healthy budget has plenty of space for savings and investment. You will account for those dollars when setting up your bills section in the next step.</Text>
          </View>
        </View> }
      </View>

    )
  }
}



const styles = EStyleSheet.create({
  individualBudgetInputContainer: {
    fontSize: '20rem',
    color: 'white',
    justifyContent: 'space-between',
    fontFamily: 'Lato-Regular'
  },

  rocket: {
    width: '65rem',
    height: '90rem',
    marginBottom: '10rem'
  },

  dollarSignBlue: {
    fontSize:'25rem',
    color: 'white',
    paddingRight: '7rem',
    paddingLeft: '7rem',
    paddingTop: '3rem',
    paddingBottom: '3rem',
    backgroundColor: '#2A6972',
    borderRadius: 5,
    marginBottom: '5rem',
    fontFamily: 'Lato-Regular'
  },

  dollarSignRed: {
    fontSize:'25rem',
    color: 'white',
    paddingRight: '7rem',
    paddingLeft: '7rem',
    paddingTop: '3rem',
    paddingBottom: '3rem',
    backgroundColor: '#C95B74',
    borderRadius: 5,
    marginBottom: '5rem',
    fontFamily: 'Lato-Regular'
  },

  dollarSignGreen: {
    fontSize:'25rem',
    color: 'white',
    paddingRight: '7rem',
    paddingLeft: '7rem',
    paddingTop: '3rem',
    paddingBottom: '3rem',
    backgroundColor: '#5D9D83',
    borderRadius: 5,
    marginBottom: '5rem',
    fontFamily: 'Lato-Regular'
  },

  dollarSignInitial: {
    fontSize:'20rem',
    color: 'white',
    marginBottom: 10,
    fontFamily: 'Lato-Regular'
  },

  toolTip: {
    height: '125rem',
    width: '275rem',
    backgroundColor: '#EAAF69',
    marginTop: '40rem',
    justifyContent: 'center',
    borderRadius: 20
  },

  toolTipText: {
    marginLeft: '10rem',
    marginRight: '10rem',
    marginTop: '5rem',
    marginBottom: '5rem',
    fontSize: '12rem',
    fontFamily: 'Lato-Regular'
  },

  toolTipTextTitle: {
    textAlign: 'center',
    marginTop: '5rem',
    marginBottom: '5rem',
    fontSize: '15rem',
    fontFamily: 'Lato-Regular'
  },

  dollarInput:{
    width: '165rem',
    backgroundColor: 'white',
    fontSize: '16rem',
    marginLeft: '20rem',
    marginBottom: '10rem',
    borderRadius: 5,
    fontFamily: 'Lato-Regular'
  },

  dollarInputInitial:{
    width: '100rem',
    height: '35rem',
    backgroundColor: 'white',
    fontSize: '15rem',
    marginLeft: 5,
    marginRight: '7rem',
    marginBottom: '5rem',
    borderRadius: 5,
    fontFamily: 'Lato-Regular'
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
    fontFamily: 'Lato-Regular'
  },

  instructions: {
    fontSize: '23rem',
    textAlign: 'center',
    color: '#2A6972',
    marginBottom: '20rem',
    marginLeft: '20rem',
    marginRight: '20rem',
    fontFamily: 'Lato-Regular'
  },

  instructions2: {
    fontSize: '20rem',
    textAlign: 'center',
    color: '#2A6972',
    marginBottom: 20,
    fontFamily: 'Lato-Regular'
  },

  startButton: {
    color: '#2A6972',
    fontSize: '25rem',
    marginTop: 10,
    textAlign: 'center',
    fontFamily: 'Lato-Regular'
  },

  startOverButton: {
    color: 'white',
    fontSize: '25rem',
    marginTop: '8rem',
    textAlign: 'center',
    backgroundColor: '#C95B74',
    paddingRight: '10rem',
    paddingLeft: '10rem',
    borderRadius: 5,
    fontFamily: 'Lato-Regular'
  },

  startSubmitButton: {
    color: 'white',
    fontSize: '25rem',
    marginTop: '8rem',
    textAlign: 'center',
    backgroundColor: '#5D9D83',
    paddingRight: '10rem',
    paddingLeft: '10rem',
    borderRadius: 5,
    fontFamily: 'Lato-Regular'
  },

  twoButtonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 7,
    marginRight: 7,
    marginBottom: 10,
  }

})

export default GettingStarted
