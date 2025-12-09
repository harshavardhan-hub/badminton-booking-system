const Booking = require('../models/Booking');
const Equipment = require('../models/Equipment');

/**
 * Check if resources are available for the requested time slot
 */
const checkAvailability = async (courtId, coachId, equipmentList, date, startTime, endTime, excludeBookingId = null) => {
  try {
    // Build query for overlapping bookings
    const query = {
      date: new Date(date),
      status: { $ne: 'cancelled' },
      $or: [
        // Case 1: New booking starts within existing booking
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
        // Case 2: New booking completely overlaps existing booking
        { startTime: { $gte: startTime }, endTime: { $lte: endTime } }
      ]
    };

    if (excludeBookingId) {
      query._id = { $ne: excludeBookingId };
    }

    // Check court availability
    const courtConflict = await Booking.findOne({ ...query, court: courtId });
    if (courtConflict) {
      return {
        available: false,
        reason: 'Court is already booked for this time slot',
        conflictType: 'court'
      };
    }

    // Check coach availability if coach is selected
    if (coachId) {
      const coachConflict = await Booking.findOne({ ...query, coach: coachId });
      if (coachConflict) {
        return {
          available: false,
          reason: 'Coach is not available for this time slot',
          conflictType: 'coach'
        };
      }
    }

    // Check equipment availability
    if (equipmentList && equipmentList.length > 0) {
      for (const item of equipmentList) {
        const equipment = await Equipment.findById(item.item);
        if (!equipment) {
          return {
            available: false,
            reason: `Equipment not found`,
            conflictType: 'equipment'
          };
        }

        // Count how many of this equipment are already booked for this time
        const bookedCount = await Booking.aggregate([
          {
            $match: {
              ...query,
              'equipment.item': item.item
            }
          },
          {
            $unwind: '$equipment'
          },
          {
            $match: {
              'equipment.item': item.item
            }
          },
          {
            $group: {
              _id: null,
              totalBooked: { $sum: '$equipment.quantity' }
            }
          }
        ]);

        const currentlyBooked = bookedCount.length > 0 ? bookedCount[0].totalBooked : 0;
        const availableQuantity = equipment.totalQuantity - currentlyBooked;

        if (availableQuantity < item.quantity) {
          return {
            available: false,
            reason: `Only ${availableQuantity} ${equipment.name} available, ${item.quantity} requested`,
            conflictType: 'equipment'
          };
        }
      }
    }

    return {
      available: true,
      reason: 'All resources are available'
    };
  } catch (error) {
    console.error('Availability check error:', error);
    return {
      available: false,
      reason: 'Error checking availability',
      error: error.message
    };
  }
};

module.exports = { checkAvailability };
