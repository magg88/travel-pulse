const express = require('express');
const router = express.Router();

const Trip = require('../models/Trip');
const Attraction = require('../models/Attraction');

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

// Допонителна логика за филтрирање
const fetchAttractions = async (req, res) => {
    try {
        const { q, search, city, category } = req.query;
        const searchTerm = q || search || city || '';

        let conditions = [];

        // Филтер за Град или Име
        if (searchTerm) {
            conditions.push({
                $or: [
                    { name: { $regex: searchTerm, $options: 'i' } },
                    { city: { $regex: searchTerm, $options: 'i' } }
                ]
            });
        }

        // Филтер за Категорија
        if (category && category !== 'Сите' && category !== 'all' && category !== '') {
            conditions.push({
                category: { $regex: category, $options: 'i' }
            });
        }

        const filter = conditions.length > 0 ? { $and: conditions } : {};

        const attractions = await Attraction.find(filter);
        res.json(attractions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * @swagger
 * /api/attractions/search:
 *   get:
 *     summary: Пребарување атракции според име, град или категорија
 *     tags: [Attractions]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Филтрирана листа на атракции
 */
router.get('/attractions/search', fetchAttractions);

/**
 * @swagger
 * /api/attractions:
 *   get:
 *     summary: Земање на сите атракции (поддржува query параметри ?q= &category=)
 *     tags: [Attractions]
 *     responses:
 *       200:
 *         description: Листа на сите атракции
 */
router.get('/attractions', fetchAttractions);

module.exports = router;