const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  property: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Property' // કઈ પ્રોપર્ટી માટે મેસેજ છે
  },
  customer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' // કયા યુઝરે મેસેજ કર્યો
  },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  message: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['new', 'contacted', 'closed'], 
    default: 'new' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Inquiry', inquirySchema);