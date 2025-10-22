// routes/vendors.js

const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');
const { protect, role } = require('../middleware/authMiddleware');

// All routes here are restricted to the 'vendor' role
router.use(protect, role(['vendor']));

// @route   PUT /api/vendors/profile
// @desc    Update shop details, QR code, etc.
// @access  Private/Vendor
router.put('/profile', vendorController.updateVendorProfile);

// @route   GET /api/vendors/sales-summary
// @desc    View sales summary and product-wise reports
// @access  Private/Vendor
router.get('/sales-summary', vendorController.getSalesSummary);

module.exports = router;