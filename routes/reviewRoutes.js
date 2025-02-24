const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { addReview, getReviews } = require('../controllers/reviewController');

const router = express.Router();

router.post('/:bookId/reviews', protect, addReview);
router.get('/:bookId/reviews', getReviews);

// 📌 Добавление отзыва к книге
router.post('/:bookId', protect, async (req, res) => {
  const { rating, comment } = req.body;
  const { bookId } = req.params;
  const userId = req.user?.id; // ✅ Проверяем, есть ли `req.user.id`

  if (!rating || !comment) {
    return res.status(400).json({ message: 'Please provide rating and comment' });
  }

  try {
    console.log(`Adding review: Book ${bookId}, User ${userId}, Rating ${rating}, Comment: ${comment}`);
    
    const review = new Review({ bookId, userId, rating, comment });
    await review.save();
    res.status(201).json(review);
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ message: 'Error adding review', error });
  }
});

// 📌 Получение всех отзывов для книги
router.get('/:bookId', async (req, res) => {
  const { bookId } = req.params;

  try {
    console.log(`Fetching reviews for Book ${bookId}`);
    
    const reviews = await Review.find({ bookId }).populate('userId', 'username');
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Error fetching reviews', error });
  }
});

module.exports = router;
