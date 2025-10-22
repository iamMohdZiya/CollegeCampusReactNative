// controllers/authController.js

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// Assume this is configured correctly
const { JWT_SECRET } = require('../config/keys'); 

// Helper function to generate a JWT token
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, JWT_SECRET, {
        expiresIn: '7d', // Token expires in 7 days
    });
};


/**
 * @desc    Register a new user (Student, Vendor, or Admin)
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.registerUser = async (req, res) => {
    // role defaults to 'student' if not provided
    const { name, email, password, role = 'student' } = req.body; 

    // 1. Basic Validation
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please enter all required fields.' });
    }
    
    // Check if role is valid
    if (!['student', 'vendor', 'admin'].includes(role)) {
        return res.status(400).json({ message: 'Invalid user role specified.' });
    }

    try {
        // 2. Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User with this email already exists.' });
        }
        
        // 3. Handle Vendor/Admin Approval Logic
        // Vendors and Admins are set to unapproved (false) initially, awaiting Admin's explicit approval.
        const isApproved = (role === 'vendor' || role === 'admin') ? false : true; 

        // 4. Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 5. Create User
        user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            isApproved: isApproved,
        });

        // 6. Generate Token and Respond
        const token = generateToken(user._id, user.role);

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isApproved: user.isApproved,
            token, // Mobile app stores this securely
            message: role === 'vendor' ? 'Vendor registered successfully. Awaiting Admin approval.' : 'Registration successful.',
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during registration.' });
    }
};


/**
 * @desc    Authenticate user and get token
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // 2. Check Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // 3. Vendor/Admin Approval Check (if role is vendor or admin and not approved, deny login)
        if ((user.role === 'vendor' || user.role === 'admin') && !user.isApproved) {
            return res.status(403).json({ message: `${user.role} account is pending admin approval.` });
        }
        
        // 4. Generate Token and Respond
        const token = generateToken(user._id, user.role);

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token, // Mobile app stores this securely
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during login.' });
    }
};