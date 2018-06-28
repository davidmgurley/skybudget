import Realm from 'realm'

export const TotalSchema = {
  name: 'Total',
  properties: {
    totalMonthlySpending: 'int',
    entertainmentBudget: 'int',
    billsBudget: 'int',
    transportBudget: 'int',
    foodBudget: 'int',
    miscBudget: 'int'
  }
}

export const individualExpenseSchema = {
  name: 'IndividualExpense',
  primaryKey: 'string',
  properties: {date: 'date',
              purchasedItem: 'string',
              price: 'int'}
}

export const MonthlyBudgetSchema = {
  name: 'MonthlyBudget',
  primaryKey: 'string',
  properties: {
    entertainmentPurchases: {type: 'list', objectType: 'IndividualExpense'},
    billsPurchases: {type: 'list', objectType: 'IndividualExpense'},
    foodPurchases: {type: 'list', objectType: 'IndividualExpense'},
    transportPurchases: {type: 'list', objectType: 'IndividualExpense'},
    miscPurchases: {type: 'list', objectType: 'IndividualExpense'},

  }
}
