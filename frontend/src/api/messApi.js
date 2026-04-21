import api from './axios'

export const createMess = (messData) => {
  return api.post('/api/messes', messData)
}

export const getAllMesses = () => {
  return api.get('/api/messes')
}

export const getMessById = (id) => {
  return api.get(`/api/messes/${id}`)
}