const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'travelpulse_jwt_secret_key_2026';

// Нагодување на nodemailer
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'test.user@ethereal.email',
        pass: 'testpass'
    }
});

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Регистрација на нов корисник
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: majap
 *               name:
 *                 type: string
 *                 example: Маја Петровска
 *               email:
 *                 type: string
 *                 example: maja@example.com
 *               password:
 *                 type: string
 *                 example: lozinka123
 *     responses:
 *       201:
 *         description: Успешна регистрација
 *       400:
 *         description: Грешка во внесените податоци
 */
router.post('/register', async (req, res) => {
    try {
        const { email, password, role } = req.body;
        const username = req.body.username || req.body.name;

        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Сите полиња се задолжителни.' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Лозинката мора да содржи најмалку 6 карактери.' });
        }

        // Проверка дали корисничкото име или е-поштата веќе постојат
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ error: 'Корисничкото име или е-поштата веќе постојат.' });
        }

        // Хеширање на лозинката
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role: role || 'viewer'
        });

        await newUser.save();

        // Испраќање е-пошта во позадина (не-блокирачко)
        try {
            transporter.sendMail({
                from: '"Travel Planner" <no-reply@travelplanner.com>',
                to: email,
                subject: 'Успешна регистрација!',
                text: `Здраво ${username}, добродојдовте на Travel Planner!`
            });
        } catch (mailErr) {
            console.log('Грешка при праќање е-пошта (занемарено):', mailErr.message);
        }

        // Генерирање JWT токен
        const token = jwt.sign(
            { id: newUser._id, username: newUser.username, role: newUser.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'Регистрацијата е успешна!',
            token,
            user: { id: newUser._id, username: newUser.username, email: newUser.email, role: newUser.role }
        });
    } catch (err) {
        console.error('Грешка при регистрација:', err);
        res.status(500).json({ error: err.message || 'Серверска грешка при регистрација.' });
    }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Најава на постоечки корисник
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: maja@example.com
 *               password:
 *                 type: string
 *                 example: lozinka123
 *     responses:
 *       200:
 *         description: Успешна најава и добивање JWT токен
 *       400:
 *         description: Невалидна е-пошта или лозинка
 */
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Внесете е-пошта и лозинка.' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Невалидна е-пошта или лозинка.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Невалидна е-пошта или лозинка.' });
        }

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