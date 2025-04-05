const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
require('dotenv').config();

const SECRET_KEY = process.env.JWT_SECRET || 'tajny_klucz';


const generateToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            role: user.role,
            username: user.username
        },
        SECRET_KEY,
        { expiresIn: '1h' }
    );
};

const register = async (req, res) => {
    const { username, email, password, first_name, last_name } = req.body;

    try {
        const existingUser = await User.findByEmail(email);
        if (existingUser) return res.status(400).json({ error: "Email już istnieje." });

        const newUser = await User.create(username, email, password, first_name, last_name);
        const token = generateToken(newUser);

        res.status(201).json({ user: newUser, token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findByEmail(email);
        if (!user) return res.status(404).json({ error: "Nie znaleziono użytkownika." });

        const match = await User.comparePassword(password, user.password_hash);
        if (!match) return res.status(401).json({ error: "Nieprawidłowe hasło." });

        const token = generateToken(user);
        res.status(200).json({ user, token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { register, login };
