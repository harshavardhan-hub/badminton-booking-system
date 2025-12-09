import api from './api'

const courtService = {
  getAllCourts: async (params) => {
    const response = await api.get('/courts', { params })
    return response.data
  },

  getCourt: async (id) => {
    const response = await api.get(`/courts/${id}`)
    return response.data
  },

  createCourt: async (courtData) => {
    const response = await api.post('/courts', courtData)
    return response.data
  },

  updateCourt: async (id, courtData) => {
    const response = await api.put(`/courts/${id}`, courtData)
    return response.data
  },

  deleteCourt: async (id) => {
    const response = await api.delete(`/courts/${id}`)
    return response.data
  }
}

export default courtService
