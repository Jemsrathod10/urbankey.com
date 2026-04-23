const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// ✅ 1. Get Inbox List
router.get('/conversations/all', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }]
    }).sort({ createdAt: -1 });

    const contactIds = new Set();
    messages.forEach(msg => {
      if (msg.sender.toString() !== userId.toString()) contactIds.add(msg.sender.toString());
      if (msg.receiver.toString() !== userId.toString()) contactIds.add(msg.receiver.toString());
    });

    const contacts = await User.find({ _id: { $in: Array.from(contactIds) } }).select('name email role');
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching conversations", error: error.message });
  }
});

// ✅ 2. Get specific chat messages & auto-mark as read
router.get('/:receiverId', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const receiverId = req.params.receiverId;

    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: receiverId },
        { sender: receiverId, receiver: userId }
      ]
    }).sort({ createdAt: 1 });

    // Mark messages from the other person as read when I open the chat
    await Message.updateMany(
      { sender: receiverId, receiver: userId, read: false },
      { $set: { read: true } }
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching messages", error: error.message });
  }
});

module.exports = router;