import { format, addDays, startOfDay } from 'date-fns'

export const formatDate = (date) => {
  return format(new Date(date), 'yyyy-MM-dd')
}

export const formatDisplayDate = (date) => {
  return format(new Date(date), 'MMM dd, yyyy')
}

export const formatTime = (time) => {
  return time
}

export const getTodayDate = () => {
  return formatDate(new Date())
}

export const getNextDays = (days = 7) => {
  const dates = []
  for (let i = 0; i < days; i++) {
    dates.push(addDays(new Date(), i))
  }
  return dates
}

export const isToday = (date) => {
  return formatDate(date) === formatDate(new Date())
}

export const isPastDate = (date) => {
  return new Date(date) < startOfDay(new Date())
}
