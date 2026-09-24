const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'travelpulse_jwt_secret_key_2026';

// Нагодување на nodemailer (за тест цели со Ethereal / SMTP)
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'test.user@ethereal.email',
        pass: 'testpass'
    }
});

// 1. Регистрација на нов корисник
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // Проверка дали корисничкото име или е-поштата веќе постојат
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ error: 'Корисничкото име или е-поштата веќе постојат.' });
        }

        // Хеширање на лозинката со bcryptjs
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role: role || 'viewer'
        });

        await newUser.save();

        // Испраќање потврдна е-пошта преку nodemailer
        const mailOptions = {
            from: '"Travel Planner" <no-reply@travelplanner.com>',
            to: email,
            subject: 'Успешна регистрација!',
            text: `Здраво ${username}, добродојдовте на Travel Planner!`
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) console.log('Грешка при праќање е-пошта:', err);
        });

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