// routes/products.js

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect, role } = require('../middleware/authMiddleware');

// @route   GET /api/products
// @desc    Get all products (Student Browse Flow)
// @access  Public (or All Logged-in Roles)
router.get('/', protect, productController.getProducts);

// @route   POST /api/products
// @desc    Add new product (Vendor Flow)
// @access  Private/Vendor
router.post('/', protect, role(['vendor']), productController.addProduct);

// @route   PUT /api/products/:id
// @desc    Update product (Vendor Flow)
// @access  Private/Vendor
router.put('/:id', protect, role(['vendor']), productController.updateProduct);

// @route   DELETE /api/products/:id
// @desc    Delete product (Vendor Flow)
// @access  Private/Vendor
router.delete('/:id', protect, role(['vendor']), productController.deleteProduct);

module.exports = router;