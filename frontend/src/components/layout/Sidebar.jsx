import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Home, 
  Calendar, 
  Clock, 
  Settings, 
  BarChart3, 
  Users, 
  ShoppingBag,
  DollarSign,
  ChevronDown,
  ChevronRight
} from 'lucide-react'
import useAuth from '../../hooks/useAuth'

const Sidebar = () => {
  const location = useLocation()
  const { isAdmin } = useAuth()
  const [adminMenuOpen, setAdminMenuOpen] = useState(location.pathname.startsWith('/admin'))

  const menuItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/booking', label: 'Book a Court', icon: Calendar },
    { path: '/my-bookings', label: 'My Bookings', icon: Clock }
  ]

  const adminMenuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/admin/courts', label: 'Courts', icon: ShoppingBag },
    { path: '/admin/coaches', label: 'Coaches', icon: Users },
    { path: '/admin/equipment', label: 'Equipment', icon: ShoppingBag },
    { path: '/admin/pricing', label: 'Pricing Rules', icon: DollarSign },
    { path: '/admin/bookings', label: 'All Bookings', icon: Calendar }
  ]

  const isActive = (path) => location.pathname === path

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-72 bg-bg-sidebar border-r border-border-color overflow-y-auto hidden lg:block">
      <div className="p-6">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive(item.path)
                    ? 'bg-sport-green-light text-sport-green font-medium'
                    : 'text-text-secondary hover:bg-sport-green-light hover:text-text-primary'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}

          {isAdmin && (
            <div className="pt-4 border-t border-border-color mt-4">
              <button
                onClick={() => setAdminMenuOpen(!adminMenuOpen)}
                className="flex items-center justify-between w-full px-4 py-3 rounded-xl hover:bg-sport-green-light transition-colors text-text-secondary"
              >
                <div className="flex items-center space-x-3">
                  <Settings className="w-5 h-5" />
                  <span className="font-medium">Admin Panel</span>
                </div>
                {adminMenuOpen ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>

              {adminMenuOpen && (
                <div className="ml-4 mt-2 space-y-1">
                  {adminMenuItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center space-x-3 px-4 py-2 rounded-xl transition-colors ${
                          isActive(item.path)
                            ? 'bg-sport-green-light text-sport-green font-medium'
                            : 'text-text-secondary hover:bg-sport-green-light hover:text-text-primary'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm">{item.label}</span>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
    </aside>
  )
}

export default Sidebar
