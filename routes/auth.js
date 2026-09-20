const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'travelpulse_jwt_secret_key_2026';

// 1. Регистрација на нов корисник
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ error: 'Корисничкото име или е-поштата веќе постојат.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            username,
            email,
            password: hashedPassword,
            role: role || 'viewer'
        });

        await user.save();
        res.status(201).json({ message: 'Регистрацијата е успешна! Сега може да се најавите.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Најава (Login) и генерирање на JWT Токен
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Невалидна е-пошта или лозинка.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Невалидна е-пошта или лозинка.' });
        }

        // Генерирање JWT токен
        const token = jwt.sign(
            { id: user._id, username: user.username, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: { id: user._id, username: user.username, role: user.role, email: user.email }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;