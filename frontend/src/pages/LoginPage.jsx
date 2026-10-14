import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Mail, Lock, ArrowRight } from 'lucide-react'
import useAuth from '../hooks/useAuth'
import Button from '../components/common/Button'
import Card from '../components/common/Card'

const LoginPage = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      await login(formData)
      toast.success('Login successful!')
      navigate('/')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center mb-3">
            <img 
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS764vaFB9SWiSD-9-qr6VT5ZcN1BNzV_rGUQ&s" 
              alt="Badminton Logo" 
              className="w-14 h-14 object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Welcome Back
          </h1>
          <p className="text-sm text-gray-600">
            Login to book your badminton court
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sport-green focus:border-transparent transition-all text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sport-green focus:border-transparent transition-all text-sm"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="success"
              className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium mt-5"
              disabled={loading}
            >
              {loading ? (
                'Logging in...'
              ) : (
                <>
                  Login
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-600">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="text-sport-green hover:text-green-700 font-semibold transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="mt-4 p-3 bg-gradient-to-br from-green-50 to-blue-50 border border-green-100 rounded-lg">
            <p className="text-xs font-semibold text-gray-800 mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                Demo Credentials (Strict)
              </span>
              <span className="text-[10px] text-gray-500 font-normal">Click to autofill</span>
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-700">
              <div 
                onClick={() => setFormData({ email: 'admin@badminton.com', password: 'Admin@Badminton#2026!' })}
                className="bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded cursor-pointer border border-transparent hover:border-sport-green transition-all shadow-xs"
                title="Click to fill Admin credentials"
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-xs text-gray-900">Admin</p>
                  <span className="text-[9px] text-sport-green font-medium">Use</span>
                </div>
                <p className="text-gray-600 text-[10px] truncate">admin@badminton.com</p>
                <p className="text-gray-500 text-[9px] font-mono">Admin@Badminton#2026!</p>
              </div>
              <div 
                onClick={() => setFormData({ email: 'john@example.com', password: 'User@Badminton#2026!' })}
                className="bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded cursor-pointer border border-transparent hover:border-sport-green transition-all shadow-xs"
                title="Click to fill User credentials"
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-xs text-gray-900">User</p>
                  <span className="text-[9px] text-sport-green font-medium">Use</span>
                </div>
                <p className="text-gray-600 text-[10px] truncate">john@example.com</p>
                <p className="text-gray-500 text-[9px] font-mono">User@Badminton#2026!</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default LoginPage