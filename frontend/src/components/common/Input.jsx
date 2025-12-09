import React from 'react'

const Input = ({ 
  label, 
  type = 'text', 
  name, 
  value, 
  onChange, 
  placeholder, 
  error,
  required = false,
  disabled = false,
  className = '',
  ...props 
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-text-primary mb-2">
          {label}
          {required && <span className="text-chart-red ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`w-full px-4 py-2.5 border border-border-color rounded-xl focus:outline-none focus:ring-2 focus:ring-sport-blue focus:border-transparent transition-all ${
          error ? 'border-chart-red' : ''
        } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-chart-red">{error}</p>}
    </div>
  )
}

export default Input
