import React from 'react'
import BookingHistory from '../components/booking/BookingHistory'

const MyBookingsPage = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">My Bookings</h1>
        <p className="text-text-secondary">View and manage your court bookings</p>
      </div>

      <BookingHistory />
    </div>
  )
}

export default MyBookingsPage
