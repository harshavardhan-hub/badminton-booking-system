import React, { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { toast } from 'react-toastify'
import courtService from '../../services/courtService'
import Card from '../common/Card'
import Button from '../common/Button'
import Modal from '../common/Modal'
import Input from '../common/Input'
import Select from '../common/Select'
import LoadingSpinner from '../common/LoadingSpinner'

const CourtManager = () => {
  const [courts, setCourts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCourt, setEditingCourt] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    type: 'indoor',
    basePrice: '',
    description: '',
    features: '',
    isActive: true
  })

  useEffect(() => {
    fetchCourts()
  }, [])

  const fetchCourts = async () => {
    try {
      setLoading(true)
      const response = await courtService.getAllCourts()
      setCourts(response.data)
    } catch (error) {
      toast.error('Failed to fetch courts')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const courtData = {
      ...formData,
      basePrice: parseFloat(formData.basePrice),
      features: formData.features.split(',').map(f => f.trim()).filter(f => f)
    }

    try {
      if (editingCourt) {
        await courtService.updateCourt(editingCourt._id, courtData)
        toast.success('Court updated successfully')
      } else {
        await courtService.createCourt(courtData)
        toast.success('Court created successfully')
      }
      fetchCourts()
      handleCloseModal()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this court?')) return

    try {
      await courtService.deleteCourt(id)
      toast.success('Court deleted successfully')
      fetchCourts()
    } catch (error) {
      toast.error('Failed to delete court')
    }
  }

  const handleEdit = (court) => {
    setEditingCourt(court)
    setFormData({
      name: court.name,
      type: court.type,
      basePrice: court.basePrice,
      description: court.description || '',
      features: court.features?.join(', ') || '',
      isActive: court.isActive
    })
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingCourt(null)
    setFormData({
      name: '',
      type: 'indoor',
      basePrice: '',
      description: '',
      features: '',
      isActive: true
    })
  }

  if (loading) {
    return <LoadingSpinner text="Loading courts..." />
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-text-primary">Court Management</h2>
        <Button variant="success" onClick={() => setShowModal(true)}>
          <Plus className="w-5 h-5 mr-2 inline" />
          Add Court
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courts.map((court) => (
          <Card key={court._id} padding={false}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-text-primary">{court.name}</h3>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                    court.type === 'indoor' ? 'bg-blue-100 text-chart-cyan' : 'bg-green-100 text-chart-lime'
                  }`}>
                    {court.type}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(court)}
                    className="p-2 rounded-lg hover:bg-sport-green-light transition-colors"
                  >
                    <Edit2 className="w-4 h-4 text-sport-blue" />
                  </button>
                  <button
                    onClick={() => handleDelete(court._id)}
                    className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-chart-red" />
                  </button>
                </div>
              </div>

              <p className="text-text-secondary text-sm mb-4">{court.description}</p>

              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-sport-green">₹{court.basePrice}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  court.isActive ? 'bg-sport-green-light text-sport-green' : 'bg-gray-100 text-gray-600'
                }`}>
                  {court.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingCourt ? 'Edit Court' : 'Add New Court'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Court Name"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <Select
            label="Court Type"
            name="type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            options={[
              { value: 'indoor', label: 'Indoor' },
              { value: 'outdoor', label: 'Outdoor' }
            ]}
            required
          />

          <Input
            label="Base Price (₹)"
            name="basePrice"
            type="number"
            value={formData.basePrice}
            onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
            required
          />

          <Input
            label="Description"
            name="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <Input
            label="Features (comma separated)"
            name="features"
            value={formData.features}
            onChange={(e) => setFormData({ ...formData, features: e.target.value })}
            placeholder="AC, LED Lighting, Professional Flooring"
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
              {editingCourt ? 'Update Court' : 'Create Court'}
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

export default CourtManager
