const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  getAllRules,
  getRule,
  createRule,
  updateRule,
  deleteRule,
  calculateBookingPrice
} = require('../controllers/pricingRuleController');

// Public routes
router.get('/', getAllRules);
router.get('/:id', getRule);
router.post('/calculate', calculateBookingPrice);

// Admin routes
router.use(protect, admin);
router.post('/', createRule);
router.put('/:id', updateRule);
router.delete('/:id', deleteRule);

module.exports = router;
