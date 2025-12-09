import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import SlotSelector from '../components/booking/SlotSelector'
import BookingForm from '../components/booking/BookingForm'
import LoadingSpinner from '../components/common/LoadingSpinner'
import courtService from '../services/courtService'
import useBooking from '../hooks/useBooking'
import useAuth from '../hooks/useAuth'
import { formatDate, getNextDays, formatDisplayDate } from '../utils/dateUtils'

const BookingPage = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const {
    selectedCourt,
    setSelectedCourt,
    selectedDate,
    setSelectedDate,
    selectedSlot,
    setSelectedSlot,
    resetBooking
  } = useBooking()

  const [courts, setCourts] = useState([])
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState(1)

  useEffect(() => {
    if (!isAuthenticated) {
      toast.info('Please login to book a court')
      navigate('/login')
      return
    }
    fetchCourts()
  }, [isAuthenticated, navigate])

  const fetchCourts = async () => {
    try {
      const response = await courtService.getAllCourts({ isActive: true })
      setCourts(response.data)
    } catch (error) {
      toast.error('Failed to fetch courts')
    } finally {
      setLoading(false)
    }
  }

  const handleCourtSelect = (courtId) => {
    const court = courts.find(c => c._id === courtId)
    setSelectedCourt(court)
    setSelectedSlot(null)
    setStep(2)
  }

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot)
    setStep(3)
  }

  const handleBookingSuccess = () => {
    navigate('/my-bookings')
  }

  const availableDates = getNextDays(7)

  if (loading) {
    return <LoadingSpinner text="Loading courts..." />
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-text-primary mb-8">Book a Court</h1>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        {[1, 2, 3].map((num) => (
          <React.Fragment key={num}>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${
              step >= num ? 'bg-sport-green text-white' : 'bg-gray-200 text-text-muted'
            }`}>
              {num}
            </div>
            {num < 3 && (
              <div className={`w-20 h-1 mx-2 ${
                step > num ? 'bg-sport-green' : 'bg-gray-200'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Booking Area */}
        <div className="lg:col-span-2">
          {step === 1 && (
            <Card title="Step 1: Select a Court">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courts.map((court) => (
                  <div
                    key={court._id}
                    onClick={() => handleCourtSelect(court._id)}
                    className={`p-6 border-2 rounded-2xl cursor-pointer transition-all ${
                      selectedCourt?._id === court._id
                        ? 'border-sport-green bg-sport-green-light'
                        : 'border-border-color hover:border-sport-blue'
                    }`}
                  >
                    <h3 className="text-lg font-semibold text-text-primary mb-2">
                      {court.name}
                    </h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 ${
                      court.type === 'indoor' ? 'bg-blue-100 text-chart-cyan' : 'bg-green-100 text-chart-lime'
                    }`}>
                      {court.type}
                    </span>
                    <p className="text-text-secondary text-sm mb-3">{court.description}</p>
                    <p className="text-2xl font-bold text-sport-green">₹{court.basePrice}/hr</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {step === 2 && selectedCourt && (
            <Card title="Step 2: Select Date & Time">
              <div className="mb-6">
                <label className="block text-sm font-medium text-text-primary mb-3">
                  Select Date
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {availableDates.map((date) => (
                    <button
                      key={date.toString()}
                      onClick={() => setSelectedDate(date)}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        formatDate(selectedDate) === formatDate(date)
                          ? 'border-sport-green bg-sport-green-light'
                          : 'border-border-color hover:border-sport-blue'
                      }`}
                    >
                      <div className="text-center">
                        <p className="text-xs text-text-muted">{formatDisplayDate(date).split(' ')[0]}</p>
                        <p className="text-lg font-semibold text-text-primary">
                          {formatDisplayDate(date).split(' ')[1]}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-3">
                  Select Time Slot
                </label>
                <SlotSelector
                  courtId={selectedCourt._id}
                  date={formatDate(selectedDate)}
                  onSlotSelect={handleSlotSelect}
                  selectedSlot={selectedSlot}
                />
              </div>

              <div className="mt-6 flex gap-3">
                <Button variant="secondary" onClick={() => setStep(1)}>
                  Back
                </Button>
                {selectedSlot && (
                  <Button variant="success" onClick={() => setStep(3)}>
                    Continue
                  </Button>
                )}
              </div>
            </Card>
          )}

          {step === 3 && (
            <Card title="Step 3: Additional Options & Confirm">
              <BookingForm onSuccess={handleBookingSuccess} />
              <div className="mt-6">
                <Button variant="secondary" onClick={() => setStep(2)}>
                  Back
                </Button>
              </div>
            </Card>
          )}
        </div>

        {/* Booking Summary */}
        <div className="lg:col-span-1">
          <Card title="Booking Summary" className="sticky top-24">
            {selectedCourt ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-text-muted">Court</p>
                  <p className="font-semibold text-text-primary">{selectedCourt.name}</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                    selectedCourt.type === 'indoor' ? 'bg-blue-100 text-chart-cyan' : 'bg-green-100 text-chart-lime'
                  }`}>
                    {selectedCourt.type}
                  </span>
                </div>

                {selectedDate && (
                  <div>
                    <p className="text-sm text-text-muted">Date</p>
                    <p className="font-semibold text-text-primary">{formatDisplayDate(selectedDate)}</p>
                  </div>
                )}

                {selectedSlot && (
                  <div>
                    <p className="text-sm text-text-muted">Time</p>
                    <p className="font-semibold text-text-primary">
                      {selectedSlot.startTime} - {selectedSlot.endTime}
                    </p>
                  </div>
                )}

                <div className="border-t border-border-color pt-4">
                  <p className="text-sm text-text-muted">Base Price</p>
                  <p className="text-2xl font-bold text-sport-green">₹{selectedCourt.basePrice}</p>
                </div>
              </div>
            ) : (
              <p className="text-text-muted text-center py-8">
                Select a court to see booking details
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}

export default BookingPage
