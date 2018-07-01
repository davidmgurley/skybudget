import Realm from 'realm'

export const TotalSchema = {
  name: 'Total',
  properties: {
    totalMonthlySpending: 'int',
    entertainmentBudget: 'int',
    billsBudget: 'int',
    transportBudget: 'int',
    foodBudget: 'int',
    miscBudget: 'int',
    reward: 'int'
  }
}

export const HomeSchema = {
  name: 'Home',
    properties: {
      totalMonthlySpending: 'int',
      entertainmentBudget: 'int',
      billsBudget: 'int',
      transportBudget: 'int',
      foodBudget: 'int',
      miscBudget: 'int',
      reward: 'int'
    }
}

export const CurrentBalancesSchema = {
  name: 'CurrentBalances',
  properties: {
    entertainmentCurrent: 'int',
    billsCurrent: 'int',
    transportCurrent: 'int',
    foodCurrent: 'int',
    miscCurrent: 'int',
    reward: 'int'
  }
}

export const IndividualExpenseSchema = {
  name: 'IndividualExpense',
  properties: {
                item: 'string',
                price: 'string',}
}

export const MonthlyBudgetSchema = {
  name: 'MonthlyBudget',
  primaryKey: 'id',
  properties: {
    id: 'string',
    rewardClaimed: 'bool',
    rewardToSavings: 'bool',
    currentOrArchived: 'string',
    entertainmentPurchases: 'IndividualExpense[]',
    billsPurchases: 'IndividualExpense[]',
    foodPurchases: 'IndividualExpense[]',
    transportPurchases: 'IndividualExpense[]',
    miscPurchases: 'IndividualExpense[]',

  }
}
