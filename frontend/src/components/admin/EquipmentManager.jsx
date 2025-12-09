import React, { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { toast } from 'react-toastify'
import equipmentService from '../../services/equipmentService'
import Card from '../common/Card'
import Button from '../common/Button'
import Modal from '../common/Modal'
import Input from '../common/Input'
import Select from '../common/Select'
import LoadingSpinner from '../common/LoadingSpinner'

const EquipmentManager = () => {
  const [equipment, setEquipment] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingEquipment, setEditingEquipment] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    type: 'racket',
    totalQuantity: '',
    pricePerHour: '',
    description: '',
    isActive: true
  })

  useEffect(() => {
    fetchEquipment()
  }, [])

  const fetchEquipment = async () => {
    try {
      setLoading(true)
      const response = await equipmentService.getAllEquipment()
      setEquipment(response.data)
    } catch (error) {
      toast.error('Failed to fetch equipment')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const equipmentData = {
      ...formData,
      totalQuantity: parseInt(formData.totalQuantity),
      pricePerHour: parseFloat(formData.pricePerHour)
    }

    try {
      if (editingEquipment) {
        await equipmentService.updateEquipment(editingEquipment._id, equipmentData)
        toast.success('Equipment updated successfully')
      } else {
        await equipmentService.createEquipment(equipmentData)
        toast.success('Equipment created successfully')
      }
      fetchEquipment()
      handleCloseModal()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this equipment?')) return

    try {
      await equipmentService.deleteEquipment(id)
      toast.success('Equipment deleted successfully')
      fetchEquipment()
    } catch (error) {
      toast.error('Failed to delete equipment')
    }
  }

  const handleEdit = (item) => {
    setEditingEquipment(item)
    setFormData({
      name: item.name,
      type: item.type,
      totalQuantity: item.totalQuantity,
      pricePerHour: item.pricePerHour,
      description: item.description || '',
      isActive: item.isActive
    })
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingEquipment(null)
    setFormData({
      name: '',
      type: 'racket',
      totalQuantity: '',
      pricePerHour: '',
      description: '',
      isActive: true
    })
  }

  if (loading) {
    return <LoadingSpinner text="Loading equipment..." />
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-text-primary">Equipment Management</h2>
        <Button variant="success" onClick={() => setShowModal(true)}>
          <Plus className="w-5 h-5 mr-2 inline" />
          Add Equipment
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {equipment.map((item) => (
          <Card key={item._id} padding={false}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-text-primary">{item.name}</h3>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                    item.type === 'racket' ? 'bg-blue-100 text-chart-blue' : 'bg-purple-100 text-purple-600'
                  }`}>
                    {item.type}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 rounded-lg hover:bg-sport-green-light transition-colors"
                  >
                    <Edit2 className="w-4 h-4 text-sport-blue" />
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-chart-red" />
                  </button>
                </div>
              </div>

              <p className="text-text-secondary text-sm mb-4">{item.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Available Quantity:</span>
                  <span className="font-medium text-text-primary">{item.totalQuantity}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Price per Hour:</span>
                  <span className="font-medium text-sport-green">₹{item.pricePerHour}</span>
                </div>
              </div>

              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                item.isActive ? 'bg-sport-green-light text-sport-green' : 'bg-gray-100 text-gray-600'
              }`}>
                {item.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingEquipment ? 'Edit Equipment' : 'Add New Equipment'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Equipment Name"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <Select
            label="Equipment Type"
            name="type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            options={[
              { value: 'racket', label: 'Racket' },
              { value: 'shoes', label: 'Shoes' },
              { value: 'other', label: 'Other' }
            ]}
            required
          />

          <Input
            label="Total Quantity"
            name="totalQuantity"
            type="number"
            value={formData.totalQuantity}
            onChange={(e) => setFormData({ ...formData, totalQuantity: e.target.value })}
            required
          />

          <Input
            label="Price per Hour (₹)"
            name="pricePerHour"
            type="number"
            value={formData.pricePerHour}
            onChange={(e) => setFormData({ ...formData, pricePerHour: e.target.value })}
            required
          />

          <Input
            label="Description"
            name="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
              {editingEquipment ? 'Update Equipment' : 'Create Equipment'}
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

export default EquipmentManager
