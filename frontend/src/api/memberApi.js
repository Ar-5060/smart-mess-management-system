import api from './axios'

export const createMember = (memberData) => {
  return api.post('/api/members', memberData)
}

export const getMembersByMessId = (messId) => {
  return api.get(`/api/members/mess/${messId}`)
}

export const getMemberById = (memberId) => {
  return api.get(`/api/members/${memberId}`)
}

export const deactivateMember = (memberId) => {
  return api.put(`/api/members/${memberId}/deactivate`)
}

export const activateMember = (memberId) => {
  return api.put(`/api/members/${memberId}/activate`)
}