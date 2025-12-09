import React, { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { toast } from 'react-toastify'
import coachService from '../../services/coachService'
import Card from '../common/Card'
import Button from '../common/Button'
import Modal from '../common/Modal'
import Input from '../common/Input'
import Select from '../common/Select'
import LoadingSpinner from '../common/LoadingSpinner'

const CoachManager = () => {
  const [coaches, setCoaches] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCoach, setEditingCoach] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: '',
    hourlyRate: '',
    bio: '',
    experience: '',
    isActive: true
  })

  useEffect(() => {
    fetchCoaches()
  }, [])

  const fetchCoaches = async () => {
    try {
      setLoading(true)
      const response = await coachService.getAllCoaches()
      setCoaches(response.data)
    } catch (error) {
      toast.error('Failed to fetch coaches')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const coachData = {
      ...formData,
      hourlyRate: parseFloat(formData.hourlyRate),
      experience: parseInt(formData.experience) || 0
    }

    try {
      if (editingCoach) {
        await coachService.updateCoach(editingCoach._id, coachData)
        toast.success('Coach updated successfully')
      } else {
        await coachService.createCoach(coachData)
        toast.success('Coach created successfully')
      }
      fetchCoaches()
      handleCloseModal()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this coach?')) return

    try {
      await coachService.deleteCoach(id)
      toast.success('Coach deleted successfully')
      fetchCoaches()
    } catch (error) {
      toast.error('Failed to delete coach')
    }
  }

  const handleEdit = (coach) => {
    setEditingCoach(coach)
    setFormData({
      name: coach.name,
      email: coach.email,
      phone: coach.phone,
      specialization: coach.specialization || '',
      hourlyRate: coach.hourlyRate,
      bio: coach.bio || '',
      experience: coach.experience || 0,
      isActive: coach.isActive
    })
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingCoach(null)
    setFormData({
      name: '',
      email: '',
      phone: '',
      specialization: '',
      hourlyRate: '',
      bio: '',
      experience: '',
      isActive: true
    })
  }

  if (loading) {
    return <LoadingSpinner text="Loading coaches..." />
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-text-primary">Coach Management</h2>
        <Button variant="success" onClick={() => setShowModal(true)}>
          <Plus className="w-5 h-5 mr-2 inline" />
          Add Coach
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coaches.map((coach) => (
          <Card key={coach._id} padding={false}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-text-primary">{coach.name}</h3>
                  <p className="text-sm text-text-muted">{coach.specialization}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(coach)}
                    className="p-2 rounded-lg hover:bg-sport-green-light transition-colors"
                  >
                    <Edit2 className="w-4 h-4 text-sport-blue" />
                  </button>
                  <button
                    onClick={() => handleDelete(coach._id)}
                    className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-chart-red" />
                  </button>
                </div>
              </div>

              <p className="text-text-secondary text-sm mb-4 line-clamp-2">{coach.bio}</p>

              <div className="space-y-2 text-sm text-text-secondary mb-4">
                <p>📧 {coach.email}</p>
                <p>📞 {coach.phone}</p>
                <p>⭐ Experience: {coach.experience} years</p>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-sport-green">₹{coach.hourlyRate}/hr</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  coach.isActive ? 'bg-sport-green-light text-sport-green' : 'bg-gray-100 text-gray-600'
                }`}>
                  {coach.isActive ? 'Active' : 'Inactive'}
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
        title={editingCoach ? 'Edit Coach' : 'Add New Coach'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Coach Name"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />

          <Input
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />

          <Input
            label="Specialization"
            name="specialization"
            value={formData.specialization}
            onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
          />

          <Input
            label="Hourly Rate (₹)"
            name="hourlyRate"
            type="number"
            value={formData.hourlyRate}
            onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
            required
          />

          <Input
            label="Experience (years)"
            name="experience"
            type="number"
            value={formData.experience}
            onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
          />

          <Input
            label="Bio"
            name="bio"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
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
              {editingCoach ? 'Update Coach' : 'Create Coach'}
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

export default CoachManager
