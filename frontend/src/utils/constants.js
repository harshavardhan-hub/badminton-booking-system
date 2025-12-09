export const COURT_TYPES = {
  INDOOR: 'indoor',
  OUTDOOR: 'outdoor'
}

export const EQUIPMENT_TYPES = {
  RACKET: 'racket',
  SHOES: 'shoes',
  OTHER: 'other'
}

export const BOOKING_STATUS = {
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed'
}

export const PRICING_RULE_TYPES = {
  PEAK_HOUR: 'peak_hour',
  WEEKEND: 'weekend',
  COURT_TYPE: 'court_type',
  HOLIDAY: 'holiday',
  CUSTOM: 'custom'
}

export const DAYS_OF_WEEK = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' }
]

export const TIME_SLOTS = Array.from({ length: 16 }, (_, i) => {
  const hour = i + 6
  return `${hour.toString().padStart(2, '0')}:00`
})
