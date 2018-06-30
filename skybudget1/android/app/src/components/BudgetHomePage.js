import React, { Component } from 'react';
import { Text, AppRegistry, View, StyleSheet, TextInput, Button, AsyncStorage, ScrollView, TouchableHighlight, Animated, TouchableOpacity, Modal, ListView } from 'react-native'
import Swipeout from 'react-native-swipeout'
import { TotalSchema, CurrentBalancesSchema, HomeSchema, MonthlyBudgetSchema, IndividualExpenseSchema } from './Schemes'
import Expand from 'react-native-simple-expand'


const Realm = require('realm')

var swipeoutBtns = [{
  text: 'Button'
}]

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
                   newMonthModalVisible: false,
                   showBudgetHome: true,

                   currentMonth: 'CurrentMonth',
                   displayedMonth: 'Start a New Month to Get Started!',

                   entertainmentSpent: '0',
                   billsSpent: '0',
                   foodSpent: '0',
                   transportSpent: '0',
                   miscSpent: '0',
                   reward: '',

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
          if (populateBudgetData[i].currentOrArchived === this.state.currentMonth){
            this.setState({displayedMonth: populateBudgetData[i].id})



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
              return total + parseFloat(purchase.price)
            }, 0)
            this.setState({entertainmentSpent: totalEntSpent})
            let createBillsData = populateBudgetData[i].billsPurchases.map(purchase => {
              return billsPurchasesArray.push({price: parseFloat(purchase.price), item:purchase.purchasedItem})
            })
            this.setState({currentMonthBillsPurchases: billsPurchasesArray})
            let totalBillsSpent = this.state.currentMonthBillsPurchases.reduce((total, purchase) => {
              return total + parseFloat(purchase.price)
            }, 0)
            this.setState({billsSpent: totalBillsSpent})
            let createFoodData = populateBudgetData[i].foodPurchases.map(purchase => {
              return foodPurchasesArray.push({price: parseFloat(purchase.price), item:purchase.purchasedItem})
            })
            this.setState({currentMonthFoodPurchases: foodPurchasesArray})
            let totalFoodSpent = this.state.currentMonthFoodPurchases.reduce((total, purchase) => {
              return total + parseFloat(purchase.price)
            }, 0)
            this.setState({foodSpent: totalFoodSpent})
            let createTransportData = populateBudgetData[i].transportPurchases.map(purchase => {
              return transportPurchasesArray.push({price: parseFloat(purchase.price), item:purchase.purchasedItem})
            })
            this.setState({currentMonthTransportPurchases: transportPurchasesArray})
            let totalTransportSpent = this.state.currentMonthTransportPurchases.reduce((total, purchase) => {
              return total + parseFloat(purchase.price)
            }, 0)
            this.setState({transportSpent: totalTransportSpent})
            let createMiscData = populateBudgetData[i].miscPurchases.map(purchase => {
              return miscPurchasesArray.push({price: parseFloat(purchase.price), item:purchase.purchasedItem})
            })
            this.setState({currentMonthMiscPurchases: miscPurchasesArray})
            let totalMiscSpent = this.state.currentMonthMiscPurchases.reduce((total, purchase) => {
              return total + parseFloat(purchase.price)
            }, 0)

            this.setState({miscSpent: totalMiscSpent})
            this.setState({totalSpent: parseFloat(this.state.entertainmentSpent) + parseFloat(this.state.billsSpent) + parseFloat(this.state.foodSpent) + parseFloat(this.state.transportSpent) + parseFloat(this.state.miscSpent)})
          }
        }
        realm.close()
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

  openNewMonthModal = () => {
    this.setState({newMonthModalVisible: !this.state.newMonthModalVisible})
  }

  startNewMonth = () => {
    this.setState({newMonthModalVisible: !this.state.newMonthModalVisible})
    Realm.open({schema: [ MonthlyBudgetSchema, IndividualExpenseSchema ]})
      .then(realm => {
        realm.write(() => {
          let archivingMonthExpenses = realm.objects('MonthlyBudget')
          for(i = 0; i < archivingMonthExpenses.length; i++){
            if (archivingMonthExpenses[i].currentOrArchived === 'CurrentMonth'){
              archivingMonthExpenses[i].currentOrArchived = 'ArchivedMonth'
            }
          }

          let newMonthExpenses = realm.create('MonthlyBudget', {
            id: this.state.currentInputMonth + ' ' + this.state.currentInputYear,
            currentOrArchived: 'CurrentMonth'
          })
        })
        this.setState({  realm: null,
                         currentItem: '',
                         currentPrice: '',
                         totalSpent: '0',

                         entModalVisible: false,
                         billsModalVisible: false,
                         foodModalVisible: false,
                         transportModalVisible:false,
                         miscModalVisible: false,
                         newMonthModalVisible: false,
                         showBudgetHome: true,

                         currentMonth: 'CurrentMonth',
                         displayedMonth: this.state.currentInputMonth + ' ' + this.state.currentInputYear,

                         entertainmentSpent: '0',
                         billsSpent: '0',
                         foodSpent: '0',
                         transportSpent: '0',
                         miscSpent: '0',
                         reward: '0',

                        currentMonthEntPurchases: [{}],
                        currentMonthBillsPurchases: [{}],
                        currentMonthFoodPurchases: [{}],
                        currentMonthTransportPurchases: [{}],
                        currentMonthMiscPurchases: [{}]})
      })
  }

  goToDetail = () => {
    this.setState({showBudgetHome: false})
  }
  goToHome = () => {
    this.setState({showBudgetHome: true})
  }

  goBackToGettingStarted = () => {
    const realm = new Realm({schema: [ MonthlyBudgetSchema, IndividualExpenseSchema, TotalSchema ]})
        realm.write(() => {
          let archivingMonthExpenses = realm.objects('MonthlyBudget')
          for(i = 0; i < archivingMonthExpenses.length; i++){
            if (archivingMonthExpenses[i].currentOrArchived === 'CurrentMonth'){
              archivingMonthExpenses[i].currentOrArchived = 'ArchivedMonth'
            }
          }
        })
        this.setState({  realm: null,
                         currentItem: '',
                         currentPrice: '',
                         totalSpent: '0',

                         entModalVisible: false,
                         billsModalVisible: false,
                         foodModalVisible: false,
                         transportModalVisible:false,
                         miscModalVisible: false,
                         newMonthModalVisible: false,
                         showBudgetHome: true,

                         currentMonth: 'CurrentMonth',

                         entertainmentSpent: '0',
                         billsSpent: '0',
                         foodSpent: '0',
                         transportSpent: '0',
                         miscSpent: '0',

                        currentMonthEntPurchases: [{}],
                        currentMonthBillsPurchases: [{}],
                        currentMonthFoodPurchases: [{}],
                        currentMonthTransportPurchases: [{}],
                        currentMonthMiscPurchases: [{}]})
      realm.write(() => {
        let allTotals = realm.objects('Total')
        realm.delete(allTotals)
      })
    this.props.toggleHomeScreen()
  }

  addEntPurchase = () => {
    this.setState({ entModalVisible: !this.state.entModalVisible })
    const realm = new Realm({schema: [ MonthlyBudgetSchema, IndividualExpenseSchema ]})
      realm.write(() => {
        let currentMonth = realm.objects('MonthlyBudget')
        for (i = 0; i < currentMonth.length; i++){
          if (currentMonth[i].currentOrArchived === this.state.currentMonth){
            currentMonth[i].entertainmentPurchases.push({id: 'testID', date: new Date(), purchasedItem: this.state.currentItem, price: this.state.currentPrice})
            let joined = this.state.currentMonthEntPurchases.concat({price: this.state.currentPrice, item: this.state.currentItem})
            this.setState({ currentMonthEntPurchases: joined,
                            entertainmentSpent: this.state.entertainmentSpent + parseFloat(this.state.currentPrice),
                            entOpen: !this.state.entOpen})
          }
        }

      })
  }

  addBillsPurchase = () => {
    this.setState({ billsModalVisible: !this.state.billsModalVisible })
    const realm = new Realm({schema: [ MonthlyBudgetSchema, IndividualExpenseSchema ]})
      realm.write(() => {
        let currentMonth = realm.objects('MonthlyBudget')
        for (i = 0; i < currentMonth.length; i++){
          if (currentMonth[i].currentOrArchived === this.state.currentMonth){
            currentMonth[i].billsPurchases.push({id: 'testID', date: new Date(), purchasedItem: this.state.currentItem, price: this.state.currentPrice})
            let joined = this.state.currentMonthBillsPurchases.concat({price: this.state.currentPrice, item: this.state.currentItem})
            this.setState({ currentMonthBillsPurchases: joined,
                            billsSpent: this.state.billsSpent + this.state.currentPrice,
                            billsOpen: !this.state.billsOpen})
          }
        }

      })
  }

  addFoodPurchase = () => {
    this.setState({ foodModalVisible: !this.state.foodModalVisible })
    Realm.open({schema: [ MonthlyBudgetSchema, IndividualExpenseSchema ]})
      .then(realm => {
      realm.write(() => {
        let currentMonth = realm.objects('MonthlyBudget')
        for (i = 0; i < currentMonth.length; i++){
          if (currentMonth[i].currentOrArchived === this.state.currentMonth){
            currentMonth[i].foodPurchases.push({id: 'testID', date: new Date(), purchasedItem: this.state.currentItem, price: this.state.currentPrice})
            let joined = this.state.currentMonthFoodPurchases.concat({price: this.state.currentPrice, item: this.state.currentItem})
            this.setState({ currentMonthFoodPurchases: joined,
                            foodSpent: this.state.foodSpent + this.state.currentPrice,
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
          if (currentMonth[i].currentOrArchived === this.state.currentMonth){
            currentMonth[i].transportPurchases.push({id: 'testID', date: new Date(), purchasedItem: this.state.currentItem, price: this.state.currentPrice})
            let joined = this.state.currentMonthTransportPurchases.concat({price: this.state.currentPrice, item: this.state.currentItem})
            this.setState({ currentMonthTransportPurchases: joined,
                            transportSpent: this.state.transportSpent + this.state.currentPrice,
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
          if (currentMonth[i].currentOrArchived === this.state.currentMonth){
            currentMonth[i].miscPurchases.push({id: 'testID', date: new Date(), purchasedItem: this.state.currentItem, price: this.state.currentPrice})
            let joined = this.state.currentMonthMiscPurchases.concat({price: this.state.currentPrice, item: this.state.currentItem})
            this.setState({ currentMonthMiscPurchases: joined,
                            miscSpent: this.state.miscSpent + this.state.currentPrice,
                            miscOpen: !this.state.miscOpen})
          }
        }

      })
    })
  }

  claimReward = () => {
    alert('Congratulations! You deserve it. Treat Yo Self')
    Realm.open({schema: [MonthlyBudgetSchema, IndividualExpenseSchema]})
      .then(realm => {
        let rewardClaim = realm.objects('MonthlyBudget')
        for (i = 0; i < rewardClaim.length; i++){
          if (rewardClaim[i].currentOrArchived === this.state.currentMonth){
            rewardClaim[i].rewardClaimed = true
            rewardClaim[i].rewardToSavings = false
          }
        }
    })
  }

  sendToSavings = () => {
    alert('You will get it next time! Remember to commit that money to your savings account!')
    Realm.open({schema: [MonthlyBudgetSchema, IndividualExpenseSchema]})
      .then(realm => {
        let rewardClaim = realm.objects('MonthlyBudget')
        for (i = 0; i < rewardClaim.length; i++){
          if (rewardClaim[i].currentOrArchived === this.state.currentMonth){
            rewardClaim[i].rewardClaimed = false
            rewardClaim[i].rewardToSavings = true
          }
        }
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
      return <Swipeout right={swipeoutBtns}>
            <View>
            <Text style={{color:'white'}}>{purchase.price}</Text>
            <Text style={{color:'white'}}>{purchase.item}</Text>
            </View>
            </Swipeout>
    })



    return (
      <View>
        {this.state.showBudgetHome
          ?
          <View>
            <Text style={{color:'#2A6972', fontSize: 50}}>SKYbudget</Text>
              <Text style={{color:'white', fontSize: 50}}>Starting Value {this.props.totalData}</Text>

            <Text style={{color:'white', fontSize: 50}}>Remaining {parseFloat(this.props.totalData - this.state.totalSpent).toFixed(2)}</Text>
            <Text style={{color:'white', fontSize: 50}}>Spent So Far {parseFloat(this.state.totalSpent).toFixed(2)}</Text>
            <Button onPress={this.goToDetail} title='Budget Detail Page'></Button>
            <Button onPress={this.openNewMonthModal} title='Start New Month!'></Button>

              <View  style={{marginTop: 22}}>
                <Modal
                  animationType="slide"
                  transparent={false}
                  visible={this.state.newMonthModalVisible}
                  onRequestClose={() => {
                    this.openNewMonthModal()
                  }}>
                  <View style={{marginTop: 22}}>
                    <View>
                      <TextInput onChangeText= {currentInputMonth => this.setState({currentInputMonth})} placeholder='Month'></TextInput>
                      <TextInput onChangeText= {currentInputYear => this.setState({currentInputYear})} placeholder='Year' keyboardType='numeric'></TextInput>
                      <Button title='Submit' onPress={this.startNewMonth}></Button>
                      <Text>This will archive the current month and begin a new one. Make sure you are done inputing all of your purchases for this month before starting a new one</Text>
                    </View>
                  </View>
                </Modal>
              </View>

            <Button onPress={this.goBackToGettingStarted} title='Erase Budget and Start Over'></Button>
          </View>

          :

        <ScrollView>
          <View>
            <Text>{this.state.displayedMonth}</Text>
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
                <Text style={styles.remainingText}>${parseFloat(this.props.entertainmentBudget - this.state.entertainmentSpent).toFixed(2)}</Text>
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
                <Text style={styles.remainingText}>${parseFloat(this.props.billsBudget - this.state.billsSpent).toFixed(2)}</Text>
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
                <Text style={styles.remainingText}>${parseFloat(this.props.foodBudget - this.state.foodSpent).toFixed(2)}</Text>
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
                <Text style={styles.remainingText}>${parseFloat(this.props.transportBudget - this.state.transportSpent).toFixed(2)}</Text>
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
                <Text style={styles.remainingText}>${parseFloat(this.props.miscBudget - this.state.miscSpent).toFixed(2)}</Text>
              </TouchableOpacity>
              <Expand value={this.state.miscOpen}>
                <View>
                  {fillMiscData}
                </View>
                <Button onPress={this.setMiscModalVisible} title='Add Purchase'></Button>
              </Expand>
            </View>
            <View>
              <Text style={styles.categoryText}>Reward</Text>
              <View style={{flexDirection:'row'}}>
                <Button onPress={this.claimReward} color='#EAAF69' title='Claim Reward'></Button>
                <Text style={styles.remainingText}>${parseFloat(this.props.reward)}</Text>
                <Button onPress={this.sendToSavings} color='#EAAF69' title='Send To Savings'></Button>
              </View>

            </View>
            <Button onPress={this.goToHome} title='QuickView'></Button>

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
