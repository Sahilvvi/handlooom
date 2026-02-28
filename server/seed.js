const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const productsData = require('../src/data/products.json');

dotenv.config();

const seedProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB for seeding');

        await Product.deleteMany();
        console.log('Previous products removed');

        await Product.insertMany(productsData);
        console.log('Database seeded with products from JSON');

        process.exit();
    } catch (err) {
        console.error('Error seeding database:', err);
        process.exit(1);
    }
};

seedProducts();
