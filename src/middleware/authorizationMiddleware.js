const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'tajny_klucz';

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Brak tokenu' });

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Nieprawidłowy token' });
    }
};

const authorize = (roles = []) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Brak uprawnień' });
        }
        next();
    };
};

module.exports = { authenticate, authorize };
