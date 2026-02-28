const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    fabric: { type: String, required: true },
    sizes: [{ type: String }],
    colors: [{ type: String }],
    description: { type: String, required: true },
    images: [{ type: String }],
    room: { type: String },
    isBestSeller: { type: Boolean, default: false },
    stock: { type: Number, default: 50 }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
