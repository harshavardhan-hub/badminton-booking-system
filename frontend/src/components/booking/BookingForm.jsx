import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Button from '../common/Button'
import Select from '../common/Select'
import Input from '../common/Input'
import coachService from '../../services/coachService'
import equipmentService from '../../services/equipmentService'
import pricingService from '../../services/pricingService'
import bookingService from '../../services/bookingService'
import useBooking from '../../hooks/useBooking'
import { formatDate } from '../../utils/dateUtils'

const BookingForm = ({ onSuccess }) => {
  const {
    selectedCourt,
    selectedDate,
    selectedSlot,
    selectedCoach,
    setSelectedCoach,
    selectedEquipment,
    setSelectedEquipment,
    priceBreakdown,
    setPriceBreakdown,
    resetBooking
  } = useBooking()

  const [coaches, setCoaches] = useState([])
  const [equipment, setEquipment] = useState([])
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [calculatingPrice, setCalculatingPrice] = useState(false)

  useEffect(() => {
    fetchCoaches()
    fetchEquipment()
  }, [])

  useEffect(() => {
    if (selectedCourt && selectedDate && selectedSlot) {
      calculatePrice()
    }
  }, [selectedCourt, selectedCoach, selectedEquipment, selectedDate, selectedSlot])

  const fetchCoaches = async () => {
    try {
      const response = await coachService.getAllCoaches({ isActive: true })
      setCoaches(response.data)
    } catch (error) {
      console.error('Failed to fetch coaches:', error)
    }
  }

  const fetchEquipment = async () => {
    try {
      const response = await equipmentService.getAllEquipment({ isActive: true })
      setEquipment(response.data)
    } catch (error) {
      console.error('Failed to fetch equipment:', error)
    }
  }

  const calculatePrice = async () => {
    if (!selectedCourt || !selectedSlot) return

    try {
      setCalculatingPrice(true)
      // Filter valid equipment for price calculation
      const validEquipment = selectedEquipment.filter(e => e.quantity > 0)
      
      const response = await pricingService.calculatePrice({
        courtId: selectedCourt._id,
        coachId: selectedCoach || null,
        equipment: validEquipment,
        date: formatDate(selectedDate),
        startTime: selectedSlot.startTime
      })
      setPriceBreakdown(response.data)
    } catch (error) {
      console.error('Price calculation error:', error)
    } finally {
      setCalculatingPrice(false)
    }
  }

  const handleEquipmentChange = (equipmentId, quantity) => {
    const qty = parseInt(quantity) || 0
    const existing = selectedEquipment.find(e => e.item === equipmentId)
    
    if (qty === 0) {
      // Remove equipment if quantity is 0
      setSelectedEquipment(selectedEquipment.filter(e => e.item !== equipmentId))
    } else if (existing) {
      setSelectedEquipment(
        selectedEquipment.map(e =>
          e.item === equipmentId ? { ...e, quantity: qty } : e
        )
      )
    } else {
      setSelectedEquipment([...selectedEquipment, { item: equipmentId, quantity: qty }])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!selectedCourt || !selectedSlot) {
      toast.error('Please select a court and time slot')
      return
    }

    // Filter out equipment with quantity 0 or invalid
    const validEquipment = selectedEquipment.filter(e => e.quantity > 0)

    try {
      setLoading(true)
      await bookingService.createBooking({
        courtId: selectedCourt._id,
        coachId: selectedCoach || null,
        equipment: validEquipment,
        date: formatDate(selectedDate),
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        notes
      })

      toast.success('Booking created successfully!')
      resetBooking()
      onSuccess()
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create booking'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  if (!selectedCourt || !selectedSlot) {
    return (
      <div className="text-center py-8 text-text-muted">
        Please select a court and time slot to continue
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Coach Selection */}
      <div>
        <Select
          label="Select Coach (Optional)"
          name="coach"
          value={selectedCoach || ''}
          onChange={(e) => setSelectedCoach(e.target.value || null)}
          options={coaches.map(coach => ({
            value: coach._id,
            label: `${coach.name} - ₹${coach.hourlyRate}/hr`
          }))}
          placeholder="No coach needed"
        />
      </div>

      {/* Equipment Selection */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-3">
          Add Equipment (Optional)
        </label>
        <div className="space-y-3">
          {equipment.map(item => {
            const currentQty = selectedEquipment.find(e => e.item === item._id)?.quantity || 0
            
            return (
              <div key={item._id} className="flex items-center justify-between p-3 border border-border-color rounded-xl">
                <div>
                  <p className="font-medium text-text-primary">{item.name}</p>
                  <p className="text-sm text-text-muted">₹{item.pricePerHour}/hr · Available: {item.totalQuantity}</p>
                </div>
                <input
                  type="number"
                  min="0"
                  max={item.totalQuantity}
                  value={currentQty}
                  placeholder="0"
                  className="w-20 px-3 py-2 border border-border-color rounded-lg text-center"
                  onChange={(e) => handleEquipmentChange(item._id, e.target.value)}
                />
              </div>
            )
          })}
        </div>
      </div>

      {/* Notes */}
      <Input
        label="Additional Notes (Optional)"
        name="notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Any special requests or notes..."
      />

      {/* Price Breakdown */}
      {priceBreakdown && (
        <div className="bg-sport-green-light p-4 rounded-xl">
          <h4 className="font-semibold text-text-primary mb-3">Price Breakdown</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-text-secondary">Court Base Price:</span>
              <span className="font-medium">₹{priceBreakdown.courtBasePrice}</span>
            </div>
            {priceBreakdown.appliedRules && priceBreakdown.appliedRules.map((rule, index) => (
              <div key={index} className="flex justify-between">
                <span className="text-text-secondary">{rule.ruleName}:</span>
                <span className="font-medium text-sport-green">+₹{rule.modifier.toFixed(2)}</span>
              </div>
            ))}
            {priceBreakdown.coachFee > 0 && (
              <div className="flex justify-between">
                <span className="text-text-secondary">Coach Fee:</span>
                <span className="font-medium">₹{priceBreakdown.coachFee}</span>
              </div>
            )}
            {priceBreakdown.equipmentFee > 0 && (
              <div className="flex justify-between">
                <span className="text-text-secondary">Equipment Fee:</span>
                <span className="font-medium">₹{priceBreakdown.equipmentFee}</span>
              </div>
            )}
            <div className="border-t border-gray-300 pt-2 mt-2 flex justify-between">
              <span className="font-semibold text-text-primary">Total Price:</span>
              <span className="font-bold text-lg text-sport-green">
                ₹{priceBreakdown.totalPrice}
              </span>
            </div>
          </div>
        </div>
      )}

      <Button
        type="submit"
        variant="success"
        className="w-full"
        disabled={loading || calculatingPrice}
      >
        {loading ? 'Creating Booking...' : 'Confirm Booking'}
      </Button>
    </form>
  )
}

export default BookingForm
