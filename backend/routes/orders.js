// routes/orders.js

const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, role } = require('../middleware/authMiddleware');

// @route   POST /api/orders
// @desc    Create a new order (Checkout)
// @access  Private/Student
router.post('/', protect, role(['student']), orderController.createOrder);

// @route   GET /api/orders/history
// @desc    Get order history (Student) or Orders list (Vendor)
// @access  Private/Student, Vendor
router.get('/history', protect, role(['student', 'vendor']), orderController.getOrderHistory);

// @route   PUT /api/orders/:id/confirm
// @desc    Confirm payment for an order (Vendor Flow)
// @access  Private/Vendor
router.put('/:id/confirm', protect, role(['vendor']), orderController.confirmPayment);

module.exports = router;