const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
require('dotenv').config();

const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/travelpulse';
const authRoutes = require('./routes/auth');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Служење на статичките HTML маски од Дел 1
app.use(express.static(path.join(__dirname, 'part1-static')));

// Swagger Конфигурација
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'TravelPulse REST API',
            version: '1.0.0',
            description: 'REST API документација за TravelPulse веб-апликацијата'
        },
        servers: [
            { url: `http://localhost:${PORT}` }
        ]
    },
    apis: ['./routes/*.js']
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Регистрирање на API рутите
app.use('/api', apiRoutes);
app.use('/api/auth', authRoutes);

// Почетна рута
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'part1-static', 'login-register.html'));
});

// Поврзување со MongoDB и стартување на серверот
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('✅ Успешно поврзување со MongoDB базата!');
        app.listen(PORT, () => {
            console.log(`🚀 Серверот работи на: http://localhost:${PORT}`);
            console.log(`📄 Swagger документација: http://localhost:${PORT}/api-docs`);
        });
    })
    .catch(err => {
        console.error('❌ Грешка при поврзување со MongoDB:', err.message);
        // Серверот сепак ќе се стартува за да работат статичките маски
        app.listen(PORT, () => {
            console.log(`🚀 Серверот работи на: http://localhost:${PORT}`);
            console.log(`📄 Swagger документација: http://localhost:${PORT}/api-docs`);
        });
    });