const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/travelpulse';

// ==========================================
// 1. КОНЕКЦИЈА СО MONGODB БАЗАТА
// ==========================================
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Успешно поврзано со MongoDB базата!'))
  .catch(err => console.error('❌ Грешка при поврзување со MongoDB:', err));

// ==========================================
// 2. MIDDLEWARE КОНФИГУРАЦИЈА
// ==========================================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================================
// 3. API РУТИ (БЕКЕНД)
// ==========================================
const dbRoutes = require('./routes/db');
const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');

app.use('/db', dbRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);

// ==========================================
// 4. SWAGGER ДОКУМЕНТАЦИЈА
// ==========================================
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TravelPulse REST API',
      version: '1.0.0',
      description: 'Официјална REST API документација'
    },
    servers: [{ url: `http://localhost:${PORT}` }]
  },
  apis: ['./routes/*.js']
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// ==========================================
// 5. СЕРВИРАЊЕ НА РЕАКТ ФРОНТЕНДОТ (VITE)
// ==========================================
const distPath = path.join(__dirname, 'frontend', 'dist');
app.use(express.static(distPath));

// Fallback за React Single Page Application (SPA)
app.use((req, res) => {
  // Доколку барањето е за API или DB рута што не постои, врати 404 JSON
  if (req.originalUrl.startsWith('/api') || req.originalUrl.startsWith('/db')) {
    return res.status(404).json({ error: 'Бараната API рута не е пронајдена.' });
  }

  // За сите останати веб барања, врати го index.html од фронтендот
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) {
      res.status(500).send("Грешка: Прво мора да извршите 'npm run build' во 'frontend' папката.");
    }
  });
});

// ==========================================
// 6. СТАРТУВАЊЕ НА СЕРВЕРОТ
// ==========================================
app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🚀 Апликацијата работи на: http://localhost:${PORT}`);
  console.log(`📄 Swagger UI: http://localhost:${PORT}/api/docs/`);
  console.log(`==================================================`);
});