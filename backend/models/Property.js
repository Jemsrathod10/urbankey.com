const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  propertyType: {
    type: String,
    required: true,
    enum: ['Flat', 'House', 'Villa', 'Plot', 'Farmhouse', 'Office', 'Shop', 'Warehouse']
  },
  purpose: {
    type: String,
    required: true,
    enum: ['Sell', 'Rent', 'Lease']
  },
  price: { type: Number, required: true, min: 0 }, 
  location: {
    address: String,
    city: { type: String, required: true },
    state: String,
    pincode: String
  },
  specifications: {
    bedrooms: { type: Number, default: 0 },
    bathrooms: { type: Number, default: 0 },
    area: { type: Number, required: true },
    furnishing: {
      type: String,
      enum: ['Furnished', 'Semi-Furnished', 'Unfurnished', 'Not Applicable'], // Not Applicable ઉમેર્યું છે કારણ કે ફ્રન્ટએન્ડ મોકલે છે
      default: 'Unfurnished'
    },
    parking: { type: Number, default: 0 },
    floor: Number
  },
  amenities: [String],
  images: [String],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  contact: {
    name: String,
    phone: String,
    email: String
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  featured: { type: Boolean, default: false },
  views: { type: Number, default: 0 }
}, { timestamps: true });

propertySchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Property', propertySchema);