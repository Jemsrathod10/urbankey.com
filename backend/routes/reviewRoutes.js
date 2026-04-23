const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

// તારા પ્રોજેક્ટમાં મિડલવેરનું નામ 'auth' હોય તો નીચે મુજબ પાથ લખો
// જો ફાઈલનું નામ 'authMiddleware.js' હોય તો એ મુજબ ફેરફાર કરવો
const { protect } = require('../middleware/auth'); 

// ૧. GET: પ્રોપર્ટી વાઇઝ રિવ્યુ મેળવવા
router.get('/:propertyId', async (req, res) => {
  try {
    const reviews = await Review.find({ property: req.params.propertyId })
      .populate('user', 'name')
      .sort('-createdAt');
    res.status(200).json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// ૨. POST: નવો રિવ્યુ ઉમેરવો
router.post('/:propertyId', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const propertyId = req.params.propertyId;
    const userId = req.user.id;

    const existingReview = await Review.findOne({ property: propertyId, user: userId });
    if (existingReview) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this property' });
    }

    const review = new Review({
      property: propertyId,
      user: userId,
      rating: Number(rating),
      comment
    });

    await review.save();
    res.status(201).json({ success: true, message: 'Review added successfully', review });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

module.exports = router;