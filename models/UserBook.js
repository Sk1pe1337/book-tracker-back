const mongoose = require('mongoose');

const userBookSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
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
    default: false, // Личные книги всегда приватные
  }
}, { timestamps: true });

module.exports = mongoose.model('UserBook', userBookSchema, 'userBooks');
