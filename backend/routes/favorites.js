const express = require('express');
const router = express.Router();
const Favorite = require('../models/Favorite');
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id })
      .populate({
        path: 'property',
        populate: { path: 'owner', select: 'name email phone' }
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, favorites });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/:propertyId', protect, async (req, res) => {
  try {
    const existing = await Favorite.findOne({
      user: req.user._id,
      property: req.params.propertyId
    });

    if (existing) {
      return res.status(400).json({ message: 'Already in favorites' });
    }

    const favorite = await Favorite.create({
      user: req.user._id,
      property: req.params.propertyId
    });

    res.status(201).json({ success: true, favorite });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:propertyId', protect, async (req, res) => {
  try {
    await Favorite.findOneAndDelete({
      user: req.user._id,
      property: req.params.propertyId
    });
    res.json({ success: true, message: 'Removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;