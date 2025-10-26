const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../../src/models/User');
const Product = require('../../src/models/Product');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ MongoDB Connected');
};

const users = [
  {
    name: 'Admin User',
    email: 'admin@millets.com',
    password: 'admin123',
    phone: '9876543210',
    role: 'admin',
    isVerified: true,
    isActive: true
  },
  {
    name: 'Ramesh Kumar',
    email: 'farmer@example.com',
    password: 'farmer123',
    phone: '9876543211',
    role: 'farmer',
    address: {
      street: 'Village Road',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001',
      country: 'India'
    },
    farmDetails: {
      farmName: 'Green Valley Farm',
      farmSize: 10,
      farmLocation: 'Bangalore Rural',
      certifications: ['Organic']
    },
    isVerified: true,
    isActive: true
  },
  {
    name: 'Suresh Industries',
    email: 'processor@example.com',
    password: 'processor123',
    phone: '9876543212',
    role: 'processor',
    address: {
      street: 'Industrial Area',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500001',
      country: 'India'
    },
    businessDetails: {
      businessName: 'Suresh Millets Processing',
      gstNumber: 'GST123456789',
      licenseNumber: 'LIC123456'
    },
    isVerified: true,
    isActive: true
  },
  {
    name: 'Priya Sharma',
    email: 'customer@example.com',
    password: 'customer123',
    phone: '9876543213',
    role: 'customer',
    address: {
      street: 'MG Road',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      country: 'India'
    },
    isVerified: true,
    isActive: true
  }
];

const products = [
  {
    name: 'Organic Pearl Millet',
    description: 'Premium quality organic pearl millet, rich in iron and fiber. Perfect for making rotis and porridge.',
    milletType: 'Pearl Millet',
    category: 'Raw Grain',
    price: 80,
    unit: 'kg',
    quantity: 1000,
    minOrderQuantity: 10,
    images: [
      { url: '/uploads/products/pearl-millet.jpg', publicId: 'pearl-millet' }
    ],
    location: {
      state: 'Karnataka',
      district: 'Bangalore',
      pincode: '560001'
    },
    nutritionalInfo: {
      protein: 11,
      fiber: 8,
      iron: 8,
      calcium: 42,
      calories: 378
    },
    benefits: [
      'Rich in iron',
      'Good for diabetics',
      'Helps in weight loss',
      'Gluten-free'
    ],
    storage: 'Store in a cool, dry place',
    shelfLife: '6 months',
    isVerified: true,
    verificationStatus: 'approved',
    isActive: true,
    tags: ['organic', 'gluten-free', 'healthy']
  },
  {
    name: 'Finger Millet Flour',
    description: 'Fresh finger millet flour (ragi flour), stone ground and unpolished. Excellent for babies and health-conscious individuals.',
    milletType: 'Finger Millet',
    category: 'Flour',
    price: 60,
    unit: 'kg',
    quantity: 500,
    minOrderQuantity: 5,
    images: [
      { url: '/uploads/products/ragi-flour.jpg', publicId: 'ragi-flour' }
    ],
    location: {
      state: 'Karnataka',
      district: 'Bangalore',
      pincode: '560001'
    },
    nutritionalInfo: {
      protein: 7,
      fiber: 11,
      iron: 3.9,
      calcium: 364,
      calories: 328
    },
    benefits: [
      'High in calcium',
      'Good for bones',
      'Aids digestion',
      'Controls blood sugar'
    ],
    storage: 'Refrigerate after opening',
    shelfLife: '3 months',
    isVerified: true,
    verificationStatus: 'approved',
    isActive: true,
    tags: ['flour', 'ragi', 'healthy', 'baby-food']
  }
];

const seedData = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await Product.deleteMany();

    console.log('🗑️  Data Deleted');

    const createdUsers = await User.insertMany(users);
    console.log('✅ Users Seeded');

    products[0].seller = createdUsers[1]._id;
    products[0].sellerType = 'farmer';
    products[1].seller = createdUsers[2]._id;
    products[1].sellerType = 'processor';

    await Product.insertMany(products);
    console.log('✅ Products Seeded');

    console.log('🎉 Database Seeded Successfully!');
    console.log('\n📧 Test Accounts:');
    console.log('Admin: admin@millets.com / admin123');
    console.log('Farmer: farmer@example.com / farmer123');
    console.log('Processor: processor@example.com / processor123');
    console.log('Customer: customer@example.com / customer123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

seedData();