import React from 'react'

const LoadingSpinner = ({ size = 'md', text = '' }) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  }

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className={`${sizes[size]} border-4 border-gray-200 border-t-sport-blue rounded-full animate-spin`}></div>
      {text && <p className="mt-4 text-text-secondary">{text}</p>}
    </div>
  )
}

export default LoadingSpinner
