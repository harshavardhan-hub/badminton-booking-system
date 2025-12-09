import api from './api'

const pricingService = {
  getAllRules: async (params) => {
    const response = await api.get('/pricing-rules', { params })
    return response.data
  },

  getRule: async (id) => {
    const response = await api.get(`/pricing-rules/${id}`)
    return response.data
  },

  createRule: async (ruleData) => {
    const response = await api.post('/pricing-rules', ruleData)
    return response.data
  },

  updateRule: async (id, ruleData) => {
    const response = await api.put(`/pricing-rules/${id}`, ruleData)
    return response.data
  },

  deleteRule: async (id) => {
    const response = await api.delete(`/pricing-rules/${id}`)
    return response.data
  },

  calculatePrice: async (data) => {
    const response = await api.post('/pricing-rules/calculate', data)
    return response.data
  }
}

export default pricingService
