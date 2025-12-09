import React from 'react'
import Card from '../common/Card'

const PriceBreakdown = ({ breakdown }) => {
  if (!breakdown) return null

  return (
    <Card title="Price Breakdown">
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-text-secondary">Court Base Price:</span>
          <span className="font-medium text-text-primary">₹{breakdown.courtBasePrice}</span>
        </div>

        {breakdown.appliedRules && breakdown.appliedRules.length > 0 && (
          <div className="border-t border-border-color pt-3">
            <p className="text-sm font-medium text-text-primary mb-2">Applied Rules:</p>
            {breakdown.appliedRules.map((rule, index) => (
              <div key={index} className="flex justify-between items-center text-sm ml-4">
                <span className="text-text-secondary">{rule.ruleName}:</span>
                <span className="font-medium text-sport-green">
                  {rule.modifier >= 0 ? '+' : ''}₹{rule.modifier.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center">
          <span className="text-text-secondary">Court Final Price:</span>
          <span className="font-medium text-text-primary">₹{breakdown.courtFinalPrice}</span>
        </div>

        {breakdown.coachFee > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-text-secondary">Coach Fee:</span>
            <span className="font-medium text-text-primary">₹{breakdown.coachFee}</span>
          </div>
        )}

        {breakdown.equipmentFee > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-text-secondary">Equipment Fee:</span>
            <span className="font-medium text-text-primary">₹{breakdown.equipmentFee}</span>
          </div>
        )}

        <div className="border-t-2 border-sport-green pt-3 flex justify-between items-center">
          <span className="text-lg font-semibold text-text-primary">Total Amount:</span>
          <span className="text-2xl font-bold text-sport-green">₹{breakdown.totalPrice}</span>
        </div>
      </div>
    </Card>
  )
}

export default PriceBreakdown
