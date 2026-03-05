const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    fabric: { type: String, required: true },
    material: { type: String },          // e.g. 'Cotton', 'Polyester', 'Velvet'
    transparency: { type: String },      // e.g. 'Sheer', 'Semi-Sheer', 'Blackout'
    sizes: [{ type: String }],
    colors: [{ type: String }],
    description: { type: String, required: true },
    images: [{ type: String }],
    room: { type: String },
    isBestSeller: { type: Boolean, default: false },
    fastDelivery: { type: Boolean, default: false },
    stock: { type: Number, default: 50 },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
