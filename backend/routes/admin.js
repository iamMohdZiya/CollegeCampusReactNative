// routes/admin.js (UPDATED - Commission Routes Removed)

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, role } = require('../middleware/authMiddleware');

// All routes here are restricted to the 'admin' role
router.use(protect, role(['admin']));

// @route   GET /api/admin/dashboard-stats
// @desc    Get summary stats for Admin dashboard
// @access  Private/Admin
router.get('/dashboard-stats', adminController.getDashboardStats);

// @route   GET /api/admin/vendors
// @desc    View all vendors 
// @access  Private/Admin
router.get('/vendors', adminController.getVendors);

// @route   PUT /api/admin/vendors/:id/approve
// @desc    Approve/Reject vendor (Manage Vendors)
// @access  Private/Admin
router.put('/vendors/:id/approve', adminController.manageVendorApproval);

// @route   GET /api/admin/invoices
// @desc    View all invoices/orders
// @access  Private/Admin
router.get('/invoices', adminController.getInvoices);

// Removed: /api/admin/commissions and /api/admin/commissions/:id/payout routes

module.exports = router;