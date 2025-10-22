const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  // --- Product Details ---
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
  },
  
  // --- Vendor Relationship ---
  vendor: {
    type: mongoose.Schema.Types.ObjectId, // Connects to the User model
    ref: 'User',
    required: true,
  },
  
  // --- Image Handling ---
  imageUrl: {
    type: String, // URL of the product image (stored on Cloudinary/S3)
    required: true,
  },

  // --- Timestamps ---
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Product', ProductSchema);