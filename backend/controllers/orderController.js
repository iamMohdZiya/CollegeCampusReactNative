// controllers/orderController.js (UPDATED - Commission Logic Removed)

const Order = require('../models/Order');
const Product = require('../models/Product');
// Commission model is no longer imported or used

/**
 * @desc    Create a new order (Checkout Flow)
 * @route   POST /api/orders
 * @access  Private/Student
 */
exports.createOrder = async (req, res) => {
    const studentId = req.user._id;
    const { items, paymentMethod } = req.body;
    
    try {
        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty.' });
        }
        
        let totalAmount = 0;
        let processedItems = [];
        let vendorId = null; 

        for (const item of items) {
            const product = await Product.findById(item.product);

            if (!product || product.stock < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
            }
            
            if (vendorId === null) {
                vendorId = product.vendor;
            } else if (vendorId.toString() !== product.vendor.toString()) {
                return res.status(400).json({ message: 'Items from multiple vendors require separate orders.' });
            }

            processedItems.push({
                product: product._id,
                quantity: item.quantity,
                priceAtPurchase: product.price,
            });
            totalAmount += product.price * item.quantity;
        }
        
        // 1. Create Order/Invoice
        const newOrder = new Order({
            student: studentId,
            vendor: vendorId,
            items: processedItems,
            totalAmount: totalAmount,
            paymentMethod: paymentMethod || 'UPI_QR',
            status: 'pending',
        });
        
        const order = await newOrder.save();
        
        // 2. Removed: Commission Entry Creation
        
        res.status(201).json({ 
            order, 
            message: 'Order created. Complete payment using the vendor\'s QR code.',
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error processing order.' });
    }
};

/**
 * @desc    Get order history for a Student or Orders list for a Vendor (Logic remains same)
 * @route   GET /api/orders/history
 * @access  Private/Student or Vendor
 */
exports.getOrderHistory = async (req, res) => {
    const { _id, role } = req.user;

    try {
        let orders;
        let query = {};
        
        if (role === 'student') {
            query.student = _id;
        } else if (role === 'vendor') {
            query.vendor = _id;
        } else {
            return res.status(403).json({ message: 'Admins use /admin/invoices route.' });
        }

        orders = await Order.find(query)
            .populate('items.product', 'name imageUrl')
            .populate('vendor', 'shopName')
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching order history.' });
    }
};


/**
 * @desc    Confirm payment for an order (Logic remains same)
 * @route   PUT /api/orders/:id/confirm
 * @access  Private/Vendor
 */
exports.confirmPayment = async (req, res) => {
    const orderId = req.params.id;
    const vendorId = req.user._id;

    try {
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Order not found.' });
        }
        
        if (order.vendor.toString() !== vendorId.toString()) {
            return res.status(403).json({ message: 'Not authorized to confirm this order.' });
        }
        if (order.status !== 'pending') {
            return res.status(400).json({ message: `Order status is already ${order.status}.` });
        }

        order.status = 'confirmed';
        order.paymentConfirmedAt = Date.now();
        await order.save();
        
        res.json({ message: 'Payment confirmed and order status updated.', order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error confirming payment.' });
    }
};