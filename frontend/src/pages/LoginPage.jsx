import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react'
import useAuth from '../hooks/useAuth'
import Button from '../components/common/Button'
import Card from '../components/common/Card'

const LoginPage = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      setStatusMessage('Connecting to server...')
      
      // Show waking up message after 3 seconds
      const wakingUpTimer = setTimeout(() => {
        setStatusMessage('Waking up server (free tier)... Please wait...')
      }, 3000)

      await login(formData)
      
      clearTimeout(wakingUpTimer)
      toast.success('Login successful!')
      navigate('/')
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Login failed. Please try again.'
      toast.error(errorMsg)
      setStatusMessage('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back!</h2>
          <p className="mt-2 text-gray-600">Login to book your badminton court</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>
          </div>

          {loading && statusMessage && (
            <div className="flex items-center justify-center gap-2 text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
              <Loader2 className="animate-spin" size={16} />
              <span>{statusMessage}</span>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Logging in...
              </>
            ) : (
              <>
                Login
                <ArrowRight size={20} />
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-green-600 hover:text-green-700 font-semibold">
              Sign up
            </Link>
          </p>
        </div>

        <Card className="mt-6 bg-gray-50">
          <p className="text-sm font-semibold text-gray-700 mb-2">Demo Credentials</p>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium text-gray-600">Admin:</span>
              <p className="text-gray-700">admin@badminton.com</p>
              <p className="text-gray-700">admin123</p>
            </div>
            <div className="mt-2">
              <span className="font-medium text-gray-600">User:</span>
              <p className="text-gray-700">john@example.com</p>
              <p className="text-gray-700">password123</p>
            </div>
          </div>
          <p className="text-xs text-yellow-600 mt-2">
            ⏰ First login may take 30-60 seconds (free server waking up)
          </p>
        </Card>
      </Card>
    </div>
  )
}

export default LoginPage
