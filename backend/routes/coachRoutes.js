const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  getAllCoaches,
  getCoach,
  createCoach,
  updateCoach,
  deleteCoach
} = require('../controllers/coachController');

// Public routes
router.get('/', getAllCoaches);
router.get('/:id', getCoach);

// Admin routes
router.use(protect, admin);
router.post('/', createCoach);
router.put('/:id', updateCoach);
router.delete('/:id', deleteCoach);

module.exports = router;
