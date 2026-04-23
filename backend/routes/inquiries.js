const express = require('express');
const router = express.Router();
const Inquiry = require('../models/Inquiry');

// મેસેજ મોકલવા માટે (કસ્ટમર માટે) - URL: /api/inquiries/send
router.post('/send', async (req, res) => {
  try {
    const { name, email, phone, message, property, customer } = req.body;

    const newInquiry = new Inquiry({
      name,
      email,
      phone,
      message,
      property: property || null, // જો કોઈ પ્રોપર્ટી માટે હોય તો એની ID
      customer: customer || null  // જો યુઝર લોગિન હોય તો એની ID
    });

    await newInquiry.save();
    res.status(201).json({ success: true, message: 'Inquiry sent successfully!' });
  } catch (error) {
    console.error('Inquiry Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// બધા મેસેજ જોવા માટે (એડમિન માટે) - URL: /api/inquiries/all
router.get('/all', async (req, res) => {
  try {
    const inquiries = await Inquiry.find()
      .populate('property', 'title') // પ્રોપર્ટીનું નામ જોવા માટે
      .sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ નવો રૂટ: મેસેજ ડિલીટ કરવા માટે - URL: /api/inquiries/:id
router.delete('/:id', async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }
    await inquiry.deleteOne();
    res.json({ success: true, message: 'Inquiry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;