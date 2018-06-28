import React, { Component } from 'react';
import { Text, AppRegistry, View, StyleSheet, TextInput, Button, AsyncStorage, ScrollView, TouchableHighlight, Animated, TouchableOpacity } from 'react-native';
import { TotalSchema } from './Schemes'
import Expand from 'react-native-simple-expand'

const Realm = require('realm')


class BudgetHomePage extends Component {
  constructor(props) {
    super(props)
    this.state = { realm: null }
  }

  componentDidMount(){
    Realm.open({schema: [TotalSchema]})
    .then(realm => {
      this.setState ({ realm })
    })
  }

  render() {
    const info = this.state.realm
      ?  this.state.realm.objects('Total')['0']
      : 'Loading...';

    return (
      <ScrollView>
        <View>
          <Text>Your Monthly Total: ${info.totalMonthlySpending}</Text>
        </View>
        <View>
          <Text>Spent</Text>
          <Text>Remaining</Text>
        </View>
        <View>
               <TouchableOpacity onPress={() => this.setState({ open: !this.state.open })}>
                <Text>Toggle Menu</Text>
               </TouchableOpacity>
               <Expand value={this.state.open}>
                   <Text>
                    Some very very very very very very very very very very very very very very very very very very very very great content
                   </Text>
               </Expand>
           </View>
        <View style={styles.budgetGroup}>
          <View>
            <Text>Entertainment</Text>
            <Text>${info.entertainmentBudget}</Text>

          </View>
          <View>
            <Text>Bills</Text>
            <Text>${info.billsBudget}</Text>
          </View>
          <View>
            <Text>Food</Text>
            <Text>${info.foodBudget}</Text>
          </View>
          <View>
            <Text>Transport</Text>
            <Text>${info.transportBudget}</Text>
          </View>
          <View>
            <Text>Misc</Text>
            <Text>${info.miscBudget}</Text>
          </View>

        </View>
      </ScrollView>

      )

    }
  }

  const styles = StyleSheet.create({
    budgetGroup: {
      backgroundColor: '#1B2F4A',
    },
  })


export default BudgetHomePage
