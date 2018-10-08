import React, { Component } from 'react';
import { Text, AppRegistry, View, StyleSheet, TextInput, Button, AsyncStorage, ScrollView, TouchableHighlight, Animated, TouchableOpacity, Modal, ListView, Image } from 'react-native'
import Swipeout from 'react-native-swipeout'
import { TotalSchema, CurrentBalancesSchema, HomeSchema, MonthlyBudgetSchema, IndividualExpenseSchema } from './Schemes'
import Expand from 'react-native-simple-expand'
import EStyleSheet from 'react-native-extended-stylesheet'

const Realm = require('realm')

var swipeoutBtns = [{
  backgroundColor: '#C95B74',
  text: 'Delete'
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
                   eraseBudgetModalVisible: false,
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
              return entPurchasesArray.push({price: parseFloat(purchase.price).toString(), item:purchase.item})
            })
            this.setState({currentMonthEntPurchases: entPurchasesArray})
            let totalEntSpent = this.state.currentMonthEntPurchases.reduce((total, purchase) => {
              return total + parseFloat(purchase.price)
            }, 0)
            this.setState({entertainmentSpent: totalEntSpent})
            let createBillsData = populateBudgetData[i].billsPurchases.map(purchase => {
              return billsPurchasesArray.push({price: parseFloat(purchase.price).toString(), item:purchase.item})
            })
            this.setState({currentMonthBillsPurchases: billsPurchasesArray})
            let totalBillsSpent = this.state.currentMonthBillsPurchases.reduce((total, purchase) => {
              return total + parseFloat(purchase.price)
            }, 0)
            this.setState({billsSpent: totalBillsSpent})
            let createFoodData = populateBudgetData[i].foodPurchases.map(purchase => {
              return foodPurchasesArray.push({price: parseFloat(purchase.price).toString(), item:purchase.item})
            })
            this.setState({currentMonthFoodPurchases: foodPurchasesArray})
            let totalFoodSpent = this.state.currentMonthFoodPurchases.reduce((total, purchase) => {
              return total + parseFloat(purchase.price)
            }, 0)
            this.setState({foodSpent: totalFoodSpent})
            let createTransportData = populateBudgetData[i].transportPurchases.map(purchase => {
              return transportPurchasesArray.push({price: parseFloat(purchase.price).toString(), item:purchase.item})
            })
            this.setState({currentMonthTransportPurchases: transportPurchasesArray})
            let totalTransportSpent = this.state.currentMonthTransportPurchases.reduce((total, purchase) => {
              return total + parseFloat(purchase.price)
            }, 0)
            this.setState({transportSpent: totalTransportSpent})
            let createMiscData = populateBudgetData[i].miscPurchases.map(purchase => {
              return miscPurchasesArray.push({price: parseFloat(purchase.price).toString(), item:purchase.item})
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

  openEraseBudget = () => {
    this.setState({eraseBudgetModalVisible: !this.state.eraseBudgetModalVisible})
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
            currentOrArchived: 'CurrentMonth',
            rewardClaimed: false,
            rewardToSavings: false,

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
    if(this.state.displayedMonth === 'Start a New Month to Get Started!'){
      alert('Oops! Start a new month to get started!')
    } else {
    this.setState({showBudgetHome: false})
    }
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
                         displayedMonth: 'Start a New Month to Get Started!',

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
            currentMonth[i].entertainmentPurchases.push({item: this.state.currentItem, price: this.state.currentPrice})
            let joined = this.state.currentMonthEntPurchases.concat({price: this.state.currentPrice, item: this.state.currentItem})
            this.setState({ currentMonthEntPurchases: joined,
                            entertainmentSpent: parseFloat(this.state.entertainmentSpent + parseFloat(this.state.currentPrice)),
                            entOpen: !this.state.entOpen,
                            totalSpent: parseFloat(this.state.totalSpent + parseFloat(this.state.currentPrice))})
          }
        }

      })
  }

  deleteEntPurchase = (selectedItem) => {
    Realm.open({schema: [ MonthlyBudgetSchema, IndividualExpenseSchema ]})
      .then(realm => {
        realm.write(()=> {
        let currentMonth = realm.objects('MonthlyBudget')
        for (i = 0; i < currentMonth.length; i++){
          if (currentMonth[i].currentOrArchived === this.state.currentMonth){
            let searchableArray = this.state.currentMonthEntPurchases
            for (j = 0; j < searchableArray.length; j++){
              if (searchableArray[j].item + searchableArray[j].price === selectedItem){
                let deletedItem = searchableArray.splice(j, 1)
                currentMonth[i].entertainmentPurchases = searchableArray
                this.setState({currentMonthEntPurchases: searchableArray,
                                entertainmentSpent: this.state.entertainmentSpent - parseFloat(deletedItem[0].price).toFixed(2),
                                totalSpent: this.state.totalSpent - parseFloat(deletedItem[0].price).toFixed(2)})
              }
            }
          }
        }
      })
    })
  }

  addBillsPurchase = () => {
    this.setState({ billsModalVisible: !this.state.billsModalVisible })
    const realm = new Realm({schema: [ MonthlyBudgetSchema, IndividualExpenseSchema ]})
      realm.write(() => {
        let currentMonth = realm.objects('MonthlyBudget')
        for (i = 0; i < currentMonth.length; i++){
          if (currentMonth[i].currentOrArchived === this.state.currentMonth){
            currentMonth[i].billsPurchases.push({item: this.state.currentItem, price: this.state.currentPrice})
            let joined = this.state.currentMonthBillsPurchases.concat({price: this.state.currentPrice, item: this.state.currentItem})
            this.setState({ currentMonthBillsPurchases: joined,
                            billsSpent: parseFloat(this.state.billsSpent + parseFloat(this.state.currentPrice)),
                            billsOpen: !this.state.billsOpen,
                            totalSpent: parseFloat(this.state.totalSpent + parseFloat(this.state.currentPrice))})
          }
        }

      })
  }

  deleteBillsPurchase = (selectedItem) => {
    Realm.open({schema: [ MonthlyBudgetSchema, IndividualExpenseSchema ]})
      .then(realm => {
        realm.write(()=> {
        let currentMonth = realm.objects('MonthlyBudget')
        for (i = 0; i < currentMonth.length; i++){
          if (currentMonth[i].currentOrArchived === this.state.currentMonth){
            let searchableArray = this.state.currentMonthBillsPurchases
            for (j = 0; j < searchableArray.length; j++){
              if (searchableArray[j].item + searchableArray[j].price === selectedItem){
                let deletedItem = searchableArray.splice(j, 1)
                currentMonth[i].billsPurchases = searchableArray
                this.setState({currentMonthBillsPurchases: searchableArray,
                                billsSpent: this.state.billsSpent - parseFloat(deletedItem[0].price).toFixed(2),
                                totalSpent: this.state.totalSpent - parseFloat(deletedItem[0].price).toFixed(2)})
              }
            }
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
          if (currentMonth[i].currentOrArchived === this.state.currentMonth){
            currentMonth[i].foodPurchases.push({item: this.state.currentItem, price: this.state.currentPrice})
            let joined = this.state.currentMonthFoodPurchases.concat({price: this.state.currentPrice, item: this.state.currentItem})
            this.setState({ currentMonthFoodPurchases: joined,
                            foodSpent: parseFloat(this.state.foodSpent + parseFloat(this.state.currentPrice)),
                            foodOpen: !this.state.foodOpen,
                            totalSpent: parseFloat(this.state.totalSpent + parseFloat(this.state.currentPrice))})
          }
        }
      })
    })
  }

  deleteFoodPurchase = (selectedItem) => {
    Realm.open({schema: [ MonthlyBudgetSchema, IndividualExpenseSchema ]})
      .then(realm => {
        realm.write(()=> {
        let currentMonth = realm.objects('MonthlyBudget')
        for (i = 0; i < currentMonth.length; i++){
          if (currentMonth[i].currentOrArchived === this.state.currentMonth){
            let searchableArray = this.state.currentMonthFoodPurchases
            for (j = 0; j < searchableArray.length; j++){
              if (searchableArray[j].item + searchableArray[j].price === selectedItem){
                let deletedItem = searchableArray.splice(j, 1)
                currentMonth[i].foodPurchases = searchableArray
                this.setState({currentMonthFoodPurchases: searchableArray,
                                foodSpent: this.state.foodSpent - parseFloat(deletedItem[0].price).toFixed(2),
                                totalSpent: this.state.totalSpent - parseFloat(deletedItem[0].price).toFixed(2)})
              }
            }
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
            currentMonth[i].transportPurchases.push({item: this.state.currentItem, price: this.state.currentPrice})
            let joined = this.state.currentMonthTransportPurchases.concat({price: this.state.currentPrice, item: this.state.currentItem})
            this.setState({ currentMonthTransportPurchases: joined,
                            transportSpent: parseFloat(this.state.transportSpent + parseFloat(this.state.currentPrice)),
                            transportOpen: !this.state.transportOpen,
                            totalSpent: parseFloat(this.state.totalSpent + parseFloat(this.state.currentPrice))})
          }
        }
      })
    })
  }

  deleteTransportPurchase = (selectedItem) => {
    Realm.open({schema: [ MonthlyBudgetSchema, IndividualExpenseSchema ]})
      .then(realm => {
        realm.write(()=> {
        let currentMonth = realm.objects('MonthlyBudget')
        for (i = 0; i < currentMonth.length; i++){
          if (currentMonth[i].currentOrArchived === this.state.currentMonth){
            let searchableArray = this.state.currentMonthTransportPurchases
            for (j = 0; j < searchableArray.length; j++){
              if (searchableArray[j].item + searchableArray[j].price === selectedItem){
                let deletedItem = searchableArray.splice(j, 1)
                currentMonth[i].transportPurchases = searchableArray
                this.setState({currentMonthTransportPurchases: searchableArray,
                                transportSpent: this.state.transportSpent - parseFloat(deletedItem[0].price).toFixed(2),
                                totalSpent: this.state.totalSpent - parseFloat(deletedItem[0].price).toFixed(2)})
              }
            }
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
            currentMonth[i].miscPurchases.push({item: this.state.currentItem, price: this.state.currentPrice})
            let joined = this.state.currentMonthMiscPurchases.concat({price: this.state.currentPrice, item: this.state.currentItem})
            this.setState({ currentMonthMiscPurchases: joined,
                            miscSpent: parseFloat(this.state.miscSpent + parseFloat(this.state.currentPrice)),
                            miscOpen: !this.state.miscOpen,
                            totalSpent: parseFloat(this.state.totalSpent + parseFloat(this.state.currentPrice))})
          }
        }
      })
    })
  }

  deleteMiscPurchase = (selectedItem) => {
    Realm.open({schema: [ MonthlyBudgetSchema, IndividualExpenseSchema ]})
      .then(realm => {
        realm.write(()=> {
        let currentMonth = realm.objects('MonthlyBudget')
        for (i = 0; i < currentMonth.length; i++){
          if (currentMonth[i].currentOrArchived === this.state.currentMonth){
            let searchableArray = this.state.currentMonthMiscPurchases
            for (j = 0; j < searchableArray.length; j++){
              if (searchableArray[j].item + searchableArray[j].price === selectedItem){
                let deletedItem = searchableArray.splice(j, 1)
                currentMonth[i].miscPurchases = searchableArray
                this.setState({currentMonthMiscPurchases: searchableArray,
                                miscSpent: this.state.miscSpent - parseFloat(deletedItem[0].price).toFixed(2),
                                totalSpent: this.state.totalSpent - parseFloat(deletedItem[0].price).toFixed(2)})
              }
            }
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
      return <Swipeout  backgroundColor='#1B2F4A' right={[{ onPress:this.deleteEntPurchase.bind(this, purchase.item + parseFloat(purchase.price)),  backgroundColor: '#C95B74', text: 'Delete'}]}>
            <View style={styles.budgetGroupPurchases}>
             <Text style={{color:'white', fontSize:15, fontStyle: 'italic', fontFamily: 'Lato-Regular'}}>{purchase.item}</Text>
             <Text style={{color:'white', fontSize: 15,fontFamily: 'Lato-Regular', marginRight: 15}}>{purchase.price}</Text>
             </View>
             </Swipeout>
    })

    const fillBillsData = this.state.currentMonthBillsPurchases.map(purchase => {
      return <Swipeout backgroundColor='#1B2F4A' right={[{ onPress:this.deleteBillsPurchase.bind(this, purchase.item + parseFloat(purchase.price)),  backgroundColor: '#C95B74', text: 'Delete'}]}>
            <View style={styles.budgetGroupPurchases}>
            <Text style={{color:'white', fontSize:15, fontStyle: 'italic', fontFamily: 'Lato-Regular'}}>{purchase.item}</Text>
            <Text style={{color:'white', fontSize: 15,fontFamily: 'Lato-Regular', marginRight: 15}}>{purchase.price}</Text>
            </View>
            </Swipeout>
    })

    const fillFoodData = this.state.currentMonthFoodPurchases.map(purchase => {
      return <Swipeout backgroundColor='#1B2F4A' right={[{ onPress:this.deleteFoodPurchase.bind(this, purchase.item + parseFloat(purchase.price)),  backgroundColor: '#C95B74', text: 'Delete'}]}>
            <View style={styles.budgetGroupPurchases}>
            <Text style={{color:'white', fontSize:15, fontStyle: 'italic', fontFamily: 'Lato-Regular'}}>{purchase.item}</Text>
            <Text style={{color:'white', fontSize: 15, fontFamily: 'Lato-Regular', marginRight: 15}}>{purchase.price}</Text>
            </View>
            </Swipeout>
    })

    const fillTransportData = this.state.currentMonthTransportPurchases.map(purchase => {
      return <Swipeout backgroundColor='#1B2F4A' right={[{ onPress:this.deleteTransportPurchase.bind(this, purchase.item + parseFloat(purchase.price)),  backgroundColor: '#C95B74', text: 'Delete'}]}>
            <View style={styles.budgetGroupPurchases}>
            <Text style={{color:'white', fontSize:15, fontStyle: 'italic', fontFamily: 'Lato-Regular'}}>{purchase.item}</Text>
            <Text style={{color:'white', fontSize: 15, fontFamily: 'Lato-Regular', marginRight: 15}}>{purchase.price}</Text>
            </View>
            </Swipeout>
    })

    const fillMiscData = this.state.currentMonthMiscPurchases.map(purchase => {
      return <Swipeout backgroundColor='#1B2F4A' right={[{ onPress:this.deleteMiscPurchase.bind(this, purchase.item + parseFloat(purchase.price)),  backgroundColor: '#C95B74', text: 'Delete'}]}>
            <View style={styles.budgetGroupPurchases}>
                <Text style={{color:'white', fontSize:15, fontStyle: 'italic', fontFamily: 'Lato-Regular'}}>{purchase.item}</Text>
                <Text style={{color:'white', fontSize: 15, fontFamily: 'Lato-Regular', marginRight: 15}}>${purchase.price}</Text>
            </View>
            </Swipeout>
    })



    return (
      <View style={{flex: 1}}>
        {this.state.showBudgetHome
          ?
          <View>
            <View style={{flexDirection: 'row', marginBottom: 50, justifyContent: 'center'}}>
              <View style={styles.topBudgetInfoBlockGreen} >
                <Text style={styles.topBudgetTextGreen}>Remaining </Text>
                <Text style={styles.topBudgetTextGreen}>{parseFloat(this.props.totalData - this.state.totalSpent).toFixed(2)}</Text>
              </View>
              <View style={styles.topBudgetInfoBlockRed}>
                <Text style={styles.topBudgetTextRed}>Spent</Text>
                <Text style={styles.topBudgetTextRed}>{parseFloat(this.state.totalSpent).toFixed(2)}</Text>
              </View>
            </View>
            <View style={{flexDirection:'row', justifyContent: 'center'}}>
              <Image style={styles.logo} source={require('./skybudget.png')} />
              <Image style={styles.rocket} source={require('./rocket.png')} />
            </View>
            <View style={styles.startButtonHomePageContainer}>
              <TouchableOpacity  onPress={this.goToDetail}>
                <Text style={styles.startButtonHomePage}>Go to detail page</Text>
              </TouchableOpacity>
              <TouchableOpacity  onPress={this.openNewMonthModal}>
                <Text style={styles.startButtonHomePage}>Start a new month!</Text>
              </TouchableOpacity>

            </View>


              <View style={{marginTop: 22,}}>
                <Modal
                  animationType="slide"
                  transparent={false}
                  visible={this.state.newMonthModalVisible}
                  onRequestClose={() => {
                    this.openNewMonthModal()
                  }}>
                  <View style={{flex:1, backgroundColor:'#1B2F4A'}}>
                    <View style={{marginTop:75,justifyContent:'center', alignItems: 'center'}}>
                      <TextInput style={styles.modalText} placeholderTextColor='white' onChangeText= {currentInputMonth => this.setState({currentInputMonth})} placeholder='Month'></TextInput>
                      <TextInput style={styles.modalText} placeholderTextColor='white' onChangeText= {currentInputYear => this.setState({currentInputYear})} placeholder='Year' keyboardType='numeric'></TextInput>
                        <TouchableOpacity  onPress={this.startNewMonth}>
                          <Text style={styles.startButton}>Blast off</Text>
                        </TouchableOpacity>

                        <View style={styles.toolTip}>
                          <Text style={styles.toolTipText}>This will archive the current month and begin a new one. Make sure you are done inputing all of your purchases for this month before starting a new one</Text>
                        </View>

                    </View>
                  </View>
                </Modal>
              </View>

              <TouchableOpacity  onPress={this.openEraseBudget}>
                <Text style={styles.eraseButton}>Erase Budget and Start Over</Text>
              </TouchableOpacity>

              <View style={{marginTop: 22,}}>
                <Modal
                  animationType="slide"
                  transparent={false}
                  visible={this.state.eraseBudgetModalVisible}
                  onRequestClose={() => {
                    this.openEraseBudget()
                  }}>
                  <View style={{flex:1, backgroundColor:'#1B2F4A'}}>
                    <View style={{marginTop:75,justifyContent:'center', alignItems: 'center'}}>
                      <View style={styles.toolTipWarning}>
                        <Text style={styles.toolTipText}>Don't be hasty! Erasing the budget will wipe away your current budget and let you start all over! This cannot be undone.</Text>
                        <Text style={styles.toolTipText}>Also, your monthly budgets are archived based on their unique month and year combination. If you want to start a month with your new budget that already exists, just give your new month a different name! Get creative!</Text>
                      </View>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 100, marginLeft: 20, marginRight: 20}}>
                        <TouchableOpacity  onPress={this.goBackToGettingStarted}>
                          <Text style={styles.startOverButton}>Erase it All!</Text>
                        </TouchableOpacity>
                        <TouchableOpacity  onPress={this.openEraseBudget}>
                          <Text style={styles.startSubmitButton}>Nevermind</Text>
                        </TouchableOpacity>
                        </View>

                    </View>
                  </View>
                </Modal>
              </View>


          </View>

          :

        <ScrollView style={styles.scrollViewBudgetDetail}>
          <View style={{flexDirection: 'row'}}>
            <View style={styles.topBudgetInfoBlockGreen} >
              <Text style={{backgroundColor:'#5D9D83', color:'white', fontSize: 30 , textAlign:'center', fontFamily: 'Lato-Regular'}}>Remaining </Text>
              <Text style={{backgroundColor:'#5D9D83', color:'white', fontSize: 30, textAlign:'center', fontFamily: 'Lato-Regular'}}>{parseFloat(this.props.totalData - this.state.totalSpent).toFixed(2)}</Text>
            </View>
            <View style={styles.topBudgetInfoBlockRed}>
              <Text style={{backgroundColor:'#C95B74', color:'white', fontSize: 30, textAlign:'center', fontFamily: 'Lato-Regular'}}>Spent</Text>
              <Text style={{backgroundColor:'#C95B74', color:'white', fontSize: 30, textAlign:'center', fontFamily: 'Lato-Regular'}}>{parseFloat(this.state.totalSpent).toFixed(2)}</Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, marginBottom:10}}>
            <Text style={{fontSize: 20, color:'white', marginLeft: 15, fontFamily: 'Lato-Regular'}}>${this.props.totalData}</Text>
            <Text style={{fontSize: 20, color:'white', marginRight: 15, fontFamily: 'Lato-Regular'}}>{this.state.displayedMonth}</Text>
          </View>

          <View style={{marginBottom: 40, marginLeft: 15, marginRight: 15}}>

            <View style={styles.expandContainer}>

              <View  style={{marginTop: 22}}>
                <Modal
                  animationType="slide"
                  transparent={false}
                  visible={this.state.entModalVisible}
                  onRequestClose={() => {
                    this.setEntModalVisible()
                  }}>
                  <View style={{flex:1, backgroundColor:'#1B2F4A'}}>
                    <View style={{marginTop:75,justifyContent:'center', alignItems:'center'}}>
                      <TextInput style={styles.modalText} placeholderTextColor='white' onChangeText= {currentItem => this.setState({currentItem})} placeholder='Purchase Detail'></TextInput>
                      <TextInput style={styles.modalText} placeholderTextColor='white' onChangeText= {currentPrice => this.setState({currentPrice})} placeholder='Price' keyboardType='numeric'></TextInput>
                        <TouchableOpacity  onPress={this.addEntPurchase}>
                          <Text style={styles.startButton}>Submit</Text>
                        </TouchableOpacity>
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
                <TouchableOpacity  onPress={this.setEntModalVisible}>
                  <Text style={styles.purchaseButton}>Add Purchase</Text>
                </TouchableOpacity>
              </Expand>
            </View>
            <View style={styles.expandContainer}>

              <View  style={{marginTop: 22}}>
                <Modal
                  animationType="slide"
                  transparent={false}
                  visible={this.state.billsModalVisible}
                  onRequestClose={() => {
                    this.setBillsModalVisible()
                  }}>
                  <View style={{flex:1, backgroundColor:'#1B2F4A'}}>
                    <View style={{marginTop:75,justifyContent:'center'}}>
                      <TextInput style={styles.modalText} placeholderTextColor='white' onChangeText= {currentItem => this.setState({currentItem})} placeholder='Purchase Detail'></TextInput>
                      <TextInput style={styles.modalText} placeholderTextColor='white' onChangeText= {currentPrice => this.setState({currentPrice})} placeholder='Price' keyboardType='numeric'></TextInput>
                        <TouchableOpacity  onPress={this.addBillsPurchase}>
                          <Text style={styles.startButton}>Submit</Text>
                        </TouchableOpacity>
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
                <TouchableOpacity  onPress={this.setBillsModalVisible}>
                  <Text style={styles.purchaseButton}>Add Purchase</Text>
                </TouchableOpacity>
              </Expand>
            </View>

            <View style={styles.expandContainer}>
              <View  style={{marginTop: 22}}>
                <Modal
                  animationType="slide"
                  transparent={false}
                  visible={this.state.foodModalVisible}
                  onRequestClose={() => {
                    this.setFoodModalVisible()
                  }}>
                  <View style={{flex:1, backgroundColor:'#1B2F4A'}}>
                    <View style={{marginTop:75,justifyContent:'center'}}>
                      <TextInput style={styles.modalText} placeholderTextColor='white' onChangeText= {currentItem => this.setState({currentItem})} placeholder='Purchase Detail'></TextInput>
                      <TextInput style={styles.modalText} placeholderTextColor='white' onChangeText= {currentPrice => this.setState({currentPrice})} placeholder='Price' keyboardType='numeric'></TextInput>
                        <TouchableOpacity  onPress={this.addFoodPurchase}>
                          <Text style={styles.startButton}>Submit</Text>
                        </TouchableOpacity>
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
                <TouchableOpacity  onPress={this.setFoodModalVisible}>
                  <Text style={styles.purchaseButton}>Add Purchase</Text>
                </TouchableOpacity>
              </Expand>
            </View>
            <View style={styles.expandContainer}>

              <View  style={{marginTop: 22}}>
                <Modal
                  animationType="slide"
                  transparent={false}
                  visible={this.state.transportModalVisible}
                  onRequestClose={() => {
                    this.setTransportModalVisible()
                  }}>
                  <View style={{flex:1, backgroundColor:'#1B2F4A'}}>
                    <View style={{marginTop:75,justifyContent:'center'}}>
                      <TextInput style={styles.modalText} placeholderTextColor='white' onChangeText= {currentItem => this.setState({currentItem})} placeholder='Purchase Detail'></TextInput>
                      <TextInput style={styles.modalText} placeholderTextColor='white' onChangeText= {currentPrice => this.setState({currentPrice})} placeholder='Price' keyboardType='numeric'></TextInput>
                        <TouchableOpacity  onPress={this.addTransportPurchase}>
                          <Text style={styles.startButton}>Submit</Text>
                        </TouchableOpacity>
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
                <TouchableOpacity  onPress={this.setTransportModalVisible}>
                  <Text style={styles.purchaseButton}>Add Purchase</Text>
                </TouchableOpacity>
              </Expand>
            </View>
            <View style={styles.expandContainer}>

              <View  style={{ justifyContent: 'center', marginTop: 22}}>
                <Modal
                  animationType="slide"
                  transparent={false}
                  visible={this.state.miscModalVisible}
                  onRequestClose={() => {
                    this.setMiscModalVisible()
                  }}>
                  <View style={{flex:1, backgroundColor:'#1B2F4A'}}>
                    <View style={{marginTop:75,justifyContent:'center'}}>
                      <TextInput style={styles.modalText} placeholderTextColor='white' onChangeText= {currentItem => this.setState({currentItem})} placeholder='Purchase Detail'></TextInput>
                      <TextInput style={styles.modalText} placeholderTextColor='white' onChangeText= {currentPrice => this.setState({currentPrice})} placeholder='Price' keyboardType='numeric'></TextInput>
                        <TouchableOpacity  onPress={this.addMiscPurchase}>
                          <Text style={styles.startButton}>Submit</Text>
                        </TouchableOpacity>
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
                <TouchableOpacity  onPress={this.setMiscModalVisible}>
                  <Text style={styles.purchaseButton}>Add Purchase</Text>
                </TouchableOpacity>
              </Expand>
            </View>
            <View style={{marginTop:35, justifyContent:'center'}}>
              <Text style={styles.categoryTextReward}>Reward</Text>
              <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                <TouchableOpacity  onPress={this.claimReward}>
                  <Text style={styles.rewardButton}>Claim Reward</Text>
                </TouchableOpacity>
                <Text style={styles.rewardText}>${parseFloat(this.props.reward)}</Text>
                  <TouchableOpacity  onPress={this.sendToSavings}>
                    <Text style={styles.rewardButton}>Send To Savings</Text>
                  </TouchableOpacity>
              </View>

            </View>
            <TouchableOpacity  onPress={this.goToHome}>
              <Text style={styles.purchaseButton}>Home Page</Text>
            </TouchableOpacity>

          </View>
        </ScrollView>}
      </View>
      )

    }
  }

  const styles = EStyleSheet.create({
    budgetGroup: {
      backgroundColor: '#1B2F4A',
      flex: 1,
      justifyContent: 'space-between',
      flexDirection: 'row',
      marginBottom: 5,
    },
    logo:{
      width: '300rem',
      height: '100rem',
      marginLeft: '-15rem',
      marginTop: '50rem'
    },
    rocket: {
      width: '60rem',
      height:'69rem',
      marginLeft: '-50rem',
      marginTop: '40rem'
    },
    budgetGroupPurchases:{
      backgroundColor: '#1B2F4A',
      flex: 1,
      justifyContent: 'space-between',
      flexDirection: 'row',
      marginBottom: 5,
      paddingTop: 5,
      paddingBottom: 5,
    },
    expanded: {
      backgroundColor: '#1B2F4A',
    },
    expandContainer: {
      flex: 1,
      backgroundColor: '#1B2F4A',
    },
    categoryText: {
      fontSize: 25,
      color: 'white',
      fontFamily: 'Lato-Regular'
    },
    categoryTextReward: {
      textAlign: 'center',
      fontSize: 30,
      color: 'white',
      marginBottom: 8,
      fontFamily: 'Lato-Regular'
    },
    remainingText: {
      fontSize: 30,
      backgroundColor: '#2A6972',
      color: 'white',
      borderRadius: 5,
      width: 150,
      textAlign:'center',
      fontFamily: 'Lato-Regular'
    },
    rewardText: {
      fontSize: 25,
      backgroundColor: '#2A6972',
      color: 'white',
      borderRadius: 5,
      width: 120,
      textAlign:'center',
      fontFamily: 'Lato-Regular'
    },
    remainingTextRed: {
      fontSize: '30rem',
      backgroundColor: '#C95B74',
      color: 'white',
      fontFamily: 'Lato-Regular'
    },
    topBudgetInfoBlockRed: {
      marginRight:'5rem',
      marginLeft:'1rem',
      paddingTop:'5%',
      paddingBottom:'20rem',
      borderBottomEndRadius:25,
      borderBottomStartRadius:25,
      width: '175rem',
      backgroundColor:'#C95B74'
    },
    topBudgetInfoBlockGreen: {
      marginRight:'1rem',
      marginLeft:'5rem',
      paddingTop:'5%',
      paddingBottom:'20rem',
      borderBottomEndRadius:25,
      borderBottomStartRadius:25,
      width: '175rem',
      backgroundColor:'#5D9D83'
    },
    topBudgetTextGreen: {
      backgroundColor:'#5D9D83',
      color:'white',
      fontSize: '25rem',
      textAlign:'center',
      fontFamily: 'Lato-Regular'
    },
    topBudgetTextRed:{
      backgroundColor:'#C95B74',
      color:'white',
      fontSize: '25rem',
      textAlign:'center',
      fontFamily: 'Lato-Regular'
    },
    startButtonHomePageContainer:{
      marginTop: '50rem'
    },
    startButtonHomePage: {
      color: '#2A6972',
      fontSize: '25rem',
      marginTop: 5,
      textAlign: 'center',
      fontFamily: 'Lato-Regular'
    },
    startButton: {
      color: '#2A6972',
      fontSize: '25rem',
      marginTop: 5,
      textAlign: 'center',
      fontFamily: 'Lato-Regular'
    },
    eraseButton:{
      fontSize: '12rem',
      textAlign: 'center',
      color: '#EAAF69',
      marginTop: 40,
      marginBottom: '30rem',
      fontFamily: 'Lato-Regular'
    },
    startOverButton: {
      color: 'white',
      fontSize: '27rem',
      marginTop: '10rem',
      textAlign: 'center',
      backgroundColor: '#C95B74',
      marginRight: '5rem',
      paddingRight: '10rem',
      paddingLeft: '10rem',
      borderRadius: 5,
      fontFamily: 'Lato-Regular'
    },
    startSubmitButton: {
      color: 'white',
      fontSize: '27rem',
      marginTop: '10rem',
      textAlign: 'center',
      backgroundColor: '#5D9D83',
      marginLeft: '5rem',
      paddingRight: '10rem',
      paddingLeft: '10rem',
      borderRadius: 5,
      fontFamily: 'Lato-Regular'
    },
    purchaseButton:{
      color: '#2A6972',
      fontSize: 30,
      marginTop: 5,
      textAlign: 'center',
      fontFamily: 'Lato-Regular'
    },
    rewardButton:{
      fontSize: 15,
      textAlign: 'center',
      color: '#EAAF69',
      fontFamily: 'Lato-Regular'
    },
    toolTip: {
      height: '170rem',
      width: '275rem',
      backgroundColor: '#EAAF69',
      marginTop: '125rem',
      justifyContent: 'center',
      borderRadius: 20
    },
    toolTipWarning: {
      height: '225rem',
      marginLeft: 8,
      width: '275rem',
      backgroundColor: '#EAAF69',
      marginTop: '30rem',
      justifyContent: 'center',
      borderRadius: 20
    },
    toolTipText: {
      marginLeft: '30rem',
      marginRight: '30rem',
      marginTop: '5rem',
      marginBottom: '5rem',
      fontSize: '15rem',
      fontFamily: 'Lato-Regular'
    },
    scrollViewBudgetDetail: {
      flex:1,
      marginRight:'15rem',
      marginLeft:'15rem'
    },
    modalText: {
      fontSize: '23rem',
      width: '200rem',
      color: 'white',
      fontFamily: 'Lato-Regular'
    }
  })


export default BudgetHomePage
