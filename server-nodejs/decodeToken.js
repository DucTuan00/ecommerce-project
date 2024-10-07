const jwt = require('jsonwebtoken');

const decodeToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) return reject('Token không hợp lệ');
            resolve(decoded);
        });
    });
};

module.exports = decodeToken;
