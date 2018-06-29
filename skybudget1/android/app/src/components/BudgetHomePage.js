import React, { Component } from 'react';
import { Text, AppRegistry, View, StyleSheet, TextInput, Button, AsyncStorage, ScrollView, TouchableHighlight, Animated, TouchableOpacity, Modal, ListView } from 'react-native';
import { TotalSchema, CurrentBalancesSchema, HomeSchema, MonthlyBudgetSchema, IndividualExpenseSchema } from './Schemes'
import Entertainment from './Entertainment'
import Expand from 'react-native-simple-expand'


const Realm = require('realm')


class BudgetHomePage extends Component {
  constructor(props) {
    super(props)
    this.state = { realm: null,
                   currentItem: '',
                   currentPrice: '',
                   totalSpent: '0',

                   entModalVisible: false,
                   billsModalVisible: false,
                   foodModalVisible: false,
                   transportModalVisible:false,
                   miscModalVisible: false,
                   showBudgetHome: true,

                   currentMonth: 'June2020',

                   entertainmentSpent: '0',
                   billsSpent: '0',
                   foodSpent: '0',
                   transportSpent: '0',
                   miscSpent: '0',

                  currentMonthEntPurchases: [{}],
                  currentMonthBillsPurchases: [{}],
                  currentMonthFoodPurchases: [{}],
                  currentMonthTransportPurchases: [{}],
                  currentMonthMiscPurchases: [{}]}
  }

  componentDidMount = () => {
    Realm.open({schemas: [MonthlyBudgetSchema, IndividualExpenseSchema]})
      .then(realm =>{
        let populateBudgetData = realm.objects('MonthlyBudget')
        for (i = 0; i < populateBudgetData.length; i++){
          if (populateBudgetData[i].id === this.state.currentMonth){
            let entPurchasesArray = []
            let billsPurchasesArray = []
            let foodPurchasesArray = []
            let transportPurchasesArray =[]
            let miscPurchasesArray = []
            let createEntData = populateBudgetData[i].entertainmentPurchases.map(purchase => {
              return entPurchasesArray.push({price: purchase.price, item:purchase.purchasedItem})
            })
            this.setState({currentMonthEntPurchases: entPurchasesArray})
            let totalEntSpent = this.state.currentMonthEntPurchases.reduce((total, purchase) => {
              return total + purchase.price
            }, 0)
            this.setState({entertainmentSpent: totalEntSpent})
            let createBillsData = populateBudgetData[i].billsPurchases.map(purchase => {
              return billsPurchasesArray.push({price: purchase.price, item:purchase.purchasedItem})
            })
            this.setState({currentMonthBillsPurchases: billsPurchasesArray})
            let totalBillsSpent = this.state.currentMonthBillsPurchases.reduce((total, purchase) => {
              return total + purchase.price
            }, 0)
            this.setState({billsSpent: totalBillsSpent})
            let createFoodData = populateBudgetData[i].foodPurchases.map(purchase => {
              return foodPurchasesArray.push({price: purchase.price, item:purchase.purchasedItem})
            })
            this.setState({currentMonthFoodPurchases: foodPurchasesArray})
            let totalFoodSpent = this.state.currentMonthFoodPurchases.reduce((total, purchase) => {
              return total + purchase.price
            }, 0)
            this.setState({foodSpent: totalFoodSpent})
            let createTransportData = populateBudgetData[i].transportPurchases.map(purchase => {
              return transportPurchasesArray.push({price: purchase.price, item:purchase.purchasedItem})
            })
            this.setState({currentMonthTransportPurchases: transportPurchasesArray})
            let totalTransportSpent = this.state.currentMonthTransportPurchases.reduce((total, purchase) => {
              return total + purchase.price
            }, 0)
            this.setState({transportSpent: totalTransportSpent})
            let createMiscData = populateBudgetData[i].miscPurchases.map(purchase => {
              return miscPurchasesArray.push({price: purchase.price, item:purchase.purchasedItem})
            })
            this.setState({currentMonthMiscPurchases: miscPurchasesArray})
            let totalMiscSpent = this.state.currentMonthMiscPurchases.reduce((total, purchase) => {
              return total + purchase.price
            }, 0)
            this.setState({miscSpent: totalMiscSpent})
            this.setState({totalSpent: parseInt(this.state.entertainmentSpent) + parseInt(this.state.billsSpent) + parseInt(this.state.foodSpent) + parseInt(this.state.transportSpent) + parseInt(this.state.miscSpent)})
          }
        }
      })
  }


