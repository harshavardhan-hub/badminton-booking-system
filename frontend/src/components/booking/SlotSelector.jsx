import React, { useState, useEffect } from 'react'
import { Clock, CheckCircle } from 'lucide-react'
import bookingService from '../../services/bookingService'
import LoadingSpinner from '../common/LoadingSpinner'
import { toast } from 'react-toastify'

const SlotSelector = ({ courtId, date, onSlotSelect, selectedSlot }) => {
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (courtId && date) {
      fetchAvailableSlots()
    }
  }, [courtId, date])

  const fetchAvailableSlots = async () => {
    try {
      setLoading(true)
      const response = await bookingService.getAvailableSlots(courtId, date)
      setSlots(response.data)
    } catch (error) {
      toast.error('Failed to fetch available slots')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingSpinner text="Loading available slots..." />
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {slots.map((slot) => {
        const isSelected = selectedSlot?.startTime === slot.startTime
        
        return (
          <button
            key={slot.startTime}
            onClick={() => slot.available && onSlotSelect(slot)}
            disabled={!slot.available}
            className={`relative p-4 rounded-xl border-2 transition-all ${
              isSelected
                ? 'border-sport-green bg-sport-green-light'
                : slot.available
                ? 'border-border-color hover:border-sport-blue hover:bg-blue-50'
                : 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-50'
            }`}
          >
            <div className="flex flex-col items-center">
              <Clock className={`w-5 h-5 mb-2 ${isSelected ? 'text-sport-green' : 'text-text-secondary'}`} />
              <span className={`text-sm font-medium ${isSelected ? 'text-sport-green' : 'text-text-primary'}`}>
                {slot.startTime}
              </span>
              <span className="text-xs text-text-muted mt-1">
                {slot.available ? 'Available' : 'Booked'}
              </span>
            </div>
            {isSelected && (
              <CheckCircle className="absolute top-2 right-2 w-5 h-5 text-sport-green" />
            )}
          </button>
        )
      })}
    </div>
  )
}

export default SlotSelector
