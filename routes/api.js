const express = require('express');
const router = express.Router();

const User = require('../models/User');
const Trip = require('../models/Trip');
const ItineraryItem = require('../models/ItineraryItem');
const Attraction = require('../models/Attraction');
const DestinationInfo = require('../models/DestinationInfo');

/**
 * @swagger
 * /api/db/seed:
 *   get:
 *     summary: Ресетирање и полнење на базата со тест податоци
 *     tags: [Database]
 *     responses:
 *       200:
 *         description: Базата е успешно ресетирана и наполнета
 */
router.get('/db/seed', async (req, res) => {
    try {
        await User.deleteMany({});
        await Trip.deleteMany({});
        await ItineraryItem.deleteMany({});
        await Attraction.deleteMany({});
        await DestinationInfo.deleteMany({});

        const user = await User.create({
            username: 'admin',
            email: 'admin@travelpulse.mk',
            password: 'password123',
            role: 'admin'
        });

        const trip = await Trip.create({
            title: 'Патување во Рим',
            destination: 'Рим, Италија',
            startDate: new Date('2026-05-10'),
            endDate: new Date('2026-05-15'),
            budget: 600,
            user: user._id
        });

        await ItineraryItem.create({
            trip: trip._id,
            dayNumber: 1,
            title: 'Посета на Колисеум',
            time: '10:00',
            notes: 'Купени се билети онлајн'
        });

        await Attraction.create({
            name: 'Колисеум',
            city: 'Рим',
            category: 'historical',
            description: 'Антички амфитеатар',
            price: 16
        });

        await DestinationInfo.create({
            cityName: 'Рим',
            country: 'Италија',
            currencyCode: 'EUR',
            exchangeRateToMKD: 61.5,
            avgTemperature: 24
        });

        res.json({ message: 'Базата е успешно наполнета со иницијални податоци!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /api/trips:
 *   get:
 *     summary: Земање на сите патувања
 *     tags: [Trips]
 *     responses:
 *       200:
 *         description: Листа на сите патувања
 */
router.get('/trips', async (req, res) => {
    try {
        const trips = await Trip.find().populate('user', 'username email');
        res.json(trips);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /api/trips:
 *   post:
 *     summary: Креирање на ново патување
 *     tags: [Trips]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               destination: { type: string }
 *               startDate: { type: string }
 *               endDate: { type: string }
 *               budget: { type: number }
 *     responses:
 *       201:
 *         description: Патувањето е успешно креирано
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

/**
 * @swagger
 * /api/trips/{id}:
 *   put:
 *     summary: Измена на патување
 *     tags: [Trips]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Изменето патување
 */
router.put('/trips/:id', async (req, res) => {
    try {
        const updatedTrip = await Trip.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedTrip);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

/**
 * @swagger
 * /api/trips/{id}:
 *   delete:
 *     summary: Бришење на патување
 *     tags: [Trips]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Успешно избришано патување
 */
router.delete('/trips/:id', async (req, res) => {
    try {
        await Trip.findByIdAndDelete(req.params.id);
        res.json({ message: 'Патувањето е успешно избришано' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

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

module.exports = router;