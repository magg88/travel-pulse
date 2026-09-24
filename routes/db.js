const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Trip = require('../models/Trip');
const Attraction = require('../models/Attraction');
const Review = require('../models/Review');
const Expense = require('../models/Expense');

/**
 * @swagger
 * /db:
 *   delete:
 *     summary: Бришење на сите податоци од базата (Бришење на сите колекции)
 *     tags: [Database Management]
 *     responses:
 *       200:
 *         description: Базата е успешно испразнета
 */
router.delete('/', async (req, res) => {
    try {
        await User.deleteMany({});
        await Trip.deleteMany({});
        await Attraction.deleteMany({});
        await Review.deleteMany({});
        await Expense.deleteMany({});

        res.json({ message: 'Базата е успешно испразнета!' });
    } catch (err) {
        res.status(500).json({ error: 'Грешка при бришење на базата.' });
    }
});

/**
 * @swagger
 * /db:
 *   post:
 *     summary: Внесување иницијални тест-податоци (Seed Database)
 *     tags: [Database Management]
 *     responses:
 *       200:
 *         description: Базата е успешно наполнета со тест податоци
 */
router.post('/', async (req, res) => {
    try {
        await User.deleteMany({});
        await Trip.deleteMany({});
        await Attraction.deleteMany({});
        await Review.deleteMany({});
        await Expense.deleteMany({});

        const salt = await bcrypt.genSalt(10);
        const pass = await bcrypt.hash('123456', salt);

        const admin = await User.create({ username: 'Admin', email: 'admin@travel.com', password: pass, role: 'admin' });
        const user1 = await User.create({ username: 'Marko', email: 'marko@travel.com', password: pass, role: 'editor' });

        const att1 = await Attraction.create({
            name: 'Колисеум',
            city: 'Рим',
            category: 'Препорачано',
            description: 'Антички амфитеатар во срцето на Рим.',
            details: '🏛️ Топ атракција во Италија.'
        });

        const att2 = await Attraction.create({
            name: 'Ајфелова Кула',
            city: 'Париз',
            category: 'Популарно',
            description: 'Симболот на Париз и Франција.',
            details: '🗼 Изградена во 1889 година.'
        });

        const trip1 = await Trip.create({
            title: 'Пролет во Рим',
            destination: 'Рим',
            startDate: new Date('2026-05-01'),
            endDate: new Date('2026-05-05'),
            budget: 500,
            user: user1._id
        });

        await Review.create({
            rating: 5,
            comment: 'Неверојатно искуство, вреди да се посети!',
            user: user1._id,
            attraction: att1._id
        });

        await Expense.create({
            title: 'Авионски карти',
            amount: 120,
            category: 'Транспорт',
            trip: trip1._id
        });

        await Expense.create({
            title: 'Хотел за 4 ноќи',
            amount: 250,
            category: 'Сместување',
            trip: trip1._id
        });

        res.json({ message: 'Базата е успешно полнета со иницијални податоци за сите 5 колекции!' });
    } catch (err) {
        res.status(500).json({ error: 'Грешка при внесување иницијални податоци.', details: err.message });
    }
});

module.exports = router;