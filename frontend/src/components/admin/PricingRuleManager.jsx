import React, { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'
import { toast } from 'react-toastify'
import pricingService from '../../services/pricingService'
import Card from '../common/Card'
import Button from '../common/Button'
import Modal from '../common/Modal'
import Input from '../common/Input'
import Select from '../common/Select'
import LoadingSpinner from '../common/LoadingSpinner'

const PricingRuleManager = () => {
  const [rules, setRules] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingRule, setEditingRule] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'peak_hour',
    conditions: {
      startTime: '',
      endTime: '',
      days: [],
      courtType: '',
      startDate: '',
      endDate: ''
    },
    modifier: {
      type: 'percentage',
      value: ''
    },
    isActive: true,
    priority: 0
  })

  useEffect(() => {
    fetchRules()
  }, [])

  const fetchRules = async () => {
    try {
      setLoading(true)
      const response = await pricingService.getAllRules()
      setRules(response.data)
    } catch (error) {
      toast.error('Failed to fetch pricing rules')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const ruleData = {
      ...formData,
      modifier: {
        type: formData.modifier.type,
        value: parseFloat(formData.modifier.value)
      },
      priority: parseInt(formData.priority)
    }

    try {
      if (editingRule) {
        await pricingService.updateRule(editingRule._id, ruleData)
        toast.success('Pricing rule updated successfully')
      } else {
        await pricingService.createRule(ruleData)
        toast.success('Pricing rule created successfully')
      }
      fetchRules()
      handleCloseModal()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this pricing rule?')) return

    try {
      await pricingService.deleteRule(id)
      toast.success('Pricing rule deleted successfully')
      fetchRules()
    } catch (error) {
      toast.error('Failed to delete pricing rule')
    }
  }

  const toggleRuleStatus = async (rule) => {
    try {
      await pricingService.updateRule(rule._id, { ...rule, isActive: !rule.isActive })
      toast.success(`Rule ${!rule.isActive ? 'activated' : 'deactivated'}`)
      fetchRules()
    } catch (error) {
      toast.error('Failed to update rule status')
    }
  }

  const handleEdit = (rule) => {
    setEditingRule(rule)
    setFormData({
      name: rule.name,
      description: rule.description || '',
      type: rule.type,
      conditions: rule.conditions || {
        startTime: '',
        endTime: '',
        days: [],
        courtType: '',
        startDate: '',
        endDate: ''
      },
      modifier: rule.modifier,
      isActive: rule.isActive,
      priority: rule.priority || 0
    })
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingRule(null)
    setFormData({
      name: '',
      description: '',
      type: 'peak_hour',
      conditions: {
        startTime: '',
        endTime: '',
        days: [],
        courtType: '',
        startDate: '',
        endDate: ''
      },
      modifier: {
        type: 'percentage',
        value: ''
      },
      isActive: true,
      priority: 0
    })
  }

  if (loading) {
    return <LoadingSpinner text="Loading pricing rules..." />
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-text-primary">Pricing Rules</h2>
        <Button variant="success" onClick={() => setShowModal(true)}>
          <Plus className="w-5 h-5 mr-2 inline" />
          Add Rule
        </Button>
      </div>

      <div className="space-y-4">
        {rules.map((rule) => (
          <Card key={rule._id} padding={false}>
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-text-primary">{rule.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      rule.type === 'peak_hour' ? 'bg-orange-100 text-orange-600' :
                      rule.type === 'weekend' ? 'bg-purple-100 text-purple-600' :
                      rule.type === 'court_type' ? 'bg-blue-100 text-chart-blue' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {rule.type.replace('_', ' ')}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      rule.isActive ? 'bg-sport-green-light text-sport-green' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {rule.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary mb-3">{rule.description}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-text-muted">
                      Modifier: <span className="font-medium text-text-primary">
                        {rule.modifier.type === 'percentage' ? 
                          `${rule.modifier.value}%` : 
                          `₹${rule.modifier.value}`}
                      </span>
                    </span>
                    <span className="text-text-muted">
                      Priority: <span className="font-medium text-text-primary">{rule.priority}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleRuleStatus(rule)}
                    className="p-2 rounded-lg hover:bg-sport-green-light transition-colors"
                    title={rule.isActive ? 'Deactivate' : 'Activate'}
                  >
                    {rule.isActive ? (
                      <ToggleRight className="w-6 h-6 text-sport-green" />
                    ) : (
                      <ToggleLeft className="w-6 h-6 text-gray-400" />
                    )}
                  </button>
                  <button
                    onClick={() => handleEdit(rule)}
                    className="p-2 rounded-lg hover:bg-sport-green-light transition-colors"
                  >
                    <Edit2 className="w-5 h-5 text-sport-blue" />
                  </button>
                  <button
                    onClick={() => handleDelete(rule._id)}
                    className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-5 h-5 text-chart-red" />
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingRule ? 'Edit Pricing Rule' : 'Add New Pricing Rule'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Rule Name"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <Input
            label="Description"
            name="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <Select
            label="Rule Type"
            name="type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            options={[
              { value: 'peak_hour', label: 'Peak Hour' },
              { value: 'weekend', label: 'Weekend' },
              { value: 'court_type', label: 'Court Type' },
              { value: 'holiday', label: 'Holiday' },
              { value: 'custom', label: 'Custom' }
            ]}
            required
          />

          {formData.type === 'peak_hour' && (
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Start Time"
                name="startTime"
                type="time"
                value={formData.conditions.startTime}
                onChange={(e) => setFormData({
                  ...formData,
                  conditions: { ...formData.conditions, startTime: e.target.value }
                })}
                required
              />
              <Input
                label="End Time"
                name="endTime"
                type="time"
                value={formData.conditions.endTime}
                onChange={(e) => setFormData({
                  ...formData,
                  conditions: { ...formData.conditions, endTime: e.target.value }
                })}
                required
              />
            </div>
          )}

          {formData.type === 'court_type' && (
            <Select
              label="Court Type"
              name="courtType"
              value={formData.conditions.courtType}
              onChange={(e) => setFormData({
                ...formData,
                conditions: { ...formData.conditions, courtType: e.target.value }
              })}
              options={[
                { value: 'indoor', label: 'Indoor' },
                { value: 'outdoor', label: 'Outdoor' }
              ]}
              required
            />
          )}

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Modifier Type"
              name="modifierType"
              value={formData.modifier.type}
              onChange={(e) => setFormData({
                ...formData,
                modifier: { ...formData.modifier, type: e.target.value }
              })}
              options={[
                { value: 'percentage', label: 'Percentage (%)' },
                { value: 'fixed', label: 'Fixed Amount (₹)' }
              ]}
              required
            />
            <Input
              label="Modifier Value"
              name="modifierValue"
              type="number"
              value={formData.modifier.value}
              onChange={(e) => setFormData({
                ...formData,
                modifier: { ...formData.modifier, value: e.target.value }
              })}
              required
            />
          </div>

          <Input
            label="Priority (Lower = Higher Priority)"
            name="priority"
            type="number"
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
          />

          <Select
            label="Status"
            name="isActive"
            value={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
            options={[
              { value: 'true', label: 'Active' },
              { value: 'false', label: 'Inactive' }
            ]}
          />

          <div className="flex gap-3 pt-4">
            <Button type="submit" variant="success" className="flex-1">
              {editingRule ? 'Update Rule' : 'Create Rule'}
            </Button>
            <Button type="button" variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </>
  )
}

export default PricingRuleManager
