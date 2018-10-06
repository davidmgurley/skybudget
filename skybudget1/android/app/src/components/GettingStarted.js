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

          <Text style={styles.instructions}>How much would you like to spend a month?</Text>
          <View style={styles.dollarInputView}>
            <Text style={styles.dollarSign}>$</Text>
            <TextInput onChangeText={totalMonthlySpending => this.setState({totalMonthlySpending})} style={styles.dollarInput} keyboardType='numeric' placeholder='0'></TextInput>
          </View>
          <TouchableOpacity  onPress={this.showCreateBudget}>
            <Text style={styles.startButton}>Submit</Text>
          </TouchableOpacity>
          <View style={styles.toolTip}>
            <Text style={styles.toolTipText}>Budget Tip!</Text>
            <Text style={styles.toolTipText}>We recommend putting your entire monthly income as your monthly spending budget. Every healthy budget has plenty of space for savings and investment. You will account for those dollars when setting up your bills section in the next step.</Text>
          </View>
        </View> }
      </View>

    )
  }
}



const styles = EStyleSheet.create({
  individualBudgetInputContainer: {
    fontSize: 20,
    color: 'white',
    justifyContent: 'space-between',
    fontFamily: 'Lato-Regular'

  },

  rocket: {
    width: '75rem',
    height: '100rem'
  },
  dollarSignBlue: {
    fontSize:30,
    color: 'white',
    paddingRight: 5,
    paddingLeft: 5,
    backgroundColor: '#2A6972',
    borderRadius: 5,
    fontFamily: 'Lato-Regular'

  },
  dollarSignRed: {
    fontSize:30,
    color: 'white',
    paddingRight: 5,
    paddingLeft: 5,
    backgroundColor: '#C95B74',
    borderRadius: 5,
    fontFamily: 'Lato-Regular'

  },
  dollarSignGreen: {
    fontSize:30,
    color: 'white',
    paddingRight: 5,
    paddingLeft: 5,
    backgroundColor: '#5D9D83',
    borderRadius: 5,
    fontFamily: 'Lato-Regular'

  },
  dollarSign: {
    fontSize:30,
    color: 'white',
    marginBottom: 3,
    fontFamily: 'Lato-Regular'


  },
  toolTip: {
    height: 190,
    width: 350,
    backgroundColor: '#EAAF69',
    marginTop: 50,
    justifyContent: 'center',
    borderRadius: 20
  },
  toolTipText: {
    marginLeft: 30,
    marginRight: 30,
    marginTop: 5,
    marginBottom: 8,
    fontSize: 16,
    fontFamily: 'Lato-Regular'


  },
  dollarInput:{
    width: 200,
    backgroundColor: 'white',
    fontSize: 20,
    marginLeft: 10,
    marginBottom: 10,
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
    fontSize: '22rem',
    textAlign: 'center',
    color: '#2A6972',
    marginBottom: 40,
    fontFamily: 'Lato-Regular'

  },
  instructions2: {
    fontSize: 25,
    textAlign: 'center',
    color: '#2A6972',
    marginBottom: 20,
    fontFamily: 'Lato-Regular'

  },
  startButton: {
    color: '#2A6972',
    fontSize: 30,
    marginTop: 10,
    textAlign: 'center',
    fontFamily: 'Lato-Regular'

  },
  startOverButton: {
    color: 'white',
    fontSize: 30,
    marginTop: 10,
    textAlign: 'center',
    backgroundColor: '#C95B74',
    paddingRight: 10,
    paddingLeft: 10,
    borderRadius: 5,
    fontFamily: 'Lato-Regular'

  },
  startSubmitButton: {
    color: 'white',
    fontSize: 30,
    marginTop: 10,
    textAlign: 'center',
    backgroundColor: '#5D9D83',
    paddingRight: 10,
    paddingLeft: 10,
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
