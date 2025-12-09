import api from './api'

const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData)
    if (response.data.success && response.data.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data.data))
    }
    return response.data
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials)
    if (response.data.success && response.data.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data.data))
    }
    return response.data
  },

  logout: () => {
    localStorage.removeItem('user')
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },

  getMe: async () => {
    const response = await api.get('/auth/me')
    return response.data
  },

  updateProfile: async (userData) => {
    const response = await api.put('/auth/profile', userData)
    return response.data
  }
}

export default authService