  setEntModalVisible =() => {
  this.setState({entModalVisible: !this.state.entModalVisible})
}

  setBillsModalVisible = () => {
    this.setState({billsModalVisible: !this.state.billsModalVisible})
  }

  setFoodModalVisible = () => {
    this.setState({foodModalVisible: !this.state.foodModalVisible})
  }

  setTransportModalVisible = () => {
    this.setState({transportModalVisible: !this.state.transportModalVisible})
  }

  setMiscModalVisible = () => {
    this.setState({miscModalVisible: !this.state.miscModalVisible})
  }

  startNewMonth = () => {
    const realm = new Realm({schema: [ MonthlyBudgetSchema, IndividualExpenseSchema ]})
        realm.write(() => {
          let newMonthExpenses = realm.create('MonthlyBudget', {
            id: this.state.currentMonth
          })
        })
        this.setState({showBudgetHome: false})
  }

  goToDetail = () => {
    this.setState({showBudgetHome: false})

  }

  goBackToGettingStarted = () => {
    this.props.toggleHomeScreen()
  }

  addEntPurchase = () => {
    this.setState({ entModalVisible: !this.state.entModalVisible })
    Realm.open({schema: [ MonthlyBudgetSchema, IndividualExpenseSchema ]})
      .then(realm => {
      realm.write(() => {
        let currentMonth = realm.objects('MonthlyBudget')
        for (i = 0; i < currentMonth.length; i++){
          if (currentMonth[i].id === this.state.currentMonth){
            currentMonth[i].entertainmentPurchases.push({id: 'testID', date: new Date(), purchasedItem: this.state.currentItem, price: parseInt(this.state.currentPrice)})
            let joined = this.state.currentMonthEntPurchases.concat({price: parseInt(this.state.currentPrice), item: this.state.currentItem})
            this.setState({ currentMonthEntPurchases: joined,
                            entertainmentSpent: this.state.entertainmentSpent + parseInt(this.state.currentPrice),
                            entOpen: !this.state.entOpen})
          }
        }

      })
    })
  }

  addBillsPurchase = () => {
    this.setState({ billsModalVisible: !this.state.billsModalVisible })
    Realm.open({schema: [ MonthlyBudgetSchema, IndividualExpenseSchema ]})
      .then(realm => {
      realm.write(() => {
        let currentMonth = realm.objects('MonthlyBudget')
        for (i = 0; i < currentMonth.length; i++){
          if (currentMonth[i].id === this.state.currentMonth){
            currentMonth[i].billsPurchases.push({id: 'testID', date: new Date(), purchasedItem: this.state.currentItem, price: parseInt(this.state.currentPrice)})
            let joined = this.state.currentMonthBillsPurchases.concat({price: parseInt(this.state.currentPrice), item: this.state.currentItem})
            this.setState({ currentMonthBillsPurchases: joined,
                            billsSpent: this.state.billsSpent + parseInt(this.state.currentPrice),
                            billsOpen: !this.state.billsOpen})
          }
        }

      })
    })
  }

  addFoodPurchase = () => {
    this.setState({ foodModalVisible: !this.state.foodModalVisible })
    Realm.open({schema: [ MonthlyBudgetSchema, IndividualExpenseSchema ]})
      .then(realm => {
      realm.write(() => {
        let currentMonth = realm.objects('MonthlyBudget')
        for (i = 0; i < currentMonth.length; i++){
          if (currentMonth[i].id === this.state.currentMonth){
            currentMonth[i].foodPurchases.push({id: 'testID', date: new Date(), purchasedItem: this.state.currentItem, price: parseInt(this.state.currentPrice)})
            let joined = this.state.currentMonthFoodPurchases.concat({price: parseInt(this.state.currentPrice), item: this.state.currentItem})
            this.setState({ currentMonthFoodPurchases: joined,
                            foodSpent: this.state.foodSpent + parseInt(this.state.currentPrice),
                            foodOpen: !this.state.foodOpen})
          }
        }

      })
    })
  }

