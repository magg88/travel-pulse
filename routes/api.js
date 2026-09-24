const express = require('express');
const router = express.Router();

const Trip = require('../models/Trip');
const Attraction = require('../models/Attraction');

// ==========================================
// TRIPS RUTI
// ==========================================

/**
 * @swagger
 * /api/trips:
 *   get:
 *     summary: Zemanje na site patuvanja
 *     tags: [Trips]
 *     responses:
 *       200:
 *         description: Lista na site patuvanja
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
 *     summary: Kreiranje na novo patuvanje
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
 *         description: Patuvanjeto e uspesno kreirano
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
 *     summary: Izmena na patuvanje
 *     tags: [Trips]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Izmeneto patuvanje
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
 *     summary: Brishenje na patuvanje
 *     tags: [Trips]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Uspesno izbrisano patuvanje
 */
router.delete('/trips/:id', async (req, res) => {
    try {
        await Trip.findByIdAndDelete(req.params.id);
        res.json({ message: 'Patuvanjeto e uspesno izbrisano' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// ATTRACTIONS RUTI
// ==========================================

const fetchAttractions = async (req, res) => {
    try {
        const { q, search, city, category } = req.query;
        const searchTerm = q || search || city || '';

        let conditions = [];

        if (searchTerm) {
            conditions.push({
                $or: [
                    { name: { $regex: searchTerm, $options: 'i' } },
                    { city: { $regex: searchTerm, $options: 'i' } }
                ]
            });
        }

        if (category && category !== 'Site' && category !== 'all' && category !== '') {
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
 *     summary: Prebaruvanje atrakcii spored ime, grad ili kategorija
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
 *         description: Filtrirana lista na atrakcii
 */
router.get('/attractions/search', fetchAttractions);

/**
 * @swagger
 * /api/attractions:
 *   get:
 *     summary: Zemanje na site atrakcii (poddrzuva query parametri ?q= &category=)
 *     tags: [Attractions]
 *     responses:
 *       200:
 *         description: Lista na site atrakcii
 */
router.get('/attractions', fetchAttractions);

/**
 * @swagger
 * /api/attractions:
 *   post:
 *     summary: Kreiranje ili azuriranje na atrakcija (sprecuva duplikati)
 *     tags: [Attractions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - city
 *             properties:
 *               name:
 *                 type: string
 *                 example: Tandem paraglajding od Galicica
 *               city:
 *                 type: string
 *                 example: Ohrid
 *               category:
 *                 type: string
 *                 example: Avantura
 *               description:
 *                 type: string
 *                 example: Vozbudliv let so paraglajder so sletuvanje do ezeroto.
 *               details:
 *                 type: string
 *                 example: 🪂 Vklucuva oprema, instruktor i snimka.
 *               price:
 *                 type: number
 *                 example: 70
 *               currency:
 *                 type: string
 *                 example: EUR
 *     responses:
 *       200:
 *         description: Atrakcijata e uspesno azurirana ili kreirana
 */
router.post('/attractions', async (req, res) => {
    try {
        const { name, city } = req.body;

        if (!name || !city) {
            return res.status(400).json({ error: 'Imeto i gradot se zadolzitelni.' });
        }

        const attraction = await Attraction.findOneAndUpdate(
            { name: name.trim(), city: city.trim() },
            req.body,
            { new: true, upsert: true, runValidators: true }
        );

        res.status(200).json(attraction);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

/**
 * @swagger
 * /api/attractions/{id}:
 *   put:
 *     summary: Izmena na postoecka atrakcija preku ID
 *     tags: [Attractions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               price: { type: number, example: 70 }
 *               currency: { type: string, example: "EUR" }
 *     responses:
 *       200:
 *         description: Uspesno izmeneta atrakcija
 */
router.put('/attractions/:id', async (req, res) => {
    try {
        const updatedAttraction = await Attraction.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true }
        );
        res.json(updatedAttraction);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;