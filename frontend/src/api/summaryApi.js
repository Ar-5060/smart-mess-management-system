import api from './axios'

export const getMonthlySummary = (messId, month, year) => {
  return api.get(`/api/summary/monthly/${messId}?month=${month}&year=${year}`)
}

export const getMemberSummary = (userId, month, year) => {
  return api.get(`/api/summary/member/${userId}?month=${month}&year=${year}`)
}