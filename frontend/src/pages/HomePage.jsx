import React from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Clock, Award, Shield } from 'lucide-react'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import useAuth from '../hooks/useAuth'

const HomePage = () => {
  const { isAuthenticated } = useAuth()

  const features = [
    {
      icon: Calendar,
      title: 'Easy Booking',
      description: 'Book your favorite court in just a few clicks'
    },
    {
      icon: Clock,
      title: 'Real-Time Availability',
      description: 'See available slots instantly and book on the go'
    },
    {
      icon: Award,
      title: 'Professional Coaches',
      description: 'Train with experienced and certified coaches'
    },
    {
      icon: Shield,
      title: 'Secure Payments',
      description: 'Safe and secure payment processing'
    }
  ]

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center py-12 bg-gradient-to-br from-slate-800 via-blue-900 to-teal-900 rounded-2xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
          Book Your Badminton Court Today
        </h1>
        <p className="text-xl mb-8 text-blue-100">
          Premium courts, professional coaches, and equipment rental all in one place
        </p>
        <Link to="/booking">
          <Button variant="secondary" size="lg" className="bg-white text-sport-green hover:bg-gray-100">
            Book Now
          </Button>
        </Link>
      </div>

      {/* Features Grid */}
      <div>
        <h2 className="text-3xl font-bold text-text-primary text-center mb-8">
          Why Choose Us?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} padding={false}>
                <div className="p-6 text-center">
                  <div className="inline-flex p-4 bg-sport-green-light rounded-2xl mb-4">
                    <Icon className="w-8 h-8 text-sport-green" />
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-text-secondary text-sm">
                    {feature.description}
                  </p>
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      {/* CTA Section */}
      {!isAuthenticated && (
        <Card>
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold text-text-primary mb-4">
              Ready to Play?
            </h2>
            <p className="text-text-secondary mb-6">
              Create an account to start booking courts and training sessions
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/register">
                <Button variant="success" size="lg">
                  Sign Up Now
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg">
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

export default HomePage
