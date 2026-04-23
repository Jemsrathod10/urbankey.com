const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI);

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  phone: String,
  role: String,
  status: String
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function createAdmin() {
  try {
    // Check if admin exists
    const adminExists = await User.findOne({ email: 'admin@propertyhub.com' });
    
    if (adminExists) {
      console.log('❌ Admin already exists!');
      process.exit(0);
    }

    // Create admin
    const hashedPassword = await bcrypt.hash('Admin@2024', 10);
    
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@propertyhub.com',
      password: hashedPassword,
      phone: '9876543210',
      role: 'admin',
      status: 'active'
    });

    console.log('✅ Admin created successfully!');
    console.log('📧 Email: admin@propertyhub.com');
    console.log('🔑 Password: Admin@2024');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createAdmin();