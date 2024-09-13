const jwt = require('jsonwebtoken');
const db = require('../config/db');

const authorize = (roles = []) => {
    if (typeof roles === 'string') roles = [roles];

    return (req, res, next) => {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) return res.status(403).json({ message: 'No token provided' });

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Failed to authenticate token' });

            db.query('SELECT role_id FROM users WHERE id = ?', [decoded.id], (err, results) => {
                if (err || results.length === 0) return res.status(403).json({ message: 'Unauthorized' });

                const userRole = results[0].role_id;

                if (roles.length && !roles.includes(userRole.toString())) {
                    return res.status(403).json({ message: 'Forbidden' });
                }

                next();
            });
        });
    };
};

module.exports = authorize;