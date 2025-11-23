const mongoose = require('mongoose');
require('dotenv').config();
const Shop = require('../models/Shop');

const shops = [
    {
        name: 'Cashify',
        rating: 4.8,
        reviewCount: 482,
        category: 'Mobile phone repair shop',
        address: 'Vikas Market, Mathura',
        city: 'Mathura',
        state: 'Uttar Pradesh',
        openingHours: 'Open',
        closingHours: '9 pm',
        features: {
            inStoreShopping: true,
            inStorePickup: true,
            delivery: true
        },
        description: 'Buy, Sell & Repair in Mathura'
    },
    {
        name: 'Jaswant Telecom',
        rating: 4.4,
        reviewCount: 839,
        category: 'Mobile phone repair shop',
        address: 'Surya Nagar, Mathura',
        city: 'Mathura',
        state: 'Uttar Pradesh',
        openingHours: 'Open',
        closingHours: '9 pm',
        yearsInBusiness: '15+ years in business',
        description: 'Mobile Repair Hub - Best iPhone mobile repair and best shop in mathura',
        features: {
            inStoreShopping: true,
            delivery: true
        }
    },
    {
        name: 'Manu Mobile',
        rating: 4.5,
        reviewCount: 120,
        category: 'Mobile phone repair shop',
        address: 'Rani ki Mandi, Mathura',
        city: 'Mathura',
        state: 'Uttar Pradesh',
        openingHours: 'Open',
        closingHours: '9:30 pm',
        description: 'Repairing Centre - Expert mobile repair services',
        features: {
            inStoreShopping: true
        }
    },
    {
        name: 'Sharma Telecom',
        rating: 4.8,
        reviewCount: 156,
        category: 'Mobile phone repair shop',
        address: 'NH 19, near Jaigurudev, Mathura',
        city: 'Mathura',
        state: 'Uttar Pradesh',
        pincode: '281001',
        openingHours: 'Open',
        closingHours: '9 pm',
        yearsInBusiness: '3+ years in business',
        description: 'Mobile Repairing & Electronics - Quality service and repairs',
        features: {
            inStoreShopping: true,
            delivery: true
        }
    },
    {
        name: 'Priya Telecom',
        rating: 4.6,
        reviewCount: 95,
        category: 'Mobile phone repair shop',
        address: 'Krishna Nagar Road, Krishna Nagar, Mathura',
        city: 'Mathura',
        state: 'Uttar Pradesh',
        openingHours: 'Open',
        closingHours: '10 pm',
        description: 'Expert mobile repair and service center',
        features: {
            inStoreShopping: true,
            kerbsidePickup: true
        }
    }
];

async function seedShops() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/rephome');
        console.log('Connected to MongoDB');

        // Clear existing shops before seeding
        await Shop.deleteMany({});
        console.log('Cleared existing shops');

        // Insert shops
        const inserted = await Shop.insertMany(shops);
        console.log(`✅ Successfully seeded ${inserted.length} shops`);

        process.exit(0);
    } catch (error) {
        console.error('Error seeding shops:', error);
        process.exit(1);
    }
}

seedShops();

