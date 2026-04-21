import api from './axios'

export const createExpense = (expenseData) => {
  return api.post('/api/expenses', expenseData)
}

export const getExpensesByMess = (messId) => {
  return api.get(`/api/expenses/mess/${messId}`)
}

export const getMonthlyExpenses = (messId, month, year) => {
  return api.get(`/api/expenses/monthly/${messId}?month=${month}&year=${year}`)
}