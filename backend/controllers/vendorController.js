// controllers/vendorController.js

const Order = require('../models/Order');
const User = require('../models/User');

/**
 * @desc    Update Vendor Profile (e.g., add shopName, QR code)
 * @route   PUT /api/vendors/profile
 * @access  Private/Vendor
 */
exports.updateVendorProfile = async (req, res) => {
    const vendorId = req.user._id;
    const { shopName, upiId, qrCodeUrl } = req.body;

    try {
        const vendor = await User.findById(vendorId);

        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found.' });
        }
        
        // Update fields
        vendor.shopName = shopName || vendor.shopName;
        vendor.upiId = upiId || vendor.upiId;
        vendor.qrCodeUrl = qrCodeUrl || vendor.qrCodeUrl; 

        await vendor.save();
        res.json({ message: 'Vendor profile updated.', vendor });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating vendor profile.' });
    }
};

/**
 * @desc    Get Sales Summary for the Vendor
 * @route   GET /api/vendors/sales-summary
 * @access  Private/Vendor
 */
exports.getSalesSummary = async (req, res) => {
    const vendorId = req.user._id;

    try {
        // Aggregate total sales and total orders
        const salesStats = await Order.aggregate([
            { $match: { vendor: vendorId, status: 'confirmed' } },
            { 
                $group: {
                    _id: null,
                    totalSales: { $sum: '$totalAmount' },
                    totalOrders: { $sum: 1 },
                }
            }
        ]);
        
        // Get product-specific sales
        const productSales = await Order.aggregate([
            { $match: { vendor: vendorId, status: 'confirmed' } },
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.product',
                    totalQuantitySold: { $sum: '$items.quantity' },
                    totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.priceAtPurchase'] } }
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'productDetails'
                }
            },
            { $unwind: '$productDetails' },
            { $project: { _id: 1, totalQuantitySold: 1, totalRevenue: 1, productName: '$productDetails.name' } }
        ]);


        res.json({
            summary: salesStats[0] || { totalSales: 0, totalOrders: 0 },
            productSales: productSales,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching sales summary.' });
    }
};