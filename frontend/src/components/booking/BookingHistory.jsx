import React, { useState, useEffect } from 'react'
import { Calendar, Clock, MapPin, User } from 'lucide-react'
import { toast } from 'react-toastify'
import bookingService from '../../services/bookingService'
import Card from '../common/Card'
import Button from '../common/Button'
import LoadingSpinner from '../common/LoadingSpinner'
import Modal from '../common/Modal'
import PriceBreakdown from './PriceBreakdown'
import { formatDisplayDate } from '../../utils/dateUtils'
import useAuth from '../../hooks/useAuth'

const BookingHistory = () => {
  const { isAdmin } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      // Use different endpoint based on user role
      const response = isAdmin 
        ? await bookingService.getAllBookings()
        : await bookingService.getMyBookings()
      setBookings(response.data)
    } catch (error) {
      toast.error('Failed to fetch bookings')
      console.error('Fetch bookings error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return
    }

    try {
      await bookingService.cancelBooking(bookingId)
      toast.success('Booking cancelled successfully')
      fetchBookings()
    } catch (error) {
      toast.error('Failed to cancel booking')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-sport-green text-white'
      case 'cancelled':
        return 'bg-chart-red text-white'
      case 'completed':
        return 'bg-gray-500 text-white'
      default:
        return 'bg-gray-300 text-text-primary'
    }
  }

  if (loading) {
    return <LoadingSpinner text="Loading bookings..." />
  }

  if (bookings.length === 0) {
    return (
      <Card>
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-text-muted mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-text-primary mb-2">No bookings yet</h3>
          <p className="text-text-muted">
            {isAdmin ? 'No bookings have been made yet' : 'Start by booking your first court!'}
          </p>
        </div>
      </Card>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {bookings.map((booking) => (
          <Card key={booking._id} padding={false}>
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* Booking Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-text-primary">
                      {booking.court?.name || 'Court'}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>

                  {/* Show user name for admin view */}
                  {isAdmin && booking.user && (
                    <div className="mb-2 text-sm text-text-secondary">
                      👤 Booked by: <span className="font-medium">{booking.user.name}</span> ({booking.user.email})
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center text-text-secondary">
                      <Calendar className="w-4 h-4 mr-2" />
                      {formatDisplayDate(booking.date)}
                    </div>
                    <div className="flex items-center text-text-secondary">
                      <Clock className="w-4 h-4 mr-2" />
                      {booking.startTime} - {booking.endTime}
                    </div>
                    {booking.coach && (
                      <div className="flex items-center text-text-secondary">
                        <User className="w-4 h-4 mr-2" />
                        Coach: {booking.coach.name}
                      </div>
                    )}
                    <div className="flex items-center text-text-secondary">
                      <MapPin className="w-4 h-4 mr-2" />
                      Type: {booking.court?.type || 'N/A'}
                    </div>
                  </div>

                  {booking.equipment && booking.equipment.length > 0 && (
                    <div className="mt-3 text-sm text-text-secondary">
                      Equipment: {booking.equipment.map(e => `${e.item?.name || 'Item'} (${e.quantity})`).join(', ')}
                    </div>
                  )}
                </div>

                {/* Price & Actions */}
                <div className="flex flex-col items-end gap-3">
                  <div className="text-right">
                    <p className="text-sm text-text-muted">Total Amount</p>
                    <p className="text-2xl font-bold text-sport-green">
                      ₹{booking.pricingBreakdown?.totalPrice || 0}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedBooking(booking)
                        setShowDetailsModal(true)
                      }}
                    >
                      View Details
                    </Button>
                    {booking.status === 'confirmed' && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleCancelBooking(booking._id)}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="Booking Details"
        size="md"
      >
        {selectedBooking && (
          <div className="space-y-4">
            {isAdmin && selectedBooking.user && (
              <div>
                <h4 className="font-semibold text-text-primary mb-2">Customer Information</h4>
                <p className="text-text-secondary">Name: {selectedBooking.user.name}</p>
                <p className="text-text-secondary">Email: {selectedBooking.user.email}</p>
                <p className="text-text-secondary">Phone: {selectedBooking.user.phone}</p>
              </div>
            )}

            <div>
              <h4 className="font-semibold text-text-primary mb-2">Court Information</h4>
              <p className="text-text-secondary">Court: {selectedBooking.court?.name}</p>
              <p className="text-text-secondary">Type: {selectedBooking.court?.type}</p>
            </div>

            <div>
              <h4 className="font-semibold text-text-primary mb-2">Date & Time</h4>
              <p className="text-text-secondary">Date: {formatDisplayDate(selectedBooking.date)}</p>
              <p className="text-text-secondary">Time: {selectedBooking.startTime} - {selectedBooking.endTime}</p>
            </div>

            {selectedBooking.coach && (
              <div>
                <h4 className="font-semibold text-text-primary mb-2">Coach</h4>
                <p className="text-text-secondary">Name: {selectedBooking.coach.name}</p>
                <p className="text-text-secondary">Specialization: {selectedBooking.coach.specialization}</p>
              </div>
            )}

            {selectedBooking.equipment && selectedBooking.equipment.length > 0 && (
              <div>
                <h4 className="font-semibold text-text-primary mb-2">Equipment</h4>
                <ul className="space-y-1">
                  {selectedBooking.equipment.map((e, index) => (
                    <li key={index} className="text-text-secondary">
                      {e.item?.name} - Quantity: {e.quantity}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {selectedBooking.notes && (
              <div>
                <h4 className="font-semibold text-text-primary mb-2">Notes</h4>
                <p className="text-text-secondary">{selectedBooking.notes}</p>
              </div>
            )}

            <PriceBreakdown breakdown={selectedBooking.pricingBreakdown} />
          </div>
        )}
      </Modal>
    </>
  )
}

export default BookingHistory
