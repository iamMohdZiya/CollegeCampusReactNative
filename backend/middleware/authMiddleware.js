// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = require('../config/keys');

// Protects routes by verifying the JWT and fetching the user
exports.protect = async (req, res, next) => {
    let token;

    // 1. Check for token in headers (Bearer Token format)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header (Format: "Bearer TOKEN")
            token = req.headers.authorization.split(' ')[1];

            // 2. Verify token
            const decoded = jwt.verify(token, JWT_SECRET);

            // 3. Attach user data (ID and role) to the request
            // We only select the ID and role for light request objects
            const user = await User.findById(decoded.id).select('_id role isApproved'); 

            if (!user) {
                return res.status(401).json({ message: 'Not authorized, user not found.' });
            }
            
            // Check if vendor/admin is approved before proceeding
            if ((user.role === 'vendor' || user.role === 'admin') && !user.isApproved) {
                 return res.status(403).json({ message: `${user.role} account is pending admin approval.` });
            }


            req.user = user;
            next();

        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: 'Not authorized, token failed or expired.' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token.' });
    }
};

// Authorizes access based on user role
exports.role = (roles) => {
    return (req, res, next) => {
        // req.user is set by the protect middleware
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: `Access denied. Requires one of the following roles: ${roles.join(', ')}` });
        }
        next();
    };
};