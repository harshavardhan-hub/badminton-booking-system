import api from './api'

const coachService = {
  getAllCoaches: async (params) => {
    const response = await api.get('/coaches', { params })
    return response.data
  },

  getCoach: async (id) => {
    const response = await api.get(`/coaches/${id}`)
    return response.data
  },

  createCoach: async (coachData) => {
    const response = await api.post('/coaches', coachData)
    return response.data
  },

  updateCoach: async (id, coachData) => {
    const response = await api.put(`/coaches/${id}`, coachData)
    return response.data
  },

  deleteCoach: async (id) => {
    const response = await api.delete(`/coaches/${id}`)
    return response.data
  }
}

export default coachService
