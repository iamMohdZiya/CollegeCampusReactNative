// controllers/productController.js

const Product = require('../models/Product');
// Assume Cloudinary upload utility is implemented (or a similar service)
const { uploadImage } = require('../utils/cloudinaryUploader'); 

/**
 * @desc    Get all products (for Student/Public browsing)
 * @route   GET /api/products
 * @access  Public (or simple token access for all roles)
 */
exports.getProducts = async (req, res) => {
    try {
        // Simple list, add filtering/searching later
        const products = await Product.find({})
            .populate('vendor', 'shopName qrCodeUrl'); // Show vendor details

        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching products.' });
    }
};

/**
 * @desc    Add a new product (Vendor Flow)
 * @route   POST /api/products
 * @access  Private/Vendor
 */
exports.addProduct = async (req, res) => {
    const { name, description, price, category, stock, imageUrl } = req.body;
    const vendorId = req.user._id; // Set by authMiddleware

    try {
        // NOTE: In a real app, you'd handle image upload (multer + Cloudinary)
        // and replace the 'imageUrl' from req.body with the actual uploaded URL.
        // Placeholder for image upload:
        // const uploadedImageUrl = await uploadImage(req.file.buffer);

        const newProduct = new Product({
            vendor: vendorId,
            name,
            description,
            price,
            category,
            stock,
            imageUrl: imageUrl || 'default-image-url', // Use actual uploaded URL
        });

        const createdProduct = await newProduct.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding product.' });
    }
};

/**
 * @desc    Update an existing product (Vendor Flow)
 * @route   PUT /api/products/:id
 * @access  Private/Vendor
 */
exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const vendorId = req.user._id;

    try {
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        // Check ownership: ensure vendor only edits their own product
        if (product.vendor.toString() !== vendorId.toString()) {
            return res.status(403).json({ message: 'Not authorized to edit this product.' });
        }

        // Apply updates
        Object.assign(product, req.body);
        const updatedProduct = await product.save();

        res.json(updatedProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating product.' });
    }
};

/**
 * @desc    Delete a product (Vendor Flow)
 * @route   DELETE /api/products/:id
 * @access  Private/Vendor
 */
exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    const vendorId = req.user._id;

    try {
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        // Check ownership
        if (product.vendor.toString() !== vendorId.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this product.' });
        }

        await product.deleteOne(); // Use deleteOne or remove based on Mongoose version
        res.json({ message: 'Product removed successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting product.' });
    }
};