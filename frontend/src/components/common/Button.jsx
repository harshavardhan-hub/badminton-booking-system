import React from 'react'

const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  className = '',
  ...props 
}) => {
  const baseStyles = 'font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variants = {
    primary: 'bg-sport-blue text-white hover:bg-blue-700 focus:ring-sport-blue',
    secondary: 'bg-gray-200 text-text-primary hover:bg-gray-300 focus:ring-gray-400',
    success: 'bg-sport-green text-white hover:bg-green-700 focus:ring-sport-green',
    danger: 'bg-chart-red text-white hover:bg-red-600 focus:ring-chart-red',
    outline: 'border-2 border-sport-blue text-sport-blue hover:bg-sport-blue hover:text-white focus:ring-sport-blue'
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }

  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabledStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
