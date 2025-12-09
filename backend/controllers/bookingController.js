const Booking = require('../models/Booking');
const Court = require('../models/Court');
const Coach = require('../models/Coach');
const Equipment = require('../models/Equipment');
const Waitlist = require('../models/Waitlist');
const User = require('../models/User');
const { checkAvailability } = require('../utils/availabilityChecker');
const { calculatePrice } = require('../utils/priceCalculator');
const { sendWaitlistNotification } = require('../utils/emailService');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res) => {
  try {
    const { courtId, coachId, equipment, date, startTime, endTime, notes } = req.body;

    // Validate court exists
    const court = await Court.findById(courtId);
    if (!court || !court.isActive) {
      return res.status(404).json({ success: false, message: 'Court not found or inactive' });
    }

    // Validate coach if selected
    let coach = null;
    if (coachId) {
      coach = await Coach.findById(coachId);
      if (!coach || !coach.isActive) {
        return res.status(404).json({ success: false, message: 'Coach not found or inactive' });
      }
    }

    // Filter out equipment with quantity 0 or less
    const validEquipment = equipment && equipment.length > 0 
      ? equipment.filter(item => item.quantity > 0)
      : [];

    // Check availability
    const availability = await checkAvailability(courtId, coachId, validEquipment, date, startTime, endTime);
    
    if (!availability.available) {
      return res.status(409).json({ 
        success: false, 
        message: availability.reason,
        conflictType: availability.conflictType
      });
    }

    // Calculate pricing
    const courtPricing = await calculatePrice(court.basePrice, court.type, date, startTime);

    // Calculate equipment fee
    let equipmentFee = 0;
    if (validEquipment.length > 0) {
      for (const item of validEquipment) {
        const equipmentItem = await Equipment.findById(item.item);
        if (equipmentItem) {
          equipmentFee += equipmentItem.pricePerHour * item.quantity;
        }
      }
    }

    // Calculate coach fee
    const coachFee = coach ? coach.hourlyRate : 0;

    // Total price
    const totalPrice = courtPricing.finalPrice + equipmentFee + coachFee;

    // Create booking
    const booking = await Booking.create({
      user: req.user.id,
      court: courtId,
      coach: coachId || null,
      equipment: validEquipment,
      date,
      startTime,
      endTime,
      notes,
      pricingBreakdown: {
        courtBasePrice: courtPricing.basePrice,
        courtFinalPrice: courtPricing.finalPrice,
        appliedRules: courtPricing.appliedRules,
        coachFee,
        equipmentFee,
        totalPrice
      }
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('user', 'name email phone')
      .populate('court', 'name type')
      .populate('coach', 'name specialization')
      .populate('equipment.item', 'name type pricePerHour');

    res.status(201).json({
      success: true,
      data: populatedBooking
    });
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all bookings for logged in user
// @route   GET /api/bookings/my-bookings
// @access  Private
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('court', 'name type')
      .populate('coach', 'name specialization')
      .populate('equipment.item', 'name type')
      .sort({ date: -1, startTime: -1 });

    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    console.error('Get my bookings error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings
// @access  Private/Admin
exports.getAllBookings = async (req, res) => {
  try {
    const { status, date, court } = req.query;
    
    let query = {};
    
    if (status) query.status = status;
    if (date) query.date = new Date(date);
    if (court) query.court = court;

    const bookings = await Booking.find(query)
      .populate('user', 'name email phone')
      .populate('court', 'name type')
      .populate('coach', 'name specialization')
      .populate('equipment.item', 'name type')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch bookings',
      error: error.message 
    });
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
exports.getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('court', 'name type basePrice')
      .populate('coach', 'name specialization hourlyRate')
      .populate('equipment.item', 'name type pricePerHour');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Check if user owns the booking or is admin
    if (booking.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this booking' });
    }

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Check if user owns the booking or is admin
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this booking' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Booking is already cancelled' });
    }

    booking.status = 'cancelled';
    await booking.save();

    // Check waitlist and notify next person
    const waitlistEntry = await Waitlist.findOne({
      court: booking.court,
      date: booking.date,
      startTime: booking.startTime,
      endTime: booking.endTime,
      status: 'waiting'
    }).populate('user', 'name email').populate('court', 'name');

    if (waitlistEntry) {
      waitlistEntry.status = 'notified';
      waitlistEntry.notifiedAt = new Date();
      await waitlistEntry.save();

      // Send notification email
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        await sendWaitlistNotification(
          waitlistEntry.user.email,
          waitlistEntry.user.name,
          waitlistEntry.court.name,
          waitlistEntry.date,
          waitlistEntry.startTime
        );
      }
    }

    res.json({
      success: true,
      data: booking,
      message: 'Booking cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Check availability for a slot
// @route   POST /api/bookings/check-availability
// @access  Public
exports.checkSlotAvailability = async (req, res) => {
  try {
    const { courtId, coachId, equipment, date, startTime, endTime } = req.body;

    const availability = await checkAvailability(courtId, coachId, equipment, date, startTime, endTime);

    res.json({
      success: true,
      data: availability
    });
  } catch (error) {
    console.error('Check availability error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get available slots for a court on a date
// @route   GET /api/bookings/available-slots/:courtId/:date
// @access  Public
exports.getAvailableSlots = async (req, res) => {
  try {
    const { courtId, date } = req.params;

    // Validate court exists
    const court = await Court.findById(courtId);
    if (!court) {
      return res.status(404).json({ success: false, message: 'Court not found' });
    }

    // Operating hours: 6 AM to 10 PM
    const slots = [];
    for (let hour = 6; hour < 22; hour++) {
      const startTime = `${hour.toString().padStart(2, '0')}:00`;
      const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;

      const availability = await checkAvailability(courtId, null, [], date, startTime, endTime);

      slots.push({
        startTime,
        endTime,
        available: availability.available
      });
    }

    res.json({
      success: true,
      data: slots
    });
  } catch (error) {
    console.error('Get available slots error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add to waitlist
// @route   POST /api/bookings/waitlist
// @access  Private
exports.addToWaitlist = async (req, res) => {
  try {
    const { courtId, date, startTime, endTime } = req.body;

    // Check if already in waitlist
    const existingEntry = await Waitlist.findOne({
      user: req.user.id,
      court: courtId,
      date,
      startTime,
      endTime,
      status: 'waiting'
    });

    if (existingEntry) {
      return res.status(400).json({ success: false, message: 'Already in waitlist for this slot' });
    }

    const waitlistEntry = await Waitlist.create({
      user: req.user.id,
      court: courtId,
      date,
      startTime,
      endTime
    });

    res.status(201).json({
      success: true,
      data: waitlistEntry,
      message: 'Added to waitlist successfully'
    });
  } catch (error) {
    console.error('Add to waitlist error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get booking statistics (Admin)
// @route   GET /api/bookings/stats/overview
// @access  Private/Admin
exports.getBookingStats = async (req, res) => {
  try {
    // Total bookings
    const totalBookings = await Booking.countDocuments({ status: { $ne: 'cancelled' } });
    
    // Today's bookings
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayBookings = await Booking.countDocuments({
      date: { $gte: today },
      status: { $ne: 'cancelled' }
    });

    // Total revenue
    const revenueStats = await Booking.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$pricingBreakdown.totalPrice' }
        }
      }
    ]);

    // Court occupancy
    const courtOccupancy = await Booking.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: '$court', count: { $sum: 1 } } },
      { 
        $lookup: { 
          from: 'courts', 
          localField: '_id', 
          foreignField: '_id', 
          as: 'court' 
        } 
      },
      { $unwind: '$court' },
      { 
        $project: { 
          courtName: '$court.name', 
          bookings: '$count' 
        } 
      },
      { $sort: { bookings: -1 } }
    ]);

    // Active users (users who made bookings)
    const activeUsers = await Booking.distinct('user', { status: { $ne: 'cancelled' } });

    res.json({
      success: true,
      data: {
        totalBookings,
        todayBookings,
        totalRevenue: revenueStats.length > 0 ? revenueStats[0].totalRevenue : 0,
        activeUsers: activeUsers.length,
        courtOccupancy
      }
    });
  } catch (error) {
    console.error('Get booking stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch statistics',
      error: error.message 
    });
  }
};

// @desc    Update booking status (Admin)
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['confirmed', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    booking.status = status;
    await booking.save();

    const populatedBooking = await Booking.findById(booking._id)
      .populate('user', 'name email phone')
      .populate('court', 'name type')
      .populate('coach', 'name specialization')
      .populate('equipment.item', 'name type');

    res.json({
      success: true,
      data: populatedBooking,
      message: 'Booking status updated successfully'
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete booking (Admin)
// @route   DELETE /api/bookings/:id
// @access  Private/Admin
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    await booking.deleteOne();

    res.json({
      success: true,
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    console.error('Delete booking error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
