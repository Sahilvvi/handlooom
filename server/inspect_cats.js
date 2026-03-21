const mongoose = require('mongoose');
require('dotenv').config();

async function check() {
    await mongoose.connect(process.env.MONGODB_URI);
    const Product = require('./models/Product');
    const categories = await Product.distinct('category');
    console.log('Categories in DB:', categories);
    const sample = await Product.findOne({ category: categories[0] });
    console.log('Sample Product:', JSON.stringify(sample, null, 2));
    process.exit();
}
check();
