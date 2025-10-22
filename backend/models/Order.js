const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  // --- Customer/Student Details ---
  student: {
    type: mongoose.Schema.Types.ObjectId, // Customer placing the order
    ref: 'User',
    required: true,
  },
  
  // --- Vendor Details ---
  vendor: {
    type: mongoose.Schema.Types.ObjectId, // Vendor fulfilling the order
    ref: 'User',
    required: true,
  },

  // --- Items Purchased ---
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    priceAtPurchase: {
      type: Number, // Capture price at the time of order
      required: true,
    },
  }],

  // --- Financial Details ---
  totalAmount: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ['UPI_QR', 'WALLET'], // Reflects the system's payment options
    default: 'UPI_QR',
  },

  // --- Status & Tracking ---
  status: {
    type: String,
    enum: ['pending', 'paid', 'confirmed', 'cancelled'], // Order lifecycle
    default: 'pending',
  },
  paymentConfirmedAt: {
    type: Date, // Timestamp when vendor confirms the payment
  },
  
  // --- Timestamps ---
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Order', OrderSchema);