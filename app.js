// Подключаем переменные окружения
require('dotenv').config();

// Импорт необходимых модулей
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const helmet = require('helmet'); // Защита от атак
const rateLimit = require('express-rate-limit'); // Ограничение запросов

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes'); // 📌 Исправлен путь
const { protect } = require('./middleware/authMiddleware');

// Подключаем базу данных
connectDB();

// Создаем Express приложение
const app = express();

// --- Логирование запросов ---
app.use(morgan('dev'));

// --- Защита заголовков ---
app.use(helmet());

// --- Ограничение количества запросов (Rate Limiting) ---
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // Макс. 100 запросов с одного IP
  message: 'Too many requests, please try again later.',
});
app.use(limiter);

// --- Настройка CORS ---
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000', 
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // ✅ Добавлен `PATCH`
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// --- Middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// --- Маршруты ---
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes); // 📌 Маршруты книг без `protect`, защита внутри

// --- Тестовый маршрут ---
app.get('/', (req, res) => {
  res.send('📚 Book Tracker API is running...');
});

// --- Обработка ошибок 404 ---
app.use((req, res) => {
  res.status(404).json({ message: 'API route not found' });
});

// --- Глобальная обработка ошибок ---
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// --- Запуск сервера ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
