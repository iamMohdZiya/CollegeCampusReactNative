// controllers/adminController.js (UPDATED - Commission Logic Removed)

const User = require('../models/User');
const Order = require('../models/Order');
// Commission is no longer imported

/**
 * @desc    Get list of all vendors (pending and approved) (Logic remains same)
 * @route   GET /api/admin/vendors
 * @access  Private/Admin
 */
exports.getVendors = async (req, res) => {
    try {
        const vendors = await User.find({ role: 'vendor' }).select('-password');
        res.json(vendors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching vendors.' });
    }
};

/**
 * @desc    Approve or Reject a vendor account (Logic remains same)
 * @route   PUT /api/admin/vendors/:id/approve
 * @access  Private/Admin
 */
exports.manageVendorApproval = async (req, res) => {
    const vendorId = req.params.id;
    const { status } = req.body; 

    try {
        const vendor = await User.findById(vendorId);

        if (!vendor || vendor.role !== 'vendor') {
            return res.status(404).json({ message: 'Vendor not found.' });
        }

        if (status === 'approve') {
            vendor.isApproved = true;
            await vendor.save();
            res.json({ message: 'Vendor approved successfully.', vendor });
        } else if (status === 'reject') {
            vendor.isApproved = false;
            await vendor.save();
            res.json({ message: 'Vendor rejected/unapproved.', vendor });
        } else {
            return res.status(400).json({ message: 'Invalid status provided.' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error managing vendor approval.' });
    }
};

/**
 * @desc    View all invoices/orders (Logic remains same)
 * @route   GET /api/admin/invoices
 * @access  Private/Admin
 */
exports.getInvoices = async (req, res) => {
    try {
        const invoices = await Order.find({})
            .populate('student', 'name email')
            .populate('vendor', 'shopName email')
            .sort({ createdAt: -1 });
            
        res.json(invoices);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching invoices.' });
    }
};

/**
 * @desc    Admin Dashboard Stats Summary (NEW: Removed commission fields)
 * @route   GET /api/admin/dashboard-stats
 * @access  Private/Admin
 */
exports.getDashboardStats = async (req, res) => {
    try {
        const totalVendors = await User.countDocuments({ role: 'vendor', isApproved: true });
        const totalStudents = await User.countDocuments({ role: 'student' });
        
        const salesStats = await Order.aggregate([
            { $match: { status: 'confirmed' } },
            { 
                $group: {
                    _id: null,
                    totalSales: { $sum: '$totalAmount' },
                    totalOrders: { $sum: 1 },
                }
            }
        ]);
        
        const latestInvoices = await Order.find({})
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('vendor', 'shopName');

        res.json({
            totalVendors,
            totalStudents,
            totalSales: salesStats[0]?.totalSales || 0,
            totalOrders: salesStats[0]?.totalOrders || 0,
            latestInvoices,
            // Removed: Pending commissions stat
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching dashboard stats.' });
    }
};