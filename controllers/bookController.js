const mongoose = require('mongoose');
const Book = require('../models/Book'); // 📚 Публичные книги
const UserBook = require('../models/UserBook'); // 📖 Личные книги

// 📌 Получение всех публичных книг (Общая библиотека)
const getPublicBooks = async (req, res) => {
  try {
    const books = await Book.find({ isPublic: true });
    res.json(books);
  } catch (error) {
    console.error('Error fetching public books:', error);
    res.status(500).json({ message: 'Error fetching public books' });
  }
};

// 📌 Получение книг пользователя (My Books)
const getUserBooks = async (req, res) => {
  try {
    const books = await UserBook.find({ user: req.user.id });
    res.json(books);
  } catch (error) {
    console.error('Error fetching user books:', error);
    res.status(500).json({ message: 'Error fetching user books' });
  }
};

// 📌 Добавление новой книги пользователем (сохранение в userBooks)
const addBook = async (req, res) => {
  try {
    const { title, author, status } = req.body;

    if (!title || !author) {
      return res.status(400).json({ message: 'Please provide title and author' });
    }

    const book = new UserBook({
      user: req.user.id,
      title,
      author,
      status: status || 'Reading',
      isPublic: false // Личные книги всегда приватные
    });

    const savedBook = await book.save();
    res.status(201).json(savedBook);
  } catch (error) {
    console.error('Error adding book:', error);
    res.status(500).json({ message: 'Error adding book', error: error.message });
  }
};

// 📌 Обновление книги пользователя (только в userBooks)
const updateBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const { title, author, status } = req.body;

    if (!bookId || !mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ message: 'Invalid book ID' });
    }

    const book = await UserBook.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not allowed to update this book' });
    }

    if (title) book.title = title;
    if (author) book.author = author;
    if (status) book.status = status;

    await book.save();
    res.json({ message: 'Book updated successfully', book });
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ message: 'Failed to update book' });
  }
};

// 📌 Удаление книги пользователя (только из userBooks)
const deleteBook = async (req, res) => {
  try {
    const bookId = req.params.id;

    if (!bookId || !mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ message: 'Invalid book ID' });
    }

    const book = await UserBook.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not allowed to delete this book' });
    }

    await UserBook.findByIdAndDelete(bookId);
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ message: 'Failed to delete book' });
  }
};

// 📌 Экспорт функций контроллера
module.exports = { getPublicBooks, getUserBooks, addBook, updateBook, deleteBook };
