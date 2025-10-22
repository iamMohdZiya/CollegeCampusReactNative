const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  // --- General User Fields ---
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    // Add validation for college email domain in the controller/utility layer
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['student', 'vendor', 'admin'], // Role-based security is critical
    default: 'student',
  },
  
  // --- Vendor-Specific Fields ---
  shopName: {
    type: String,
    trim: true,
    // Required if role is 'vendor'
  },
  upiId: {
    type: String,
    trim: true,
  },
  qrCodeUrl: {
    type: String, // URL to the Vendor's payment QR code (stored on Cloudinary/S3)
    trim: true,
  },
  isApproved: {
    type: Boolean, // Vendor must be approved by Admin
    default: false,
  },
  
  // --- Timestamps ---
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', UserSchema);