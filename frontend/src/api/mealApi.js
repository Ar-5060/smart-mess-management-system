import api from './axios'

export const createMeal = (mealData) => {
  return api.post('/api/meals', mealData)
}

export const updateMeal = (mealId, mealData) => {
  return api.put(`/api/meals/${mealId}`, mealData)
}

export const getMealsByUserId = (userId) => {
  return api.get(`/api/meals/user/${userId}`)
}

export const getMonthlyMealsByMess = (messId, month, year) => {
  return api.get(`/api/meals/mess/${messId}/monthly?month=${month}&year=${year}`)
}