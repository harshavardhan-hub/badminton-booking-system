import React from 'react'

const Card = ({ children, className = '', title, subtitle, padding = true }) => {
  return (
    <div className={`bg-bg-card rounded-2xl shadow-md ${padding ? 'p-6' : ''} ${className}`}>
      {title && (
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-text-primary">{title}</h3>
          {subtitle && <p className="text-sm text-text-muted mt-1">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  )
}

export default Card
