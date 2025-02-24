const Review = require('../models/Review');
const Book = require('../models/Book');

// 📌 Добавление отзыва к книге
const addReview = async (req, res) => {
  const { rating, comment } = req.body;
  const { bookId } = req.params;
  const userId = req.user?.id;

  if (!rating || !comment) {
    return res.status(400).json({ message: 'Please provide rating and comment' });
  }

  try {
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const review = new Review({
      bookId,
      userId,
      rating,
      comment,
    });

    await review.save();
    res.status(201).json(review);
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ message: 'Error adding review', error });
  }
};

// 📌 Получение всех отзывов для книги
const getReviews = async (req, res) => {
  const { bookId } = req.params;

  try {
    const reviews = await Review.find({ bookId }).populate('userId', 'username');
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Error fetching reviews', error });
  }
};

module.exports = { addReview, getReviews };
