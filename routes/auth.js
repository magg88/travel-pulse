const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_jwt_key_here';

// ==========================================
// 1. РЕГИСТРАЦИЈА НА КОРИСНИК
// ==========================================
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
 *             properties:
 *               username: { type: string, example: "petar123" }
 *               email: { type: string, example: "petar@example.com" }
 *               password: { type: string, example: "tajna123" }
 *               role: { type: string, example: "viewer" }
 *     responses:
 *       201:
 *         description: Успешно регистриран корисник
 */
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // 1. Проверка дали корисникот или email-от веќе постојат
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ error: 'Корисничкото име или email веќе се заземени.' });
        }

        // 2. Хеширање на лозинката
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Креирање на новиот корисник (со default улога 'viewer' доколку не е пратена)
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role: role || 'viewer'
        });

        const savedUser = await newUser.save();

        // 4. Генерирање на JWT токен
        const token = jwt.sign(
            { id: savedUser._id, role: savedUser.role },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(201).json({
            message: 'Успешна регистрација!',
            token,
            user: {
                id: savedUser._id,
                username: savedUser.username,
                email: savedUser.email,
                role: savedUser.role
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// 2. НАЈАВА НА КОРИСНИК (LOGIN)
// ==========================================
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Најава на корисник
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username: { type: string, example: "petar123" }
 *               password: { type: string, example: "tajna123" }
 *     responses:
 *       200:
 *         description: Успешна најава со вратен JWT токен и податоци за корисникот
 */
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // 1. Проверка дали постои корисникот
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ error: 'Непостоечко корисничко име или погрешна лозинка.' });
        }

        // 2. Споредба на лозинката
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Непостоечко корисничко име или погрешна лозинка.' });
        }

        // 3. Генерирање на JWT токен
        const token = jwt.sign(
            { id: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        // 4. Враќање на токенот и податоците за корисникот (без лозинката)
        res.json({
            message: 'Успешна најава!',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// 3. ЗЕМАЊЕ НА АКТУЕЛЕН КОРИСНИК (ME)
// ==========================================
/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Земање на информации за моментално најавениот корисник
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Податоци за корисникот
 */
router.get('/me', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Нема доставено токен за автентикација.' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        
        if (!user) {
            return res.status(404).json({ error: 'Корисникот не е пронајден.' });
        }

        res.json(user);
    } catch (err) {
        res.status(401).json({ error: 'Невалиден или истечен токен.' });
    }
});

module.exports = router;