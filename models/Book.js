const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function () {
      return this.isPublic === false; // Пользователь обязателен, если книга не публичная
    }
  },
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Reading', 'Completed', 'Wishlist'],
    default: 'Reading',
  },
  isPublic: {
    type: Boolean,
    default: false, // По умолчанию книга не публичная
  }
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