  addTransportPurchase = () => {
    this.setState({ transportModalVisible: !this.state.transportModalVisible })
    Realm.open({schema: [ MonthlyBudgetSchema, IndividualExpenseSchema ]})
      .then(realm => {
      realm.write(() => {
        let currentMonth = realm.objects('MonthlyBudget')
        for (i = 0; i < currentMonth.length; i++){
          if (currentMonth[i].id === this.state.currentMonth){
            currentMonth[i].transportPurchases.push({id: 'testID', date: new Date(), purchasedItem: this.state.currentItem, price: parseInt(this.state.currentPrice)})
            let joined = this.state.currentMonthTransportPurchases.concat({price: parseInt(this.state.currentPrice), item: this.state.currentItem})
            this.setState({ currentMonthTransportPurchases: joined,
                            transportSpent: this.state.transportSpent + parseInt(this.state.currentPrice),
                            transportOpen: !this.state.transportOpen})
          }
        }

      })
    })
  }

  addMiscPurchase = () => {
    this.setState({ miscModalVisible: !this.state.miscModalVisible })
    Realm.open({schema: [ MonthlyBudgetSchema, IndividualExpenseSchema ]})
      .then(realm => {
      realm.write(() => {
        let currentMonth = realm.objects('MonthlyBudget')
        for (i = 0; i < currentMonth.length; i++){
          if (currentMonth[i].id === this.state.currentMonth){
            currentMonth[i].miscPurchases.push({id: 'testID', date: new Date(), purchasedItem: this.state.currentItem, price: parseInt(this.state.currentPrice)})
            let joined = this.state.currentMonthMiscPurchases.concat({price: parseInt(this.state.currentPrice), item: this.state.currentItem})
            this.setState({ currentMonthMiscPurchases: joined,
                            miscSpent: this.state.miscSpent + parseInt(this.state.currentPrice),
                            miscOpen: !this.state.miscOpen})
          }
        }

      })
    })
  }

