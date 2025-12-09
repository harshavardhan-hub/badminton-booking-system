import api from './api'

const bookingService = {
  createBooking: async (bookingData) => {
    const response = await api.post('/bookings', bookingData)
    return response.data
  },

  getMyBookings: async () => {
    const response = await api.get('/bookings/my-bookings')
    return response.data
  },

  getAllBookings: async (params) => {
    const response = await api.get('/bookings', { params })
    return response.data
  },

  getBooking: async (id) => {
    const response = await api.get(`/bookings/${id}`)
    return response.data
  },

  cancelBooking: async (id) => {
    const response = await api.put(`/bookings/${id}/cancel`)
    return response.data
  },

  checkAvailability: async (data) => {
    const response = await api.post('/bookings/check-availability', data)
    return response.data
  },

  getAvailableSlots: async (courtId, date) => {
    const response = await api.get(`/bookings/available-slots/${courtId}/${date}`)
    return response.data
  },

  addToWaitlist: async (data) => {
    const response = await api.post('/bookings/waitlist', data)
    return response.data
  },

  getBookingStats: async () => {
    const response = await api.get('/bookings/stats/overview')
    return response.data
  }
}

export default bookingService
