import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 60000 // 60 seconds timeout for Render wake-up
})

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (user.token) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor with retry logic
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config

    // If request timed out or failed, retry up to 3 times
    if (!config || !config.retry) {
      config.retry = 0
    }

    const shouldRetry = 
      config.retry < 3 && 
      (error.code === 'ECONNABORTED' || 
       error.code === 'ERR_NETWORK' ||
       error.response?.status === 503 ||
       !error.response)

    if (shouldRetry) {
      config.retry += 1
      console.log(`Retrying request... Attempt ${config.retry}/3`)
      
      // Wait 2 seconds before retry
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      return api(config)
    }

    if (error.response?.status === 401) {
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    
    return Promise.reject(error)
  }
)

export default api
