import React, { createContext, useState } from 'react'

export const BookingContext = createContext()

export const BookingProvider = ({ children }) => {
  const [selectedCourt, setSelectedCourt] = useState(null)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [selectedCoach, setSelectedCoach] = useState(null)
  const [selectedEquipment, setSelectedEquipment] = useState([])
  const [priceBreakdown, setPriceBreakdown] = useState(null)

  const resetBooking = () => {
    setSelectedCourt(null)
    setSelectedSlot(null)
    setSelectedCoach(null)
    setSelectedEquipment([])
    setPriceBreakdown(null)
  }

  const value = {
    selectedCourt,
    setSelectedCourt,
    selectedDate,
    setSelectedDate,
    selectedSlot,
    setSelectedSlot,
    selectedCoach,
    setSelectedCoach,
    selectedEquipment,
    setSelectedEquipment,
    priceBreakdown,
    setPriceBreakdown,
    resetBooking
  }

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
}
