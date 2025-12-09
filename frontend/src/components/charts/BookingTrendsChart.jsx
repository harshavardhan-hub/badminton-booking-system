import React, { useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const BookingTrendsChart = ({ bookings = [] }) => {
  const chartData = useMemo(() => {
    // Get last 7 days
    const days = []
    const today = new Date()
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)
      days.push(date)
    }

    // Count bookings per day
    const data = days.map(day => {
      const dayStr = day.toISOString().split('T')[0] // YYYY-MM-DD format
      
      const count = bookings.filter(booking => {
        if (!booking.date) return false
        
        // Handle both string and Date object
        const bookingDateStr = new Date(booking.date).toISOString().split('T')[0]
        const isMatch = bookingDateStr === dayStr && booking.status !== 'cancelled'
        
        return isMatch
      }).length

      // Get day name
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      const dayName = dayNames[day.getDay()]
      
      // Get formatted date
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const fullDate = `${monthNames[day.getMonth()]} ${day.getDate()}`

      return {
        name: dayName,
        bookings: count,
        fullDate: fullDate,
        date: dayStr
      }
    })

    console.log('Chart Data:', data) // Debug log
    console.log('Bookings:', bookings.length) // Debug log

    return data
  }, [bookings])

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
        <XAxis 
          dataKey="name" 
          stroke="#64748B"
          style={{ fontSize: '12px' }}
        />
        <YAxis 
          stroke="#64748B"
          style={{ fontSize: '12px' }}
          allowDecimals={false}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#FFFFFF', 
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            padding: '8px 12px'
          }}
          labelFormatter={(label, payload) => {
            if (payload && payload[0]) {
              return payload[0].payload.fullDate
            }
            return label
          }}
          formatter={(value) => [value, 'Bookings']}
        />
        <Line 
          type="monotone" 
          dataKey="bookings" 
          stroke="#2563EB" 
          strokeWidth={3}
          dot={{ fill: '#2563EB', r: 5 }}
          activeDot={{ r: 7 }}
          name="Bookings"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default BookingTrendsChart
