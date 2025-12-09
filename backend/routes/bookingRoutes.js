const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  createBooking,
  getMyBookings,
  getAllBookings,
  getBooking,
  cancelBooking,
  checkSlotAvailability,
  getAvailableSlots,
  addToWaitlist,
  getBookingStats
} = require('../controllers/bookingController');

// Public routes
router.post('/check-availability', checkSlotAvailability);
router.get('/available-slots/:courtId/:date', getAvailableSlots);

// Protected routes
router.use(protect);
router.post('/', createBooking);
router.get('/my-bookings', getMyBookings);
router.get('/:id', getBooking);
router.put('/:id/cancel', cancelBooking);
router.post('/waitlist', addToWaitlist);

// Admin routes
router.get('/', admin, getAllBookings);
router.get('/stats/overview', admin, getBookingStats);

module.exports = router;
