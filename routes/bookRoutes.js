const express = require('express');
const { getPublicBooks, getUserBooks, addBook, updateBook, deleteBook } = require('../controllers/bookController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// 📌 Получение общей библиотеки книг (без авторизации)
router.get('/public', getPublicBooks);

// 📌 Получение книг пользователя (My Books)
router.get('/my', protect, getUserBooks);

// 📌 Добавление новой книги пользователем (только в userBooks)
router.post('/', protect, addBook);

// 📌 Обновление книги пользователя (только в userBooks)
router.patch('/:id', protect, updateBook);

// 📌 Удаление книги пользователя (только в userBooks)
router.delete('/:id', protect, deleteBook);

module.exports = router;
