const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  getAllCourts,
  getCourt,
  createCourt,
  updateCourt,
  deleteCourt
} = require('../controllers/courtController');

// Public routes
router.get('/', getAllCourts);
router.get('/:id', getCourt);

// Admin routes
router.use(protect, admin);
router.post('/', createCourt);
router.put('/:id', updateCourt);
router.delete('/:id', deleteCourt);

module.exports = router;
