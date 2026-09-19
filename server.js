const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Овозможи читање на JSON и податоци од форми
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Служење на статичките HTML маски од Дел 1
app.use(express.static(path.join(__dirname, 'part1-static')));

// Главна рута — го отвора екранот за најава
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'part1-static', 'login-register.html'));
});

// Стартување на серверот
app.listen(PORT, () => {
    console.log(`🚀 Серверот е успешно стартуван на: http://localhost:${PORT}`);
});