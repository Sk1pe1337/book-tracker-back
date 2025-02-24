// Подключаем переменные окружения
require("dotenv").config();

// Импорт необходимых модулей
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const helmet = require("helmet"); // Защита от атак
const rateLimit = require("express-rate-limit"); // Ограничение запросов

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes"); // 📌 Маршруты книг

// Подключаем базу данных
connectDB();

// Создаем Express приложение
const app = express();

// --- Логирование запросов ---
app.use(morgan("dev"));

// --- Защита заголовков ---
app.use(helmet());

// --- Ограничение количества запросов (Rate Limiting) ---
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // Макс. 100 запросов с одного IP
  message: "Too many requests, please try again later.",
});
app.use(limiter);

// ✅ Доверяем прокси (нужно для Render/Vercel)
app.set("trust proxy", 1);

// --- Настройка CORS ---
app.use(
  cors({
    origin: "https://book-tracker-front.onrender.com", // ✅ Разрешаем фронтенд
    methods: "GET,POST,PUT,DELETE,PATCH,OPTIONS",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true, // ✅ Разрешаем cookies и токены
  })
);

// ✅ Разрешаем preflight-запросы (OPTIONS)
app.options("*", cors());

// --- Middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// --- Маршруты ---
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);

// --- Тестовый маршрут ---
app.get("/", (req, res) => {
  res.send("📚 Book Tracker API is running...");
});

// --- Обработка ошибок 404 ---
app.use((req, res) => {
  res.status(404).json({ message: "API route not found" });
});

// --- Глобальная обработка ошибок ---
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// --- Запуск сервера ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
