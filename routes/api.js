const express = require('express');
const router = express.Router();

const Trip = require('../models/Trip');
const Attraction = require('../models/Attraction');
const mongoose = require('mongoose');

// Модели за дополнителните колекции (со заштита ако веќе постојат)
const Review = mongoose.models.Review || mongoose.model('Review', new mongoose.Schema({}, { strict: false }));
const Expense = mongoose.models.Expense || mongoose.model('Expense', new mongoose.Schema({}, { strict: false }));
const DestinationInfo = mongoose.models.DestinationInfo || mongoose.model('DestinationInfo', new mongoose.Schema({}, { strict: false }));

// ==========================================
// 1. TRIPS RUTI
// ==========================================

/**
 * @swagger
 * /api/trips:
 *   get:
 *     summary: Земање на сите патувања
 *     tags: [Trips]
 *     responses:
 *       200:
 *         description: Листа на патувања
 */
router.get('/trips', async (req, res) => {
    try {
        const trips = await Trip.find();
        res.json(trips);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /api/trips:
 *   post:
 *     summary: Додај ново патување
 *     tags: [Trips]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string, example: "Викенд во Рим" }
 *               destination: { type: string, example: "Рим" }
 *               budget: { type: number, example: 500 }
 *     responses:
 *       201:
 *         description: Успешно креирано патување
 */
router.post('/trips', async (req, res) => {
    try {
        const newTrip = new Trip(req.body);
        const savedTrip = await newTrip.save();
        res.status(201).json(savedTrip);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// ==========================================
// 2. ATTRACTIONS RUTI
// ==========================================

/**
 * @swagger
 * /api/attractions:
 *   get:
 *     summary: Земање на сите атракции
 *     tags: [Attractions]
 *     responses:
 *       200:
 *         description: Листа на атракции
 */
router.get('/attractions', async (req, res) => {
    try {
        const attractions = await Attraction.find();
        res.json(attractions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /api/attractions:
 *   post:
 *     summary: Додај нова атракција
 *     tags: [Attractions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string, example: "Колосеум" }
 *               city: { type: string, example: "Рим" }
 *               category: { type: string, example: "Историја" }
 *               price: { type: number, example: 18 }
 *     responses:
 *       201:
 *         description: Успешно креирана атракција
 */
router.post('/attractions', async (req, res) => {
    try {
        const attraction = new Attraction(req.body);
        const saved = await attraction.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// ==========================================
// 3. REVIEWS RUTI
// ==========================================

/**
 * @swagger
 * /api/reviews:
 *   get:
 *     summary: Земање на сите рецензии
 *     tags: [Reviews]
 *     responses:
 *       200:
 *         description: Листа на сите рецензии
 */
router.get('/reviews', async (req, res) => {
    try {
        const reviews = await Review.find();
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Додај нова рецензија
 *     tags: [Reviews]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               attractionName: { type: string, example: "Колосеум" }
 *               rating: { type: number, example: 5 }
 *               comment: { type: string, example: "Прекрасно место!" }
 *               author: { type: string, example: "maja_p" }
 *     responses:
 *       201:
 *         description: Рецензијата е успешно додадена
 */
router.post('/reviews', async (req, res) => {
    try {
        const review = new Review(req.body);
        const saved = await review.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// ==========================================
// 4. EXPENSES RUTI
// ==========================================

/**
 * @swagger
 * /api/expenses:
 *   get:
 *     summary: Земање на сите трошоци
 *     tags: [Expenses]
 *     responses:
 *       200:
 *         description: Листа на сите трошоци
 */
router.get('/expenses', async (req, res) => {
    try {
        const expenses = await Expense.find();
        res.json(expenses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /api/expenses:
 *   post:
 *     summary: Додај нов трошок
 *     tags: [Expenses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category: { type: string, example: "Сместување" }
 *               amount: { type: number, example: 120 }
 *               currency: { type: string, example: "EUR" }
 *               description: { type: string, example: "Хотел во Охрид" }
 *     responses:
 *       201:
 *         description: Трошокот е успешно додаден
 */
router.post('/expenses', async (req, res) => {
    try {
        const expense = new Expense(req.body);
        const saved = await expense.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// ==========================================
// 5. DESTINATION INFOS RUTI
// ==========================================

/**
 * @swagger
 * /api/destinationinfos:
 *   get:
 *     summary: Земање на информации за дестинации
 *     tags: [DestinationInfos]
 *     responses:
 *       200:
 *         description: Листа на информации за дестинации
 */
router.get('/destinationinfos', async (req, res) => {
    try {
        const infos = await DestinationInfo.find();
        res.json(infos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /api/destinationinfos:
 *   post:
 *     summary: Додај информација за дестинација
 *     tags: [DestinationInfos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               city: { type: string, example: "Охрид" }
 *               country: { type: string, example: "Македонија" }
 *               info: { type: string, example: "Познат по Охридското Езеро" }
 *     responses:
 *       201:
 *         description: Информацијата е успешно додадена
 */
router.post('/destinationinfos', async (req, res) => {
    try {
        const info = new DestinationInfo(req.body);
        const saved = await info.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;