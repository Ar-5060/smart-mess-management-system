import api from './axios'

export const createRentPayment = (rentData) => {
  return api.post('/api/rent-payments', rentData)
}

export const getMonthlyRentPayments = (messId, month, year) => {
  return api.get(`/api/rent-payments/monthly/${messId}?month=${month}&year=${year}`)
}