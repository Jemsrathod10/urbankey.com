const express = require('express');
const router = express.Router();
const Property = require('../models/Property');
const User = require('../models/User'); 
const { protect, authorize } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `prop-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5000000 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) return cb(null, true);
    cb('Images only!');
  }
});

// GET COUNTS FOR DASHBOARD STATS
router.get('/stats', async (req, res) => {
  try {
    const usersCount = await User.countDocuments() || 0;
    const propertiesCount = await Property.countDocuments({ status: 'approved' }) || 0;
    const inquiriesCount = 0; 

    res.status(200).json({
      success: true,
      users: usersCount,
      properties: propertiesCount,
      inquiries: inquiriesCount
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET ALL PENDING PROPERTIES
router.get('/pending', async (req, res) => {
  try {
    const properties = await Property.find({ status: 'pending' }).sort({ createdAt: -1 });
    res.json(Array.isArray(properties) ? properties : []); 
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET ALL PROPERTIES
router.get('/', async (req, res) => {
  try {
    const { status, purpose, propertyType, city, minPrice, maxPrice, bedrooms, furnishing, page = 1, limit = 9 } = req.query;
    let query = {};
    if (status && status !== 'all') {
      query.status = status;
    } else if (!status) {
      query.status = 'approved';
    }
    if (purpose) query.purpose = purpose;
    if (propertyType) query.propertyType = propertyType;
    if (city) query['location.city'] = new RegExp(city, 'i');
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (bedrooms) query['specifications.bedrooms'] = Number(bedrooms);
    if (furnishing) query['specifications.furnishing'] = furnishing;

    const properties = await Property.find(query)
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Property.countDocuments(query);
    res.json({ success: true, properties, totalPages: Math.ceil(count / limit), currentPage: page, total: count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET LOGGED IN USER'S PROPERTIES
router.get('/user/my-properties', protect, async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, properties });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET SINGLE PROPERTY
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('owner', 'name email phone');

    if (!property) return res.status(404).json({ message: 'Property not found' });
    
    res.json({ success: true, property });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE PROPERTY
router.post('/', protect, authorize('owner', 'agent', 'admin'), upload.array('images', 10), async (req, res) => {
  try {
    const propertyData = {
      ...req.body,
      owner: req.user._id,
      images: req.files ? req.files.map(f => f.filename) : [],
      status: req.user.role === 'admin' ? 'approved' : 'pending'
    };

    const safeParse = (data) => {
      if (typeof data === 'string') {
        try { return JSON.parse(data); } catch (e) { return data; }
      }
      return data;
    };

    if (req.body.location) propertyData.location = safeParse(req.body.location);
    if (req.body.specifications) propertyData.specifications = safeParse(req.body.specifications);
    if (req.body.contact) propertyData.contact = safeParse(req.body.contact);

    const property = await Property.create(propertyData);
    res.status(201).json({ success: true, property });
  } catch (error) {
    console.error("Create Property Error:", error);
    res.status(500).json({ message: error.message });
  }
});

// UPDATE PROPERTY
router.put('/:id', protect, async (req, res) => {
  try {
    let property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Not found' });
    if (property.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    property = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, property });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE PROPERTY
router.delete('/:id', protect, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Not found' });
    if (property.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await property.deleteOne();
    res.json({ success: true, message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// APPROVE PROPERTY (ADMIN ONLY)
router.put('/:id/approve', protect, authorize('admin'), async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true });
    res.json({ success: true, property });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// REJECT/DELETE PROPERTY (ADMIN ONLY) - Support for DELETE method
router.delete('/:id/reject', protect, authorize('admin'), async (req, res) => {
  try {
    await Property.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Property rejected and deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// REJECT PROPERTY (ADMIN ONLY) - Support for PUT method (Matches your Frontend action)
router.put('/:id/reject', protect, authorize('admin'), async (req, res) => {
  try {
    await Property.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Property rejected and deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;