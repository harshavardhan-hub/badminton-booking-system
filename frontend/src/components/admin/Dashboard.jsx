import React, { useState, useEffect } from 'react'
import { DollarSign, Calendar, TrendingUp, Users } from 'lucide-react'
import Card from '../common/Card'
import LoadingSpinner from '../common/LoadingSpinner'
import bookingService from '../../services/bookingService'
import BookingTrendsChart from '../charts/BookingTrendsChart'
import CourtOccupancyChart from '../charts/CourtOccupancyChart'

const Dashboard = () => {
  const [stats, setStats] = useState(null)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch stats
      const statsResponse = await bookingService.getBookingStats()
      console.log('Stats:', statsResponse.data) // Debug
      setStats(statsResponse.data)

      // Fetch all bookings for charts
      const bookingsResponse = await bookingService.getAllBookings()
      console.log('All Bookings:', bookingsResponse.data) // Debug
      setBookings(bookingsResponse.data || [])
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingSpinner text="Loading dashboard..." />
  }

  const statCards = [
    {
      title: 'Total Revenue',
      value: `₹${stats?.totalRevenue?.toFixed(2) || 0}`,
      icon: DollarSign,
      color: 'text-sport-green',
      bgColor: 'bg-sport-green-light'
    },
    {
      title: 'Total Bookings',
      value: stats?.totalBookings || 0,
      icon: Calendar,
      color: 'text-chart-blue',
      bgColor: 'bg-blue-50'
    },
    {
      title: "Today's Bookings",
      value: stats?.todayBookings || 0,
      icon: TrendingUp,
      color: 'text-chart-cyan',
      bgColor: 'bg-cyan-50'
    },
    {
      title: 'Active Users',
      value: stats?.activeUsers || 0,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-text-primary">Admin Dashboard</h2>
        <button 
          onClick={fetchDashboardData}
          className="px-4 py-2 text-sm bg-sport-blue text-white rounded-xl hover:bg-blue-700 transition-colors"
        >
          Refresh Data
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} padding={false}>
              <div className="p-6 flex items-center gap-4">
                <div className={`p-4 rounded-2xl ${stat.bgColor}`}>
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-text-muted">{stat.title}</p>
                  <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Court Occupancy">
          {stats?.courtOccupancy && stats.courtOccupancy.length > 0 ? (
            <CourtOccupancyChart data={stats.courtOccupancy} />
          ) : (
            <div className="h-[300px] flex items-center justify-center text-text-muted">
              No data available
            </div>
          )}
        </Card>
        <Card title="Booking Trends (Last 7 Days)">
          {bookings.length > 0 ? (
            <>
              <BookingTrendsChart bookings={bookings} />
              <p className="text-xs text-text-muted text-center mt-2">
                Total bookings in chart: {bookings.filter(b => b.status !== 'cancelled').length}
              </p>
            </>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-text-muted">
              No bookings data available
            </div>
          )}
        </Card>
      </div>

      {/* Recent Bookings Summary */}
      <Card title="Booking Status Summary">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-sport-green-light rounded-xl">
            <p className="text-3xl font-bold text-sport-green">
              {bookings.filter(b => b.status === 'confirmed').length}
            </p>
            <p className="text-sm text-text-muted mt-1">Confirmed Bookings</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-xl">
            <p className="text-3xl font-bold text-chart-blue">
              {bookings.filter(b => b.status === 'completed').length}
            </p>
            <p className="text-sm text-text-muted mt-1">Completed Bookings</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-xl">
            <p className="text-3xl font-bold text-chart-red">
              {bookings.filter(b => b.status === 'cancelled').length}
            </p>
            <p className="text-sm text-text-muted mt-1">Cancelled Bookings</p>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Dashboard