  render() {

    const fillEntData = this.state.currentMonthEntPurchases.map(purchase => {
      return <View>
             <Text style={{color:'white'}}>{purchase.price}</Text>
             <Text style={{color:'white'}}>{purchase.item}</Text>
             </View>
    })

    const fillBillsData = this.state.currentMonthBillsPurchases.map(purchase => {
      return <View>
            <Text style={{color:'white'}}>{purchase.price}</Text>
            <Text style={{color:'white'}}>{purchase.item}</Text>
            </View>
    })

    const fillFoodData = this.state.currentMonthFoodPurchases.map(purchase => {
      return <View>
            <Text style={{color:'white'}}>{purchase.price}</Text>
            <Text style={{color:'white'}}>{purchase.item}</Text>
            </View>
    })

    const fillTransportData = this.state.currentMonthTransportPurchases.map(purchase => {
      return <View>
            <Text style={{color:'white'}}>{purchase.price}</Text>
            <Text style={{color:'white'}}>{purchase.item}</Text>
            </View>
    })

    const fillMiscData = this.state.currentMonthMiscPurchases.map(purchase => {
      return <View>
            <Text style={{color:'white'}}>{purchase.price}</Text>
            <Text style={{color:'white'}}>{purchase.item}</Text>
            </View>
    })



    return (
      <View>
        {this.state.showBudgetHome
          ?
          <View>
            <Text style={{color:'#2A6972', fontSize: 50}}>SKYbudget</Text>
              <Text style={{color:'white', fontSize: 50}}>Starting Value {this.props.totalData}</Text>

            <Text style={{color:'white', fontSize: 50}}>Remaining {this.props.totalData - this.state.totalSpent}</Text>
            <Text style={{color:'white', fontSize: 50}}>Spent So Far {this.state.totalSpent}</Text>
            <Button onPress={this.goToDetail} title='Budget Detail Page'></Button>
            <Button onPress={this.startNewMonth} title='Start New Month!'></Button>
            <Button onPress={this.goBackToGettingStarted} title='Erase Budget and Start Over'></Button>
          </View>

          :

        <ScrollView>
          <View>
            <Text>Your Monthly Total: ${this.props.totalData}</Text>
          </View>
          <View>
            <Text>Spent</Text>
            <Text>Remaining</Text>
          </View>
          <View>

            <View style={styles.expandContainer}>

              <View  style={{marginTop: 22}}>
                <Modal
                  animationType="slide"
                  transparent={false}
                  visible={this.state.entModalVisible}
                  onRequestClose={() => {
                    alert('Modal has been closed.');
                  }}>
                  <View style={{marginTop: 22}}>
                    <View>
                      <TextInput onChangeText= {currentItem => this.setState({currentItem})} placeholder='Purchase Detail'></TextInput>
                      <TextInput onChangeText= {currentPrice => this.setState({currentPrice})} placeholder='Price' keyboardType='numeric'></TextInput>
                      <Button title='Submit' onPress={this.addEntPurchase}></Button>
                    </View>
                  </View>
                </Modal>
              </View>

              <TouchableOpacity style={styles.budgetGroup} onPress={() => this.setState({ entOpen: !this.state.entOpen })}>
                <Text style={styles.categoryText}>Entertainment</Text>
                <Text style={styles.remainingText}>${this.props.entertainmentBudget - this.state.entertainmentSpent}</Text>
              </TouchableOpacity>
              <Expand style={styles.expanded} value={this.state.entOpen}>
                <View>
                  {fillEntData}
                </View>
                <Button onPress={this.setEntModalVisible} title='Add Purchase'></Button>
              </Expand>
            </View>
            <View style={styles.expandContainer}>

              <View  style={{marginTop: 22}}>
                <Modal
                  animationType="slide"
                  transparent={false}
                  visible={this.state.billsModalVisible}
                  onRequestClose={() => {
                    alert('Modal has been closed.');
                  }}>
                  <View style={{marginTop: 22}}>
                    <View>
                      <TextInput onChangeText= {currentItem => this.setState({currentItem})} placeholder='Purchase Detail'></TextInput>
                      <TextInput onChangeText= {currentPrice => this.setState({currentPrice})} placeholder='Price' keyboardType='numeric'></TextInput>
                      <Button title='Submit' onPress={this.addBillsPurchase}></Button>
                    </View>
                  </View>
                </Modal>
              </View>

              <TouchableOpacity style={styles.budgetGroup} onPress={() => this.setState({ billsOpen: !this.state.billsOpen })}>
                <Text style={styles.categoryText}>Bills</Text>
                <Text style={styles.remainingText}>${this.props.billsBudget - this.state.billsSpent}</Text>
              </TouchableOpacity>
              <Expand value={this.state.billsOpen}>
                <View>
                  {fillBillsData}
                </View>
                <Button onPress={this.setBillsModalVisible} title='Add Purchase'></Button>
              </Expand>
            </View>

            <View style={styles.expandContainer}>
              <View  style={{marginTop: 22}}>
                <Modal
                  animationType="slide"
                  transparent={false}
                  visible={this.state.foodModalVisible}
                  onRequestClose={() => {
                    alert('Modal has been closed.');
                  }}>
                  <View style={{marginTop: 22}}>
                    <View>
                      <TextInput onChangeText= {currentItem => this.setState({currentItem})} placeholder='Purchase Detail'></TextInput>
                      <TextInput onChangeText= {currentPrice => this.setState({currentPrice})} placeholder='Price' keyboardType='numeric'></TextInput>
                      <Button title='Submit' onPress={this.addFoodPurchase}></Button>
                    </View>
                  </View>
                </Modal>
              </View>

              <TouchableOpacity style={styles.budgetGroup} onPress={() => this.setState({ foodOpen: !this.state.foodOpen })}>
                <Text style={styles.categoryText}>Food</Text>
                <Text style={styles.remainingText}>${this.props.foodBudget - this.state.foodSpent}</Text>
              </TouchableOpacity>
              <Expand value={this.state.foodOpen}>
                <View>
                  {fillFoodData}
                </View>
                <Button onPress={this.setFoodModalVisible} title='Add Purchase'></Button>
              </Expand>
            </View>
            <View style={styles.expandContainer}>

              <View  style={{marginTop: 22}}>
                <Modal
                  animationType="slide"
                  transparent={false}
                  visible={this.state.transportModalVisible}
                  onRequestClose={() => {
                    alert('Modal has been closed.');
                  }}>
                  <View style={{marginTop: 22}}>
                    <View>
                      <TextInput onChangeText= {currentItem => this.setState({currentItem})} placeholder='Purchase Detail'></TextInput>
                      <TextInput onChangeText= {currentPrice => this.setState({currentPrice})} placeholder='Price' keyboardType='numeric'></TextInput>
                      <Button title='Submit' onPress={this.addTransportPurchase}></Button>
                    </View>
                  </View>
                </Modal>
              </View>

              <TouchableOpacity style={styles.budgetGroup} onPress={() => this.setState({ transportOpen: !this.state.transportOpen })}>
                <Text style={styles.categoryText}>Transportation</Text>
                <Text style={styles.remainingText}>${this.props.transportBudget - this.state.transportSpent}</Text>
              </TouchableOpacity>
              <Expand value={this.state.transportOpen}>
                <View>
                  {fillTransportData}
                </View>
                <Button onPress={this.setTransportModalVisible} title='Add Purchase'></Button>
              </Expand>
            </View>
            <View style={styles.expandContainer}>

              <View  style={{marginTop: 22}}>
                <Modal
                  animationType="slide"
                  transparent={false}
                  visible={this.state.miscModalVisible}
                  onRequestClose={() => {
                    alert('Modal has been closed.');
                  }}>
                  <View style={{marginTop: 22}}>
                    <View>
                      <TextInput onChangeText= {currentItem => this.setState({currentItem})} placeholder='Purchase Detail'></TextInput>
                      <TextInput onChangeText= {currentPrice => this.setState({currentPrice})} placeholder='Price' keyboardType='numeric'></TextInput>
                      <Button title='Submit' onPress={this.addMiscPurchase}></Button>
                    </View>
                  </View>
                </Modal>
              </View>

              <TouchableOpacity style={styles.budgetGroup} onPress={() => this.setState({ miscOpen: !this.state.miscOpen })}>
                <Text style={styles.categoryText}>Misc</Text>
                <Text style={styles.remainingText}>${this.props.miscBudget - this.state.miscSpent}</Text>
              </TouchableOpacity>
              <Expand value={this.state.miscOpen}>
                <View>
                  {fillMiscData}
                </View>
                <Button onPress={this.setMiscModalVisible} title='Add Purchase'></Button>
              </Expand>
            </View>

          </View>
        </ScrollView>}
      </View>
      )

    }
  }

  const styles = StyleSheet.create({
    budgetGroup: {
      backgroundColor: '#1B2F4A',
      flex: 1,
      justifyContent: 'space-between',
      flexDirection: 'row',
      marginBottom: 10,
    },
    expanded: {
      backgroundColor: '#1B2F4A',
    },
    expandContainer: {
      flex: 1,
      backgroundColor: '#1B2F4A',
    },
    categoryText: {
      fontSize: 30,
      color: 'white'
    },
    remainingText: {
      fontSize: 30,
      backgroundColor: '#2A6972',
      color: 'white',
    },
    remainingTextRed: {
      fontSize: 30,
      backgroundColor: '#C95B74',
      color: 'white',
    }
  })


export default BudgetHomePage
