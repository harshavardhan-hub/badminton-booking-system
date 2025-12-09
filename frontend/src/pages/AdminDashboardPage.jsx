import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from '../components/admin/Dashboard'
import CourtManager from '../components/admin/CourtManager'
import CoachManager from '../components/admin/CoachManager'
import EquipmentManager from '../components/admin/EquipmentManager'
import PricingRuleManager from '../components/admin/PricingRuleManager'
import BookingHistory from '../components/booking/BookingHistory'

const AdminDashboardPage = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <Routes>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="courts" element={<CourtManager />} />
        <Route path="coaches" element={<CoachManager />} />
        <Route path="equipment" element={<EquipmentManager />} />
        <Route path="pricing" element={<PricingRuleManager />} />
        <Route path="bookings" element={<BookingHistory />} />
      </Routes>
    </div>
  )
}

export default AdminDashboardPage
