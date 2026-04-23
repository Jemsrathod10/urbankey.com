const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const http = require('http'); 
const { Server } = require('socket.io'); 
const Message = require('./models/Message'); 
const multer = require('multer'); 

dotenv.config();

const app = express();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

const server = http.createServer(app); 
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

app.use(cors()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected Successfully');
    createAdminUser();
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1); 
  });

app.use('/api/auth', require('./routes/auth'));
app.use('/api/properties', require('./routes/properties'));
app.use('/api/users', require('./routes/users'));
app.use('/api/inquiries', require('./routes/inquiries'));
app.use('/api/favorites', require('./routes/favorites'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));

app.post('/api/chat/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const imageUrl = `uploads/${req.file.filename}`;
    res.json({ imageUrl });
  } catch (error) {
    res.status(500).json({ message: 'Upload error' });
  }
});

// ✅ Tracking Online Users
const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log('User Connected:', socket.id);

  socket.on('join', (userId) => {
    socket.join(userId);
    onlineUsers.set(userId, socket.id);
    console.log(`User ${userId} joined room`);
    // Notify others that user is online
    io.emit('statusUpdate', { userId, status: 'online' });
  });

  // ✅ Check Online Status Logic
  socket.on('checkOnline', ({ userId }) => {
    const isOnline = onlineUsers.has(userId);
    socket.emit('userStatus', { userId, status: isOnline ? 'online' : 'offline' });
  });

  socket.on('sendMessage', async (data) => {
    try {
      const { sender, receiver, text } = data;
      const newMessage = new Message({
        sender,
        receiver,
        text,
        read: false
      });
      await newMessage.save();
      io.to(receiver).emit('getMessage', newMessage);
      io.to(sender).emit('getMessage', newMessage);
    } catch (error) {
      console.error('Socket Message Error:', error);
    }
  });

  // ✅ Mark as Read Logic for Blue Tick
  socket.on('markAsRead', async ({ sender, receiver }) => {
    try {
      await Message.updateMany(
        { sender: sender, receiver: receiver, read: false },
        { $set: { read: true } }
      );
      const senderSocketId = onlineUsers.get(sender);
      if (senderSocketId) {
        io.to(senderSocketId).emit('messageRead', { sender, receiver });
      }
    } catch (err) {
      console.error("Mark as read error:", err);
    }
  });

  socket.on('disconnect', () => {
    let disconnectedUserId;
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        disconnectedUserId = userId;
        onlineUsers.delete(userId);
        break;
      }
    }
    if (disconnectedUserId) {
      io.emit('statusUpdate', { userId: disconnectedUserId, status: 'offline' });
    }
    console.log('User Disconnected');
  });
});

app.get('/', (req, res) => {
  res.json({ message: 'Property Portal API Running', status: 'Active', time: new Date().toLocaleString() });
});

async function createAdminUser() {
  try {
    const User = require('./models/User');
    const adminEmail = 'admin@propertyhub.com';
    const adminExists = await User.findOne({ email: adminEmail });
    if (adminExists) {
      console.log('ℹ️ Admin user already exists');
      return;
    }

    const admin = new User({
      name: 'Super Admin',
      email: adminEmail,
      password: 'Admin@2024', 
      phone: '9876543210',
      role: 'admin',
      termsAccepted: true,
      isApproved: true
    });
    await admin.save();
    console.log('✅ Admin user created successfully!');
  } catch (error) {
    console.error('❌ Admin creation error:', error.message);
  }
}

app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Internal Server Error' 
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Local Access: http://localhost:${PORT}`);
});